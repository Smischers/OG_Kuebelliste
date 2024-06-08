const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const data = require('./dataModel.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Nicht mein Problem machts ihr Backend Boys
app.get('/list', function (req, res) {
  res.send(data)
})

app.get('/list/:listname',function (req,res){
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

