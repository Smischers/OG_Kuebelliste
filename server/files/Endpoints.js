const fileManager = require('../files/fileManager');
const weather=require('../files/Ext-APIs/weather');
function getData(path) {
    let pathing = "List_Data/" + path + ".json";
    let ret = fileManager.readFile(pathing);
    return ret;
}
function saveData(fileName, data) {
    let pathing = "List_Data/" + fileName + ".json";
    fileManager.writeFile(pathing, data);
}

//GET-Endpoints
exports.getList = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (!data.length !== 0) {
        res.send(data);
    } else {
        res.sendStatus(404);
        console.log("File not found");
    }
}
exports.getListByName = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (!data.length !== 0) {
        let search = [];
        data.forEach(element => search.push(element.name));
        let indexList = search.findIndex(ele => ele === req.params.listName);

        if (indexList != -1) {
            res.send(data[indexList].headers);
        } else {
            console.log("List not found");
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
        console.log("File not found");
    }

}
//TODO Sort by weather
exports.getListNamesIcons =async function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (!data.length !== 0) {
        let keys = Object.keys(data)
        let nameIcons = [];
        let w=await weather.getCurrentWeather("Vienna");
        
        for (let i = 0; i < keys.length; i++) {
            nameIcons[i] = { name: data[keys[i]].name, picture: data[keys[i]].picture }
        }
        res.send(nameIcons)
    } else {
        res.sendStatus(404);
        console.log("File not found");
    }

}
exports.getListDetails = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (!data.length !== 0) {
        let search = [];
        data.forEach(element => search.push(element.name));
        let indexList = search.findIndex(element => element == req.params.listName);
        if (indexList != -1) {
            let categoryNames = [];
            data[indexList].headers.forEach(element => categoryNames.push(Object.keys(element)[0]));
            res.send({ image: data[indexList].picture, weather: data[indexList].weather, categorys: categoryNames });
        } else {
            res.sendStatus(404);
            console.log("List not found");
        }
    } else {
        res.sendStatus(404);
        console.log("File not found");
    }

}
exports.getEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (!data.length !== 0) {
        let search = [];
        data.forEach(element => search.push(element.name));
        let indexList = search.findIndex(ele => ele === req.params.listName);
        if (indexList != -1) {
            search = [];
            data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
            let indexCat = search.findIndex(element => element === req.params.categoryName);
            if (indexCat != -1) {
                search = [];
                data[indexList].headers[indexCat][req.params.categoryName].forEach(element => search.push(element.name));
                let indexEnt = search.findIndex(element => element === req.params.entryName);
                if (indexEnt != -1) {
                    res.send(data[indexList].headers[indexCat][req.params.categoryName][indexEnt]);
                } else {
                    console.log("Entry not found");
                    res.sendStatus(404);
                }
            } else {
                console.log("Category not found");
                res.sendStatus(404);
            }
        } else {
            console.log("List not found");
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
        console.log("File not found");
    }

}

//POST-Endpoints
exports.createList = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    if (search.includes(req.body.name)) {
        console.log("List not found");
        res.sendStatus(400);
    } else {
        data.push(req.body[0]);
        data[data.length - 1].headers = [];
        console.log("Added new List");
        console.log(req.body);
        res.sendStatus(201);
        saveData(path, data);
    }
}
exports.createCategory = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList == -1) {
        console.log("List not found");
        res.sendStatus(404);
    } else {
        if (!data[indexList].headers) {
            data[indexList].headers.push({ [req.body[0].name]: [] });
        } else {
            search = [];
            data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
            let indexCat = search.findIndex(element => element === req.body.name);
            if (indexCat == -1) {
                data[indexList].headers.push({ [req.body[0].name]: [] });
                res.sendStatus(201);
                console.log("Created new Category");
                console.log(req.body);
                saveData(path, data);
            } else {
                console.log("Category already exists");
                res.sendStatus(400);
            }
        }
    }
}
exports.createEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            search = [];
            data[indexList].headers[indexCat][req.params.categoryName].push(req.body[0]);
            console.log("Created Entry");
            console.log(data[indexList].headers[indexCat][req.params.categoryName]);
            res.sendStatus(201);
            saveData(path, data);
        } else {
            console.log("Category not found");
            res.sendStatus(404);
        }
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}

//PUT-Endpoints
exports.updateLists = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        data[indexList].name = req.body[0].name;
        data[indexList].picture = req.body[0].picture;
        data[indexList].weather = req.body[0].weather;
        saveData(path, data)
        console.log(data[indexList]);
        res.sendStatus(200);
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}
exports.updateCategorys = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            let old_key = Object.keys(data[indexList].headers[indexCat])[0];
            let new_key = req.body[0].name;
            if (old_key !== new_key) {
                Object.defineProperty(data[indexList].headers[indexCat], new_key,
                    Object.getOwnPropertyDescriptor(data[indexList].headers[indexCat], old_key));
                delete data[indexList].headers[indexCat][old_key];
            }
            data[indexList].headers[indexCat][new_key] = req.body[1];
            console.log(data[indexList].headers);
            saveData(path, data);
        } else {
            console.log("Category not found");
            res.sendStatus(404);
        }
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}
exports.updateEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            search = [];
            data[indexList].headers[indexCat][req.params.categoryName].forEach(element => search.push(element.name));
            let indexEnt = search.findIndex(element => element === req.params.entryName);
            if (indexEnt != -1) {
                data[indexList].headers[indexCat][req.params.categoryName] = req.body;
                res.sendStatus(200);
                console.log("Updated Entry");
                console.log(data[indexList].headers[indexCat]);
                saveData(path, data);
            } else {
                console.log("Entry not found");
                res.sendStatus(404);
            }
        } else {
            console.log("Category not found");
            res.sendStatus(404);
        }
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}

//DELETE-Endpoints
exports.deleteList = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        data.splice(indexList, 1);
        res.sendStatus(201);
        saveData(path, data);
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}
exports.deleteCategory = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            data[indexList].headers.splice(indexCat, 1);
            saveData(path, data);
        } else {
            console.log("Category not found");
            res.sendStatus(404);
        }
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}
exports.deleteEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let search = [];
    data.forEach(element => search.push(element.name));
    let indexList = search.findIndex(ele => ele === req.params.listName);
    if (indexList != -1) {
        search = [];
        data[indexList].headers.forEach(element => search.push(Object.keys(element)[0]));
        let indexCat = search.findIndex(element => element === req.params.categoryName);
        if (indexCat != -1) {
            let indexEnt = data[indexList].headers[indexCat][req.params.categoryName].findIndex(element => element.name === req.params.entryName);
            if (indexEnt != -1) {
                data[indexList].headers[indexCat][req.params.categoryName].splice(indexEnt, 1);
                res.sendStatus(200);
                saveData(path, data);
            } else {
                console.log("Entry not found");
                res.sendStatus(404);
            }
        } else {
            console.log("Category not found");
            res.sendStatus(404);
        }
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}