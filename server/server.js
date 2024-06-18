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

app.get('/list', endpoints.getList);
app.get('/list/:listName',endpoints.getListByName);
app.get('/listIcons',endpoints.getListNamesIcons);

app.post('/list',endpoints.createList);
app.post('/list/:listName',endpoints.createCategory);
app.post('/list/:listName/:categoryName',endpoints.createEntry);

app.put('/list/:listName',endpoints.updateLists);
app.put('/list/:listName/:categoryName',endpoints.updateCategorys);
//app.put('/list/:listName/:categoryName/entrys',endpoints.updateEntry);

app.delete('/list/:listName',endpoints.deleteList);
app.delete('/list/:listName/:categoryName',endpoints.deleteCategory);
app.delete('/list/:listName/:categoryName/:entryName',endpoints.deleteEntry);

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

