const e = require('express');
const data = require('../dataModel')
//GET-Endpoints
exports.getList = function (req, res) {
    res.send(data)
}
exports.getListByName = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);

    if (indexList != -1) {
        res.send(data[indexList].headers);
    } else {
        res.sendStatus(404);
    }
}
exports.getListNamesIcons = function (req, res) {
    let keys = Object.keys(data)
    var nameIcons = new Array
    for (let i = 0; i < keys.length; i++) {
        nameIcons[i] = { name: data[keys[i]].name, picture: data[keys[i]].picture }
    }
    res.send(nameIcons)
}

//POST-Endpoints
exports.createList = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    if (search.includes(req.body[0].name)) {
        console.log("List already exists");
        res.sendStatus(400);
    } else {
        data.push(req.body);
        data[data.length - 1].header = [];
        console.log("Added new List");
        console.log(req.body);
        res.sendStatus(201);
    }
}
exports.createCategory = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList == -1) {
        console.log("List doesn´t exists");
        res.sendStatus(404);
    } else {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.body.name);
        if (indexCat == -1) {
            data[indexList].headers.push({ [req.body.name]: [] });
            console.log(data[indexList]);
        } else {
            console.log("Category already exists");
            res.sendStatus(400);
        }
    }
}
exports.createEntry = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if(indexList!=-1){
        search=[];
        data[indexList].headers.forEach(element=>search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            search=[];
            data[indexList].headers[indexCat][req.params.categoryName].push(req.body[0]);
            console.log(data[indexList].headers[indexCat]);
        } else {
            console.log("Category doesn´t exists");
            res.sendStatus(404);
        }
    }else{
        console.log("List doesn´t exist");
        res.sendStatus(404);
    }
}

//PUT-Endpoints
exports.updateLists = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    for (let i = 0; i < data.length; i++) {
        data[i].name = req.body[i].name;
        data[i].picture = req.body[i].picture;
    }
    console.log(data);
}
exports.updateCategorys = function (req, res) {
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);

    data[indexList].headers = req.body;
    console.log(data[indexList].headers);
    res.sendStatus(200);
}
exports.updateEntry = function (req, res) {

}

//DELETE-Endpoints
exports.deleteList = function (req, res) {

}
exports.deleteCategory = function (req, res) {

}
exports.deleteEntry = function (req, res) {

}