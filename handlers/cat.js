const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
const breeds = require("../data/breeds");
const cats = require("../data/cats");

module.exports = (req, res) => {
   const pathname = url.parse(req.url).pathname;

   // ADD CAT ROUTE
   if (pathname === "/cats/add-cat" && req.method === "GET") {
      const filepath = path.normalize(
         path.join(__dirname, "../views/addCat.html")
      );
      const index = fs.createReadStream(filepath);
      index.on("data", (data) => {
         res.write(data);
      });
      index.on("end", () => {
         res.end();
      });
      index.on("error", (err) => {
         console.log(err);
      });

      // CREATE CAT ROUTE
   } else if (pathname === "/cats/add-cat" && req.method === "POST") {
      // TODO
   } else if (pathname === "/cats/add-breed" && req.method === "GET") {
      const filepath = path.normalize(
         path.join(__dirname, "../views/addBreed.html")
      );
      const index = fs.createReadStream(filepath);
      index.on("data", (data) => {
         res.write(data);
      });
      index.on("end", () => {
         res.end();
      });
      index.on("error", (err) => {
         console.log(err);
      });
   } else if (pathname === "/cats/add-breed" && req.method === "POST") {
      let form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
         if (err) {
            console.log(err);
            return;
         }
         let newBreed = fields.breed;
         fs.readFile("./data/breeds.json", (err, data) => {
            if (err) {
               console.log(err);
               return;
            }
            let breeds = JSON.parse(data);
            breeds.push(newBreed);
            let breedsJSON = JSON.stringify(breeds);
            fs.writeFile("./data/breeds.json", breedsJSON, "utf-8", () => {
               console.log("breeds updated");
            });
         });
      });
      res.writeHead(302, { location: "/" });
      res.end();
   } else {
      return true;
   }
};
