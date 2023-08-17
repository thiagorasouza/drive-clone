const fs = require("node:fs");
const { getFilePath } = require("./helpers.js");

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

module.exports = { deleteFile };
