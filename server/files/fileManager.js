var fs = require('fs')

exports.writeFile = function (path, data) {
    console.log("Saving file: "+path)
    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            console.log("Error writing data");
            console.log(err);
        }
    });
}
exports.readFile = function (path) {
    let result;
    console.log("Reading file: "+path)
    try {
        result = fs.readFileSync(path);
    } catch (error) {
        console.log("Error reading file");
        console.log(error);
    }
    return JSON.parse(result);
}