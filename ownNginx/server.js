const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 3000

const server = http.createServer((req , res) => {
    const filepath = path.join(__dirname, req.url === '/' ? "index.html" : "req.url" );
    const extName = String(path.extname(filepath)).toLowerCase();
    
});

server.listen(port , () => {
    console.log(`Server is listing on port ${port}`);
})