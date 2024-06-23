var fs = require('fs')

exports.writeFile = function (path, data) {
    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            console.log("Error writing data");
            console.log(err);
        }
    });
}
exports.readFile = function (path) {
    let result;
    try {
        result = fs.readFileSync(path);
    } catch (error) {
        console.log("Error reading file");
        console.log(error);
    }
    return JSON.parse(result);
}