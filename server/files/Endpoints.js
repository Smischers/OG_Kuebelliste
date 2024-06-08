const data = require('../dataModel')

exports.getList = function (req, res) {
    res.send(data)
}

exports.getListByName = function (req, res) {
    let search = Object.keys(data).find(ele => ele === req.params.listname)
    if (search != null) {
        res.send(data[search])
    } else {
        res.sendStatus(404)
    }
}

exports.getListNamesIcons = function (req, res) {
    let keys = Object.keys(data)
    var nameIcons = new Array
    for (let i = 0; i < keys.length; i++) {
        nameIcons[i] = { Name: data[keys[i]].Name, Icon: data[keys[i]].Icon }
    }
    res.send(nameIcons)
}

