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
         // console.log("current cats are:", cats);
         catsHTML = cats.map((cat) => {
            return `<li>
            <img class="img-fluid" src="${path.join(
               "./content/images/" + cat.image
            )}" alt="${cat.name}">
         <h3>${cat.name}</h3>
         <p><span>Breed: </span>${cat.breed}</p>
         <p><span>Description: </span>${cat.description}</p>
            <ul class="buttons">
               <li class="btn edit"><a href="/cats-edit/${
                  cat.id
               }">Change Info</a></li>
               <li class="btn delete"><a href="/cats-find-new-home/${
                  cat.id
               }">New Home</a></li>
            </ul>
         </li>`;
         });
         // console.log(catsHTML);
         let modifiedData = data.toString().replace("{{cats}", catsHTML);
         res.writeHead(200, {
            "Content-Type": "text/html",
         });
         res.write(modifiedData); // index.html
         res.end();
      });
   } else {
      return true;
   }
};
