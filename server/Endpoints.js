const fileManager = require('./fileManager');
const weather = require('./files/Ext-APIs/weather');
const e = require('express');

// Alles -> Listen -> Header -> Categories -> Entries
// Returns the index of the List for example ESO Dungeons index 0
function GetListIndex(listName, data) {
    let search = [];
    data.forEach(ele => search.push(ele.name));
    return search.findIndex(ele => ele === listName);
};

function GetCatIndex(list, listName, data) {
    let search = [];
    data[list].headers.forEach(ele => search.push(Object.keys(ele)[0]))
    return search.findIndex(ele => ele === listName)
};
function GetEntIndex(list, cat, listName, data) {
    let search = [];
    Object.values(data[list].headers[cat])[0].forEach(ele => search.push(ele.name));
    return search.findIndex(ele => ele === listName);
};

// Returns the Data of a File
function getData(username) {
    let pathing = "List_Data/" + username + ".json";
    let ret = fileManager.readFile(pathing);
    return ret;
}

// Saves Data into File by User
function saveData(username, data) {
    let pathing = "List_Data/" + username + ".json";
    fileManager.writeFile(pathing, data);
}

async function getWeather() {
    let city = "Vienna";
    let w = await weather.getCurrentWeather(city);
    if (w === "Clear" || w === "Clouds")
        return "clear";
    else
        return "rain"
}

//GET-Endpoints

// Gets the entire file
exports.getList = function (req, res) {
    let path = req.user.name;  // Gets Username
    let data = getData(path);  // Gets Data as JSON from File 
    if (!data.length !== 0) {
        res.send(data); // Sends entire file
    } else {
        res.send([]);
        console.log("File not found");
    }
}
// Gets certain List by Name
exports.getListByName = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    if (data.length == 0) {  // File not found
        console.log("File not found");
        res.sendStatus(404);
        return;
    }

    let listIndex = GetListIndex(req.params.listName, data);

    if (listIndex != -1) {
        const selectedList = data[listIndex];
        res.send(selectedList.headers); // All Categories + Fields,  Alles -> Listen -> Header -> Categories -> Entries
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }

}
// GET all Listnames + Icons
exports.getListNamesIcons = async function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    if (data.length !== 0) { // Does the file exist
        let nameIcons = []; //Array used for the return value
        let w = await getWeather(); //Gets weather from API

        // Sorts array by weather 
        data.sort((a, b) => {
            if (a.weather === w && a.weather !== b.weather)
                return -1;
            else if (a.weather === b.weather)
                return 0;
            else
                return 1;
        });

        //pushes the new elements into nameIcons[] in the sorted order
        data.forEach(ele => {
            nameIcons.push({ name: ele.name, picture: ele.picture });
        })

        res.send(nameIcons) // Return Listname + Picture in Array of Objects
    } else {
        res.send([]);
        console.log("File not found");
    }

}
// Returns name of categories + image + weather of one list
exports.getListDetails = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    if (data.length == 0) {
        console.log("File not found");
        res.sendStatus(404);
        return;
    }

    let listIndex = GetListIndex(req.params.listName, data);

    if (listIndex != -1) { // Does List exist
        let categoryNames = [];
        let currentList = data[listIndex];
        let categories = currentList.headers;
        categories.forEach(element => categoryNames.push(Object.keys(element)[0])); // Name of every Category

        res.send({ image: currentList.picture, weather: currentList.weather, categorys: categoryNames });
    } else {
        res.sendStatus(404);
        console.log("List not found");
    }

}
// Returns the data of one entry
exports.getEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    if (data.length == 0) { // File not found
        console.log("File not found");
        res.sendStatus(404);
        return;
    }
    let listIndex = GetListIndex(req.params.listName, data);

    if (listIndex == -1) { // List not Found
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);

    if (categoryIndex == -1) { // Category not found
        console.log("Category not found");
        res.sendStatus(404);
        return;
    }

    let entryIndex = GetEntIndex(listIndex, categoryIndex, req.params.entryName, data);
    if(entryIndex===-1){
        console.log("Entry not found");
        res.sendStatus(404);
        return;
    }
        let currentCategories = data[listIndex].headers;
        let category = currentCategories[categoryIndex][req.params.categoryName];
        res.send(category[entryIndex]);

}

//POST-Endpoints
exports.createList = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let inputName = req.body.name;

    if (data.length !== 0) { // If any list exists
        let search = [];
        data.forEach(element => search.push(element.name));
        if (search.includes(inputName)) {  // Duplicate check
            console.log("List already exsits");
            res.sendStatus(400);
        } else {
            data.push(req.body);
            data[data.length - 1].headers = [];

            res.sendStatus(201);
            saveData(path, data);  // Writes into File
        }
    } else {  // If file does not exist
        //Create new File
        data = [];
        data.push(req.body);
        console.log(req.body);
        data[0].headers = [];
        console.log("Created new File");
        res.sendStatus(201);
        saveData(path, data);
    }
}
exports.createCategory = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let listIndex = GetListIndex(req.params.listName, data);
    let newCategoryName = req.body[0].name;

    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, newCategoryName, data)
    if (categoryIndex == -1) {
        data[listIndex].headers.push({ [newCategoryName]: [] });
        res.sendStatus(201);
        saveData(path,data);
    } else {
        console.log("Category already exists");
        res.sendStatus(400);
    }
}
exports.createEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let listIndex = GetListIndex(req.params.listName, data);

    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);

    if (categoryIndex != -1) {
        let currentCategories = data[listIndex].headers;
        let category = currentCategories[categoryIndex][req.params.categoryName];

        category.push(req.body[0]);

        res.sendStatus(201);
        saveData(path, data);
    } else {
        console.log("Category not found");
        res.sendStatus(404);
    }

}

