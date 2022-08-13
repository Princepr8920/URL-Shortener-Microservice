require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const body = require("body-parser");
const port = process.env.PORT || 1000;
const logger = require("morgan");
const shortid = require("shortid");
app.use(logger("dev"));
app.use(body.urlencoded({ extended: false }));

mongoose.connect(process.env.MY_DB, 
  () => {
    console.log("Database is connected 🧠");
  }
);

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let urlSchema = mongoose.Schema({
  short_url: String,
  original_url: String,
});

let urlModel = mongoose.model("myUrl", urlSchema);

app.post("/api/shorturl", function (req, res) {
  let url = req.body.url;
  let newShortUrl = shortid.generate();
  let isValidUrl = /(^[http\:\/\/]+[www\.]*)/gi;

  if (isValidUrl.test(url)) {
    let shorted = new urlModel({
      short_url: newShortUrl,
      original_url: url,
    });
    shorted.save((err, url) => {
      if (err) return err;
      res.json(url);
    });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:mini", (req, res) => {
  let param = req.params.mini;
  urlModel.findOne({ short_url: param }, (err, url) => {
    if (err) return err; 
    res.redirect(url.original_url);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port} ✔`);
});
