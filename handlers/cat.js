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
         // console.log("breeds are: ", breeds); // Array of breeds
         let catBreedsPlaceHolder = breeds.map(
            (breed) => `<option value="${breed}">${breed}</option>`
         );
         // console.log(catBreedsPlaceHolder); // Array of HTML options
         let modifiedData = data
            .toString()
            .replace("{{catBreeds}}", catBreedsPlaceHolder);
         res.write(modifiedData);
      });
      index.on("end", () => {
         res.end();
      });
      index.on("error", (err) => {
         console.log(err);
      });

      // CREATE CAT ROUTE
   } else if (pathname === "/cats/add-cat" && req.method === "POST") {
      let form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
         if (err) {
            console.log(err);
            return;
         }
         // console.log("fields are: ", fields);
         // console.log("files are: ", files);
         // console.log("uploaded file path is ", files.upload.filepath);
         let oldPath = files.upload.filepath;
         let newPath = path.normalize(
            path.join(
               __dirname,
               "../content/images/" + files.upload.originalFilename
            )
         );
         // console.log(oldPath);
         // console.log(newPath);
         fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
            // console.log("file was uploaded successfully");
            fs.readFile("./data/cats.json", "utf-8", (err, data) => {
               if (err) throw err;
               let catsJSON = JSON.parse(data);
               let newCat = {
                  id: Math.floor(1000 + Math.random() * 1234),
                  name: fields.name,
                  description: fields.description,
                  breed: fields.breed,
                  image: files.upload.originalFilename,
               };
               catsJSON.push(newCat);
               let newJSON = JSON.stringify(catsJSON);
               // console.log("newJSON", newJSON);
               fs.writeFile("./data/cats.json", newJSON, (err) => {
                  if (err) throw err;
                  // console.log("Cat added successfully");
                  res.writeHead(302, { location: "/" });
                  res.end();
               });
            });
         });
      });
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
               // console.log("breeds updated");
            });
         });
      });
      res.writeHead(302, { location: "/" });
      res.end();
   } else {
      return true;
   }
};
