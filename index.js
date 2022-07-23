require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MY_DB, () => {
  console.log("DB is connected 🧠");
});
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

urlSchema = mongoose.Schema({
  org_url: { type: String, required: true, unique: true },
  short_url: { type: String, required: true, unique: true },
});

let shortedURL = mongoose.model("newUrl", urlSchema);

// Your first API endpoint
app.post("/api/shorturl", function (req, res, next) {
  let url = req.body.url;
  let isValidUrl = /(^[https\:\/\/]+[www\.]*)\w+[\.]+(?=com+$|org+$|in+$)/gi;
  let regex = /(^https\:\/\/+)|(www\.+)(\w+)/gi;
  let shorted = url.replace(regex, "$3").slice(0, 4);

  if (isValidUrl.test(url)) {
    shortedURL.findOne({ org_url: url }, (err, getUrl) => {
      if (err) {
        return err;
      } else if (getUrl) {
        res.json({ original_url: url, short_url: getUrl.short_url });
      } else {
        let shortUrl = new shortedURL({
          org_url: url,
          short_url: shorted,
        });
        shortUrl.save((err) => {
          if (err) return err;
          console.log("saved succesfully ✔");
        });
        res.json({ original_url: url, short_url: shorted });
      }
    });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shorten?", function (req, res) {
  shortedURL.findOne({ short_url: req.params.shorten }, (err, url) => {
    if (err) {
      return err;
    } else if (!url) {
      res.json({ error: "invalid url" });
    } else {
      res.redirect(url.org_url);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port} 💻`);
});
