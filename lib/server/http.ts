import 'server-only';

export type Body = BodyInit | undefined | null;

type SerializedBody = {
  data?: ArrayBuffer | Uint8Array;
  contentType?: string;
};

export const serializeBody = async (body: Body | undefined, contentType?: string): Promise<SerializedBody> => {
  let data: SerializedBody['data'];
  if (body === undefined || body === null) {
    data = undefined;
    contentType = contentType ?? undefined;
  } else if (typeof body === 'string') {
    // For string body
    const encoder = new TextEncoder();
    data = encoder.encode(body);
    contentType = contentType ?? 'application/json';
  } else if (body instanceof FormData) {
    const boundary = generateBoundary();

    // Manually construct the multipart/form-data body
    const fields: { [key: string]: string } = {};
    const files: { [key: string]: { filename: string; contentType: string; data: ArrayBuffer } } = {};

    // Extract fields and files from FormData
    await Promise.all(
      Array.from(body.entries()).map(async ([name, value]) => {
        const isBlob = value instanceof Blob;
        const isFile = value instanceof File;
        if (!isBlob && !isFile) {
          fields[name] = value.toString();
          return;
        }
        const file = value as File | Blob;
        const arrayBuffer = await file.arrayBuffer();
        files[name] = {
          filename: 'name' in file ? (file as File).name : 'blob',
          contentType: file.type || 'application/octet-stream',
          data: arrayBuffer,
        };
      }),
    );

    data = await constructMultipartBody(fields, files, boundary);
    contentType = `multipart/form-data; boundary=${boundary}`;
  } else {
    throw new Error('Invalid body type');
  }
  return { data, contentType };
};

const generateBoundary = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const constructMultipartBody = async (
  fields: { [key: string]: string },
  files: { [key: string]: { filename: string; contentType: string; data: ArrayBuffer } },
  boundary: string,
): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const bodyParts: Uint8Array[] = [];

  // Append fields
  for (const [name, value] of Object.entries(fields)) {
    let part = '';
    part += `--${boundary}\r\n`;
    part += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
    part += `${value}\r\n`;
    const partUint8Array = encoder.encode(part);
    bodyParts.push(partUint8Array);
  }

  // Append files
  for (const [name, file] of Object.entries(files)) {
    let partHeader = '';
    partHeader += `--${boundary}\r\n`;
    partHeader += `Content-Disposition: form-data; name="${name}"; filename="${file.filename}"\r\n`;
    partHeader += `Content-Type: ${file.contentType}\r\n\r\n`;

    const headerUint8Array = encoder.encode(partHeader);
    const fileDataUint8Array = new Uint8Array(file.data);
    const newlineUint8Array = encoder.encode('\r\n');

    // Concatenate header, file data, and newline
    const partUint8Array = new Uint8Array(
      headerUint8Array.length + fileDataUint8Array.length + newlineUint8Array.length,
    );
    partUint8Array.set(headerUint8Array, 0);
    partUint8Array.set(fileDataUint8Array, headerUint8Array.length);
    partUint8Array.set(newlineUint8Array, headerUint8Array.length + fileDataUint8Array.length);

    bodyParts.push(partUint8Array);
  }

  // Append the final boundary
  const endBoundary = `--${boundary}--\r\n`;
  const endBoundaryUint8Array = encoder.encode(endBoundary);
  bodyParts.push(endBoundaryUint8Array);

  // Combine all parts into a single Uint8Array
  let totalLength = 0;
  for (const part of bodyParts) {
    totalLength += part.length;
  }

  const multipartBody = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of bodyParts) {
    multipartBody.set(part, offset);
    offset += part.length;
  }

  return multipartBody.buffer;
};
