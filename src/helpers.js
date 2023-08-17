const path = require("node:path");
const sanitize = require("sanitize-filename");

const UPLOAD_FOLDER = path.join(__dirname, "..", "uploads");

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

module.exports = { getNewFilePath, getFilePath };
