const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 3000

const server = http.createServer((req , res) => {
    const filepath = path.join(__dirname, req.url === '/' ? "index.html" : "req.url" );
    const extName = String(path.extname(filepath)).toLowerCase();

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'text/png',
    }

    const contentType = mimeTypes[extName] || 'application/octet-stream';

    fs.readFile(filepath , (err , content) => {
        if(err) {

        } else {
            res.writeHead
        }
    })
});

server.listen(port , () => {
    console.log(`Server is listing on port ${port}`);
})