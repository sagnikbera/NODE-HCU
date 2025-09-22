```js
// Import core Node.js modules
const http = require("http");   // For creating the HTTP server
const fs = require("fs");       // For interacting with the file system
const path = require("path");   // For working with file and directory paths

const port = 3000; // Port where the server will listen

// Create an HTTP server
const server = http.createServer((req, res) => {
  /*
    STEP 1: Build the absolute filepath for the requested URL.
    
    - If the request is for "/", we serve "index.html".
    - Otherwise, we join the URL with the current directory (__dirname).
    - Example:
      req.url = "/"          → filepath = "./index.html"
      req.url = "/about"     → filepath = "./about"
      req.url = "/style.css" → filepath = "./style.css"
  */
  let filepath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  /*
    STEP 2: If the user didn’t provide a file extension (like ".html", ".css", etc.),
    we assume it’s an HTML file and append ".html".
    
    Example:
      req.url = "/about"     → "./about.html"
      req.url = "/contact"   → "./contact.html"
      req.url = "/style.css" → "./style.css" (unchanged, since extension exists)
  */
  if (!path.extname(filepath)) {
    filepath += ".html";
  }

  console.log(filepath); // Debug: show which file the server is trying to serve

  /*
    STEP 3: Extract the file extension (".html", ".css", ".js", etc.)
    so we can determine the correct Content-Type for the response.
  */
  const extName = String(path.extname(filepath)).toLowerCase();

  /*
    STEP 4: Map file extensions to MIME types.
    This tells the browser how to interpret the file.
    
    Example:
      ".html" → text/html
      ".css"  → text/css
      ".js"   → text/javascript
      ".png"  → image/png   (⚠️ fixed: should be "image/png" not "text/png")
  */
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
  };

  // Use the correct MIME type or fallback to "application/octet-stream"
  const contentType = mimeTypes[extName] || "application/octet-stream";

  /*
    STEP 5: Try to read the requested file from disk using fs.readFile().
    
    - If the file exists, send it with the correct Content-Type.
    - If the file does not exist (ENOENT), send a custom 404 response.
  */
  fs.readFile(filepath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found → send 404 response
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 : File Not Found");
      } else {
        // Some other error (like permission issues, etc.)
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("500 : Internal Server Error");
      }
    } else {
      // File was found → send with 200 OK
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Start the server and listen on the defined port
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
```