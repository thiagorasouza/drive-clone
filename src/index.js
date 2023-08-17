const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { Server } = require("socket.io");
const { uploadFile } = require("./upload.js");
const { deleteFile } = require("./delete.js");

const server = http.createServer(async (req, res) => {
  if (req.method === "PUT" && req.url === "/upload") {
    await uploadFile(req, res, currentSocket);
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
