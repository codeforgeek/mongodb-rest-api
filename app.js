const express = require("express");
const nconf = require("nconf");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.json());

// load the config file
nconf
  .argv()
  .env()
  .file({
    file: __dirname + "/config.json",
  });

app.disable("etag");
app.disable("x-powered-by");
const routes = require("./routes");
app.use("/api", routes);

app.listen(nconf.get("port") || 3000);
console.log("Server is running at", nconf.get("port") || 3000);
