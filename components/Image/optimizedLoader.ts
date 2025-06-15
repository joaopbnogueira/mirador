const quality = 75;
const buildDir = '.next/static/media';
const staticDistDir = '_next/static/media';
const useWebp = true;
const exportFolderName = 'srcset';

class OptimizedLoader {
  private sourceExtension: string;

  private sourcePath: string;

  private sourceFileName: string;

  private isSvg: boolean;

  public constructor(private sourceUrl: string, private width: number, private isRemote: boolean) {
    this.sourceExtension = '';
    this.sourcePath = '';
    this.sourceFileName = '';
    this.isSvg = false;
    this.initSourcePaths();
  }

  private initSourcePaths(): void {
    const { extension, path, filename } = this.splitFilePath({ filePath: this.sourceUrl });
    this.sourceExtension = extension;
    this.sourcePath = path || '';
    this.sourceFileName = filename;
    this.isSvg = extension === 'svg';
  }

  // eslint-disable-next-line class-methods-use-this
  private splitFilePath = ({ filePath }: { filePath: string }) => {
    const filenameWithExtension = filePath.split('\\').pop()?.split('/').pop() || '';
    const filePathWithoutFilename = filePath.split(filenameWithExtension).shift();
    const fileExtension = filePath.split('.').pop();
    const filenameWithoutExtension =
      filenameWithExtension.substring(0, filenameWithExtension.lastIndexOf('.')) || filenameWithExtension;
    return {
      path: filePathWithoutFilename,
      filename: filenameWithoutExtension,
      extension: fileExtension || '',
    };
  };

  private generateImageURL = () => {
    const sourceUrl = this.isRemote ? this.urlToFilename() : this.sourceUrl;
    const { filename, path, extension } = this.splitFilePath({ filePath: sourceUrl });

    // If the images are stored as WEBP by the package, then we should change
    // the extension to WEBP to load them correctly
    let processedExtension = extension;

    if (useWebp && ['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
      processedExtension = 'webp';
    }

    let correctedPath = path;
    const lastChar = correctedPath?.substr(-1); // Selects the last character
    if (lastChar !== '/') {
      // If the last character is not a slash
      correctedPath += '/'; // Append a slash to it.
    }

    const isStaticImage = this.sourceUrl.includes(staticDistDir);
    let imagePath = `${isStaticImage ? '' : correctedPath}`;

    if (imagePath.startsWith('media/')) {
      imagePath = imagePath.substring('media/'.length);
    }

    // no resizing of svgs
    const optimizedFilename = this.isSvg ? filename : `${filename}-opt-${this.width}`;
    let generatedImageURL = `${imagePath}${exportFolderName}/${optimizedFilename}.${processedExtension.toLowerCase()}`;

    // if the generatedImageURL is not starting with a slash, then we add one as long as it is not a remote image
    if (generatedImageURL.charAt(0) !== '/') {
      generatedImageURL = `/${generatedImageURL}`;
    }

    return `/${staticDistDir}${generatedImageURL}`;
  };

  // eslint-disable-next-line class-methods-use-this
  private getLocalOptimizedImageInfo(imageUrl: string): { path: string; extension: string } {
    const { extension, path, filename } = this.splitFilePath({ filePath: imageUrl });
    const directory = (path || '').substring(staticDistDir.length + 1);
    return {
      path: `${buildDir}${directory}${filename}.${extension}`,
      extension,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private urlToFilename(): string {
    // Remove the protocol from the URL
    let filename = this.sourceUrl.replace(/^(https?|ftp):\/\//, '');

    // Replace special characters with underscores
    filename = filename.replace(/[/\\:*?"<>|#%]/g, '_');

    // Remove control characters
    // eslint-disable-next-line no-control-regex
    filename = filename.replace(/[\x00-\x1F\x7F]/g, '');

    // Trim any leading or trailing spaces
    filename = filename.trim();

    return filename;
  }

  private getLocalSourceImagePath(): string {
    if (this.isRemote) {
      return `${buildDir}/${this.urlToFilename()}`;
    }

    if (this.sourceUrl.startsWith(`/${staticDistDir}`)) {
      return `${buildDir}${this.sourceUrl.substring(staticDistDir.length + 1)}`;
    }

    return `public/${this.sourceUrl}`;
  }

  private getRemoteImageUrl(): string {
    const imageUrl = this.generateImageURL();
    const localSourceImagePath = this.getLocalSourceImagePath();
    const { path: localOptimizedImagePath, extension } = this.getLocalOptimizedImageInfo(imageUrl);
    return this.optimize(localSourceImagePath, localOptimizedImagePath, extension, imageUrl);
  }

  private optimize(sourceFile: string, targetFile: string, extension: string, imageUrl: string): string {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,@typescript-eslint/consistent-type-imports,@typescript-eslint/no-require-imports
      require('child_process').execFileSync(
        'node',
        ['optimize-image.mjs', this.sourceUrl, sourceFile, targetFile, this.width, quality, extension],
        {
          encoding: 'utf8',
          maxBuffer: Infinity,
        },
      );
    }
    return imageUrl;
  }

  public run(): string {
    if (this.isRemote) {
      return this.getRemoteImageUrl();
    }

    return this.getLocalImageUrl();
  }

  private getLocalImageUrl() {
    const imageUrl = this.generateImageURL();
    const localSourceImagePath = this.getLocalSourceImagePath();
    const { path: localOptimizedImagePath, extension } = this.getLocalOptimizedImageInfo(imageUrl);
    return this.optimize(localSourceImagePath, localOptimizedImagePath, extension, imageUrl);
  }

  // private slugify(text: string): string {
  //   return text
  //     .toLowerCase() // Convert to lowercase
  //     .normalize('NFD') // Normalize diacritics
  //     .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
  //     .replace(/[^a-z0-9 -.]/g, '') // Remove invalid chars
  //     .replace(/\s+/g, '-') // Replace spaces with -
  //     .replace(/-+/g, '-') // Merge multiple - into single -
  //     .replace(/^-+|-+$/g, ''); // Trim - from start and end;
  // }
}

export default OptimizedLoader;
