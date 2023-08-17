import http from "node:http";
import { Server } from "socket.io";
import { uploadFile } from "./upload.js";
import { deleteFile } from "./delete.js";
import { showIndex } from "./showIndex.js";

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

server.listen(4000, () => {
  console.log("Server running on 4000");
});
