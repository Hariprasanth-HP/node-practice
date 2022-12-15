const logEvents = require("./logEvents");
const EventEmitter = require("events");
const fs = require("fs");
const fsPromises = require("fs").promises;
const http = require("http");
const path = require("path");
class Emitter extends EventEmitter {}
const myEmitter = new Emitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;
const serveFile = async (filepath, contenttype, response) => {
  try {
    console.log("contevt", contenttype);
    const rawdata = await fsPromises.readFile(
      filepath,
      contenttype === "text/jpeg" ? "" : "utf8"
    );
    const data = contenttype === "text/json" ? JSON.parse(rawdata) : rawdata;
    console.log("data", data);
    response.writeHead(filepath.includes("404.html") ? 404 : 200, {
      "Content-Type": contenttype,
    });
    response.end(contenttype === "text/json" ? JSON.stringify(data) : data);
  } catch (err) {
    console.log("err", err);
    myEmitter.emit("log", `${err.name}:${err.message}`, "errlog.txt");

    response.statuscode = 500;
    response.end();
  }
};
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqlog.txt");

  const extension = path.extname(req.url);
  let contenttype;
  switch (extension) {
    case ".css":
      contenttype = "text/css";
      break;
    case ".jpg":
      contenttype = "text/jpeg";
      break;
    case ".js":
      contenttype = "text/js";
      break;
    case ".json":
      contenttype = "text/json";
      break;
    case ".png":
      contenttype = "text/png";
      break;
    case ".txt":
      contenttype = "text/plain";
      break;
    default:
      contenttype = "text/html";
  }
  let filepath =
    contenttype === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contenttype === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contenttype === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);
  if (!extension && req.url.slice(-1) !== "/") filepath += ".html";
  const fileexist = fs.existsSync(filepath);
  if (fileexist) {
    serveFile(filepath, contenttype, res);
    //servepat
  } else {
    //err
    switch (path.parse(filepath).base) {
      case "old.html":
        res.writeHead(301, { Location: "/new-page" });
        res.end();
        break;

      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
