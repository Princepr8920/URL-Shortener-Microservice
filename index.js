require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
 

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  let url = req.body.url;
  let regex = /(^[https]+\:\/\/[www]+\.)(\w+)/gi
  let short = url.replace(regex,"$2").slice(0,4)
  console.log(`The short url is ${short}`)
  app.locals.shortURL = short
  app.locals.org = url
  res.json({ "original_url":url,"short_url":short});
});

app.get("/api/shorturl/:shorten?", function (req, res) {
  let params = req.params.shorten 
  if(params === app.locals.shortURL){
    res.redirect(app.locals.org)
  }else{
    res.send("something went wrong")
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
