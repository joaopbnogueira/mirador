import 'server-only';

export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export const createHash = async (hashAlgorithm: HashAlgorithm, data: ArrayBuffer | Uint8Array): Promise<string> => {
  const buffer = await crypto.subtle.digest(hashAlgorithm, data);
  return bufferToBase64(buffer);
};

/**
 * Create an HMAC hash for the given data with a key.
 * Supports both string and FormData input (which can contain blobs).
 */
export const createHMACHash = async (hashAlgorithm: HashAlgorithm, key: string, data: string): Promise<string> => {
  const keyData = new TextEncoder().encode(key);
  const keyBuffer = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: hashAlgorithm }, false, [
    'sign',
  ]);
  const signature = await crypto.subtle.sign('HMAC', keyBuffer, new TextEncoder().encode(data));
  return bufferToBase64(signature);
};

/**
 * Convert an ArrayBuffer to a Base64 string.
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const digestArray = Array.from(new Uint8Array(buffer));
  return btoa(String.fromCharCode(...digestArray));
};
