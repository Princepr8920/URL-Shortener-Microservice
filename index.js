const express = require('express');
const cors = require('cors');
const app = express();
const shortid = require("shortid")
const mongodb = require("mongodb")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const port = process.env.PORT || 1000;
const logger = require("morgan")
require('dotenv').config();

app.use(logger("dev"))

app.use(bodyParser.urlencoded({ extended: false }));  

mongoose.connect(process.env.MY_DB,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
  console.log("Database is connected 🧠")
})

app.use(cors());
app.use(bodyParser.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
 
let urlSchema = mongoose.Schema({
  short_url:String,
  original_url:String
})

let urlModel = mongoose.model("myUrl", urlSchema);

app.post('/api/shorturl', function(req, res) {
  let url =  req.body.url;
  let newUrl = shortid.generate()
  let isValidUrl = /(^[https\:\/\/]+[www\.]*)\w+[\.]+(?=com+$|org+$|in+$)/gi;
  if(!isValidUrl.test(url)){
      res.json({ error: 'invalid url' });
  }else{
  let shorted = new urlModel({
    short_url: newUrl,
    original_url:url
  })

   shorted.save((err,url)=>{
    if (err) return err;
     res.json(url)
   })}

 
});

app.get("/api/shorturl/:mini?",(req,res)=>{
let param = req.params.mini;

urlModel.findOne({short_url:param},(err,url)=>{
  if(err) return err;
  console.log(url)
  res.redirect(url.original_url)
})
})




app.listen(port, function() {
  console.log(`Listening on port ${port} ✔`);
});