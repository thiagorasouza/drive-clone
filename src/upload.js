const busboy = require("busboy");
const fs = require("node:fs");
const { getNewFilePath, getFilePath } = require("./helpers.js");

const FILE_SIZE_LIMIT = 26000;

async function uploadFile(req, res, currentSocket) {
  const bb = busboy({ headers: req.headers });

  let filePath;
  let uniqueFileName;
  let fileSize;
  bb.on("file", (name, file, info) => {
    const { filename } = info;
    if (fileSize > FILE_SIZE_LIMIT) {
      console.log(
        `The file "${filename}" of ${fileSize} bytes exceeds the ${FILE_SIZE_LIMIT} bytes limit.`,
      );
      file.resume();
      res.statusCode = 413;
      return;
    }

    ({ filePath, uniqueFileName } = getNewFilePath(filename));

    let bytesRead = 0;
    file.on("data", (chunk) => {
      bytesRead += chunk.length;
      if (!currentSocket) return;
      currentSocket.emit("progress", bytesRead);
    });

    file.pipe(fs.createWriteStream(filePath));
  });

  bb.on("field", (name, value) => {
    if (name === "size") {
      fileSize = value;
    }
  });

  bb.on("close", () => {
    if (currentSocket) currentSocket.disconnect();

    if (!res.statusCode) {
      res.statusCode = 200;
    }

    res.setHeader("Connection", "close");
    res.end(uniqueFileName);
  });

  req.pipe(bb);
}

module.exports = { uploadFile };
