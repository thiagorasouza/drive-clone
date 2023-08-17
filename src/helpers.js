import path from "node:path";
import sanitize from "sanitize-filename";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const UPLOAD_FOLDER = path.join(__dirname, "..", "uploads");
const PUBLIC_FOLDER = path.join(__dirname, "..", "public");

function getNewFilePath(fileName) {
  const [_, name, ext] = fileName.match(/^(.+)\.(\w+)$/);
  const uniqueFileName = `${name}-${Date.now().toString()}.${ext}`;
  const filePath = path.join(UPLOAD_FOLDER, uniqueFileName);
  return { filePath, uniqueFileName };
}

function getFilePath(fileName) {
  const sanitizedFileName = sanitize(fileName);
  const filePath = path.join(UPLOAD_FOLDER, sanitizedFileName);
  return filePath;
}

function getUploadPath() {
  return UPLOAD_FOLDER;
}

function getPublicPath() {
  return PUBLIC_FOLDER;
}

export { getNewFilePath, getFilePath, getUploadPath, getPublicPath };
