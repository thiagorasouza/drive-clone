import busboy from "busboy";
import fs from "node:fs";
import getFolderSize from "get-folder-size";
import { getNewFilePath, getUploadPath } from "./helpers.js";

const DISK_USAGE_LIMIT = 50 * 1024;
const FILE_SIZE_LIMIT = 26000;

async function uploadFile(req, res, currentSocket) {
  const bb = busboy({ headers: req.headers });

  let filePath;
  let uniqueFileName;
  let fileSize;

  bb.on("file", async (name, file, info) => {
    const { filename } = info;
    if (fileSize > FILE_SIZE_LIMIT) {
      console.log(
        `The file "${filename}" of ${fileSize} bytes exceeds the ${FILE_SIZE_LIMIT} bytes limit.`,
      );
      file.resume();
      res.statusCode = 413;
      return;
    }

    const diskUsage = await getFolderSize.loose(getUploadPath());
    const availableDiskSpace = DISK_USAGE_LIMIT - diskUsage;

    if (fileSize > availableDiskSpace) {
      console.log(
        `The file "${filename}" of ${fileSize} bytes exceeds the ${DISK_USAGE_LIMIT} disk usage limit.`,
      );
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

export { uploadFile };
