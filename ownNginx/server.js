const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const server = http.createServer((req, res) => {
  let filepath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  //   If no extension, assume .html
  if (!path.extname(filepath)) {
    filepath += ".html";
  }

  console.log(filepath);

  const extName = String(path.extname(filepath)).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "text/png",
  };

  const contentType = mimeTypes[extName] || "application/octet-stream";

  fs.readFile(filepath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Error NO ENTry
        res.writeHead(404, { "content-type": "text/html" });
        res.end("404 : File Not Found");
      }
    } else {
      res.writeHead(200, { "content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listing on port ${port}`);
});
