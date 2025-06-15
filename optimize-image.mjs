#!/usr/bin/env node
"use strict";

import sharp from "sharp";
import fs from "fs";
import { URL } from "url";
import path from "path";
import { optimize as optimizeSvg } from "svgo";

import next from "./next.config.mjs";
import { finished } from "node:stream/promises";
import { Readable } from "node:stream";

const fileCache = new Map();

// yes, this is an out of sync cache, but it's good enough for our use case
const fileExists = (filePath) => {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }

  const exists = fs.existsSync(filePath);
  fileCache.set(filePath, exists);
  return exists;
};


const ensureDirectoryExists = (filePath) => {
  const dirName = path.dirname(filePath);
  if (!fileExists(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
};

const supportedExtensions = ["avif", "webp", "png", "jpeg", "jpg", "svg"];


class ImageOptimizer {
  constructor(sourceUrl, localSourceImagePath, localOptimizedImagePath, width, quality, extension) {
    this.sourceUrl = sourceUrl;
    this.localSourceImagePath = localSourceImagePath;
    this.localOptimizedImagePath = localOptimizedImagePath;
    this.width = parseInt(width);
    this.quality = parseInt(quality);
    this.extension = extension?.toLowerCase();
  }


  async optimize() {
    if (!fileExists(this.localSourceImagePath)) {
      await this.exclusiveInit(`download ${this.sourceUrl}`, async () => {
        this.info(this.sourceUrl, this.localSourceImagePath, this.localOptimizedImagePath, this.width, this.quality, this.extension);
        await this.downloadIfNotExists(this.sourceUrl, this.localSourceImagePath);
      });
    }

    let generatedSizes = (next.images?.imageSizes || []).concat(next.images?.deviceSizes || []);
    generatedSizes.push(this.width);
    generatedSizes = generatedSizes.filter((value, index, self) => self.indexOf(value) === index);

    await Promise.all(generatedSizes.map(async (width) => {
      const path = this.localOptimizedImagePath.replace(/(.+-opt-)(\d+)(\.[a-z0-9]{3,4})$/gmi, `$1${width}$3`);
      if (!fileExists(path)) {
        await this.exclusiveInit(`resize ${this.localSourceImagePath} to ${path}`, async () => {
          await this.resizeImage(this.localSourceImagePath, path, width, this.quality, this.extension);
        });
      }
    }));
  }

  async exclusiveInit(name, closure) {
    if (this[`${name}_initialized`]) {
      return this[`${name}_value`];
    }

    // there might be concurrent calls, so we wait for them to finish. Poor-man's mutex.
    await this.spinLock(name, true);

    if (this[`${name}_initialized`]) {
      return this[`${name}_value`];
    }

    this.info(`Initializing ${name} ...`);

    this[`${name}_value`] = await closure();

    this.info(`Initialized ${name}.`);

    this[`${name}_initializing`] = false;
    this[`${name}_initialized`] = true;

    return this[`${name}_value`];
  }

  async spinLock(name, tryAcquire = false) {
    if (this[`${name}_initialized`]) {
      return;
    }

    if (!this[`${name}_initializing`] && tryAcquire) {
      this[`${name}_initializing`] = true;
      return;
    }

    while (this[`${name}_initializing`]) {
      let counter = 0;
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          counter++;
          if (counter > 3000) {
            reject(new Error(`${name} initialization timeout`));
            return;
          }
          resolve();
        }, 50)
      );
    }
  }

  async downloadIfNotExists(url, dest) {
    if (fileExists(dest)) {
      return;
    }

    ensureDirectoryExists(dest);

    // Check if the URL is relative (doesn't have a protocol)
    if (!url.match(/^[a-z]+:\/\//i)) {
      // For relative paths, just copy the file if it exists
      if (fileExists(url)) {
        fs.copyFileSync(url, dest);
        return;
      }

      // Extract the base filename for the destination
      const baseFilename = url.split('?')[0];
      dest = dest || path.basename(baseFilename);
    } else {
      // For absolute URLs, proceed as before
      try {
        const uri = new URL(url);
        dest = dest || path.basename(uri.pathname);
      } catch (error) {
        console.error("Optimize-Image: invalid URL format", url, error);
        throw error;
      }
    }

    const tempDest = `${dest}.part.${Math.random().toString(36).substring(7)}`;

    try {
      // Only fetch if it's an absolute URL
      if (url.match(/^[a-z]+:\/\//i)) {
        const response = await fetch(url, { redirect: "follow" });
        if (!response.ok) {
          throw new Error(`Download request failed, response status: ${response.status} ${response.statusText}`);
        }
        const fileStream = fs.createWriteStream(tempDest, { flags: "wx" });
        await finished(Readable.fromWeb(response.body).pipe(fileStream));
        await fs.promises.rename(tempDest, dest);
      } else {
        // For relative URLs that we couldn't handle earlier, log an error
        throw new Error(`Cannot download relative URL that doesn't exist locally: ${url}`);
      }
    } catch (error) {
      console.error("Optimize-Image: error during download", error);
      throw error;
    }
  }

  async resizeImage(sourceFilePath, destinationFilePath, width, quality, extension) {

    if (fileExists(destinationFilePath)) {
      return;
    }

    ensureDirectoryExists(destinationFilePath);

    const tempDest = `${destinationFilePath}.part.${Math.random().toString(36).substring(7)}`;

    if (!supportedExtensions.includes(extension)) {
      this.log("Copying", extension, sourceFilePath, tempDest);
      fs.copyFileSync(sourceFilePath, tempDest);
    } else if (extension === "svg") {
      this.log("Optimizing", extension, sourceFilePath, tempDest);
      const svgData = fs.readFileSync(sourceFilePath, "utf-8");
      const optimizedSvg = optimizeSvg(svgData);
      fs.writeFileSync(tempDest, optimizedSvg.data);
    } else {
      this.log("Resizing", extension, sourceFilePath, tempDest);

      const transformer = sharp(sourceFilePath, {
        animated: true, limitInputPixels: false // disable pixel limit
      }).rotate();

      const { width: metaWidth } = await transformer.metadata();

      // Conditionally resize if the image is wider than the desired width
      if (metaWidth && metaWidth > width) {
        transformer.resize({ width });
      }

      if (extension === "avif") {
        if (transformer.avif) {
          const avifQuality = quality - 15;
          transformer.avif({
            quality: Math.max(avifQuality, 0), chromaSubsampling: "4:2:0" // same as webp
          });
        } else {
          transformer.webp({ quality });
        }
      } else if (extension === "png") {
        transformer.png({ quality });
      } else if (extension === "jpeg" || extension === "jpg") {
        transformer.jpeg({ quality });
      } else {
        // default to webp
        transformer.webp({ quality });
      }
      await transformer.toFile(tempDest);
    }

    await fs.promises.rename(tempDest, destinationFilePath);
  }


  log(message, ...args) {
    console.info(new Date(), "[Optimize-Image]", message, ...args);
  }

  info(message, ...args) {
    console.info(new Date(), "[Optimize-Image]", message, ...args);
  }
}


const optimize = async function() {

  const sourceUrl = process.argv[2];
  const localSourceImagePath = process.argv[3];
  const localOptimizedImagePath = process.argv[4];
  const width = parseInt(process.argv[5]);
  const quality = parseInt(process.argv[6]);
  const extension = process.argv[7]?.toLowerCase();

  const optimizer = new ImageOptimizer(sourceUrl, localSourceImagePath, localOptimizedImagePath, width, quality, extension);
  await optimizer.optimize();
};

try {
  await optimize();
} catch (error) {
  console.trace("Optimize-Image: error during optimization", process.argv, error?.code, error);
  console.error("Optimize-Image: error during optimization", process.argv, error?.code, error);
  process.exit(0);
}
