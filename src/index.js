const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const busboy = require("busboy");
// const os = require("os");
const UPLOAD_FOLDER = path.join(__dirname, "..", "uploads");

const server = http.createServer(async (req, res) => {
  if (req.method === "PUT" && req.url === "/upload") {
    await uploadFile(req, res);
  } else if (req.method === "GET" && req.url === "/") {
    await showIndex(req, res);
  }
});

async function uploadFile(req, res) {
  const bb = busboy({ headers: req.headers });

  bb.on("file", (name, file, info) => {
    const { filename } = info;
    const filePath = getFilePath(filename);
    file.pipe(fs.createWriteStream(filePath));
  });

  bb.on("close", () => {
    res.writeHead(200, { Connection: "close" });
    res.end("File uploaded");
  });

  req.pipe(bb);
}

async function showIndex(req, res) {
  const indexPath = path.join(__dirname, "..", "public", "index.html");
  const indexContent = await fs.promises.readFile(indexPath, "utf-8");

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(indexContent);
}

function getFilePath(filename) {
  const [fname, fext] = filename.split(".");
  // return path.join(os.tmpdir(), `${fname}-${Date.now().toString()}.${fext}`);
  return path.join(UPLOAD_FOLDER, `${fname}-${Date.now().toString()}.${fext}`);
}

server.listen(4000, () => {
  console.log("Server running on 4000");
});
