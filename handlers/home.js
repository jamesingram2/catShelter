const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../data/cats.json");

module.exports = (req, res) => {
   const pathname = url.parse(req.url).pathname;

   if (pathname === "/" && req.method === "GET") {
      // implement logic for home html view
      let filepath = path.normalize(
         path.join(__dirname, "../views/home/index.html")
      );

      fs.readFile(filepath, (err, data) => {
         if (err) {
            console.log("error", err);
            res.writeHead(404, {
               "Content-Type": "text/plain",
            });
            res.write(404);
            res.end();
            return;
         }

         res.writeHead(200, {
            "Content-Type": "text/html",
         });
         res.write(data); // index.html
         res.end();
      });
   } else {
      return true;
   }
};
