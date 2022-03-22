const url = require("url");
const fs = require("fs");
const path = require("path");

function getContentType(url) {
   if (url.endsWith("css")) {
      return "text/css";
   } else if (url.endsWith("html")) {
      return "text/html";
   } else if (url.endsWith("png")) {
      return "image/png";
   } else if (url.endsWith("js")) {
      return "application/javascript";
   } else if (url.endsWith("json")) {
      return "application/json";
   } else if (url.endsWith("jpeg")) {
      return "image/jpeg";
   } else if (url.endsWith("ico")) {
      return "image/vnd.microsoft.icon";
   }
}

module.exports = (req, res) => {
   const pathname = url.parse(req.url).pathname;

   if (pathname.startsWith("/content") && req.method === "GET") {
      // "Content-Type": getContentType(pathName)
      fs.readFile(`./${pathname}`, "utf-8", (err, data) => {
         if (err) {
            console.log(err);
            res.writeHead(404, {
               "Content-Type": "text/plain",
            });
            res.write(`404 ${err}`);
            res.end();
            return;
         }
         res.writeHead(200, {
            "Content-Type": getContentType(pathname),
         });
         res.write(data);
         res.end();
      });
   } else {
      return true;
   }
};
