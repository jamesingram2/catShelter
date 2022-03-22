const http = require("http");
const port = 3000;
const handlers = require("./handlers");

http
   .createServer((req, res) => {
      for (let handler of handlers) {
         if (!handler(req, res)) {
            break;
         }
      }
   })
   .listen(port, () => {
      console.log(`The server is running: http://127.0.0.1:${port}`);
   });
