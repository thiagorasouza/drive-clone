const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const busboy = require("busboy");
// const os = require("os");
const { Server } = require("socket.io");
const { getNewFilePath, getFilePath } = require("./helpers");

// const FILE_SIZE_LIMIT = 2147483648; // 2GB
const FILE_SIZE_LIMIT = 26000; // 2GB

const server = http.createServer(async (req, res) => {
  if (req.method === "PUT" && req.url === "/upload") {
    await uploadFile(req, res);
  } else if (req.method === "DELETE" && req.url === "/delete") {
    await deleteFile(req, res);
  } else if (req.method === "GET" && req.url === "/") {
    await showIndex(req, res);
  }
});

const io = new Server(server);
let currentSocket;

io.on("connection", (socket) => {
  currentSocket = socket;
  console.log(`Socket connected: ${socket.id}`);
});

async function uploadFile(req, res) {
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

async function deleteFile(req, res) {
  req.on("data", (data) => {
    const fileName = data.toString();
    const filePath = getFilePath(fileName);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
      res.statusCode = 200;
    } else {
      res.statusCode = 404;
    }
    res.end();
  });
}

async function showIndex(req, res) {
  const indexPath = path.join(__dirname, "..", "public", "index.html");
  const indexContent = await fs.promises.readFile(indexPath, "utf-8");

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(indexContent);
}

server.listen(4000, () => {
  console.log("Server running on 4000");
});
