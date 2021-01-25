const upload = require("../middleware/upload");
const express = require("express");
const path = require("path");
var fs = require('fs');
const router = express.Router();

router.post("/upload", async (req, res) => {
    if (!req.session.loggedin) {
      res.redirect('/');
    } 

    try {
        await upload(req, res, async function(err){
          const files = req.files;
          const sentiments = await getCommentSentiment(files);
          
          res.render('home/sentimentDetail', { data: sentiments });
        });
    
      } catch (error) {
        console.log(error);
    
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
      }
});

const getCommentSentiment = async (files) => {

  let index, len;
  let comments = [];

  console.log("l "+files.length);

  for (index = 0, len = files.length; index < len; ++index) {
    //console.log(files[index]);

    var data = fs.readFileSync(path.join(`${__dirname}/../../upload/${files[index].filename}`), 'utf8');
  
    var responseApi = await callSentimentAPI(data.toString());
    let fileName = files[index].filename.split("-").pop();

    const fileData = {
      filename: fileName,
      sentiment: responseApi
    }

    comments.push(fileData);
  }

  return comments;
}

router.get("/history", async (req, res) => {

  console.log(req.session.loggedin);
  if (!req.session.loggedin) {
    res.redirect('/');
  } 

  let username = req.session.username;

  var files = fs.readdirSync(path.join(`${__dirname}/../../upload`)).filter(function(x) {
    return x.startsWith(username);
  });

  console.log(files);

  let index, len;
  let sentiments = [];

  for (index = 0, len = files.length; index < len; ++index) {

    var data = fs.readFileSync(path.join(`${__dirname}/../../upload/${files[index]}`), 'utf8');
    var responseApi = await callSentimentAPI(data.toString());
    let fileName = files[index].split("-").pop();

    const fileData = {
      filename: fileName,
      sentiment: responseApi
    }

    sentiments.push(fileData);
  }

  res.render('home/sentimentDetail', { data: sentiments });
});

const callSentimentAPI = async (text) => {
  
  const axios = require('axios');
  const json = { text: text };

  try {
    const responseApi = await axios.post('https://sentim-api.herokuapp.com/api/v1', json);
    return responseApi.data;
  }
  catch (err) {
    // Handle Error Here
    console.error(err);
  }

}

module.exports = router;