//PUT-Endpoints
exports.updateLists = function (req, res) {
    let path = req.user.name; // Get User name
    let data = getData(path); // Get Data from User
    let listIndex = GetListIndex(req.params.listName, data); // Get Index of List
    const inputObject = req.body[0];

    // List does not exist
    if (listIndex != -1) {
        let selectedList = data[listIndex];

        selectedList.name = inputObject.name;
        selectedList.picture = inputObject.picture;
        selectedList.weather = inputObject.weather;

        saveData(path, data)
        res.sendStatus(200);
    } else {
        console.log("List not found");
        res.sendStatus(404);
    }
}
exports.updateCategorys = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let listIndex = GetListIndex(req.params.listName, data);
    if (listIndex == -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, re.params.categoryName, data);

    if (categoryIndex != -1) {
        let selectedCategory = data[listIndex].headers[categoryIndex];

        let old_key = Object.keys(selectedCategory)[0];
        let new_key = req.body[0].name;

        if (old_key !== new_key) {
            Object.defineProperty(selectedCategory, new_key, Object.getOwnPropertyDescriptor(selectedCategory, old_key));
            delete selectedCategory[old_key]; // Creates a Copy of Category and creates a new key and deletes the old one 
        }
        saveData(path, data);
    } else {
        console.log("Category not found");
        res.sendStatus(404);
    }
}
exports.updateEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    let listIndex = GetListIndex(req.params.listName, data);
    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);
    if (categoryIndex === -1) {
        console.log("Category not found");
        res.sendStatus(404);
        return;
    }

    let entryIndex = GetEntIndex(listIndex, categoryIndex, req.params.entryName, data);
    if (entryIndex === -1) {
        console.log("Entry not found");
        res.sendStatus(404);
        return;
    }

    let category = data[listIndex].headers[categoryIndex][req.params.categoryName];

    category[entryIndex] = req.body[0]; // Set entry to body 
    res.sendStatus(200);

    saveData(path, data);
}
exports.changeCategory = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    let listIndex = GetListIndex(req.params.listName, data);
    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);
    let indexChange = GetCatIndex(listIndex, req.body.newCat, data);
    if (categoryIndex === -1 || indexChange === -1) {
        console.log("Category not found");
        res.sendStatus(404);
        return;
    }

    let entryIndex = GetEntIndex(listIndex, categoryIndex, req.params.entryName, data);
    if (entryIndex === -1) {
        console.log("Entry not found");
        res.sendStatus(404);
        return;
    }
    let selectedCategory = data[listIndex].headers[categoryIndex][req.params.categoryName];
    let newCategory = data[listIndex].headers[indexChange][req.body.newCat];
    let tmp = selectedCategory[entryIndex];  // Gets current Entry temp

    selectedCategory.splice(entryIndex, 1); // Removes current Entry

    newCategory.push(tmp); // Pushes back in 
    res.sendStatus(200);
    saveData(path, data);
}


//DELETE-Endpoints
exports.deleteList = function (req, res) {
    let path = req.user.name;
    let data = getData(path);
    let listIndex = GetListIndex(req.params.listName, data);

    if (listIndex != -1) {
        data.splice(listIndex, 1); // Deletes 1 list as of Index
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

    let listIndex = GetListIndex(req.params.listName, data);
    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);
    if (categoryIndex === -1) {
        console.log("Category not found");
        res.sendStatus(404);
        return;
    }

    let allCategories = data[listIndex].headers;
    allCategories.splice(categoryIndex, 1);
    saveData(path, data);
}
exports.deleteEntry = function (req, res) {
    let path = req.user.name;
    let data = getData(path);

    let listIndex = GetListIndex(req.params.listName, data);
    if (listIndex === -1) {
        console.log("List not found");
        res.sendStatus(404);
        return;
    }

    let categoryIndex = GetCatIndex(listIndex, req.params.categoryName, data);
    if (categoryIndex === -1) {
        console.log("Category not found");
        res.sendStatus(404);
        return;
    }

    let entryIndex = GetEntIndex(listIndex, categoryIndex, req.params.entryName, data);
    if (entryIndex === -1) {
        console.log("Entry not found");
        res.sendStatus(404);
        return;
    }

    let currentCategory = data[listIndex].headers[categoryIndex][req.params.categoryName];

    currentCategory.splice(entryIndex, 1);
    res.sendStatus(200);
    saveData(path, data);
}