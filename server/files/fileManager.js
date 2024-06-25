var fs = require('fs')

// Writes JSON Data into File 
exports.writeFile = function (path, data) {

    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            console.log("Error writing data");
            console.log(err);
        }
    });
}
// Gets JSON Data from File 
exports.readFile = function (path) {
    let result;

    try {
        result = fs.readFileSync(path);
    } catch (error) {
        console.log("No File found");
        result=[];
        return result;
    }
    return JSON.parse(result);
}