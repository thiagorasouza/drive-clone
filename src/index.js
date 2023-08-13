const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const busboy = require("busboy");
// const os = require("os");
const { Server } = require("socket.io");
const sanitize = require("sanitize-filename");

const UPLOAD_FOLDER = path.join(__dirname, "..", "uploads");

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
  bb.on("file", (name, file, info) => {
    const { filename } = info;
    ({ filePath, uniqueFileName } = getNewFilePath(filename));

    let bytesRead = 0;
    file.on("data", (chunk) => {
      bytesRead += chunk.length;
      if (!currentSocket) return;
      currentSocket.emit("progress", bytesRead);
    });

    file.pipe(fs.createWriteStream(filePath));
  });

  bb.on("close", () => {
    if (currentSocket) currentSocket.disconnect();

    res.statusCode = 200;
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
