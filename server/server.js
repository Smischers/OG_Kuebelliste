const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const data = require('./dataModel.js');
const endpoints=require('./files/Endpoints.js')

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/list', endpoints.getList)
app.get('/list/:listname',endpoints.getListByName)
app.get('/listIcons',endpoints.getListNamesIcons)

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

