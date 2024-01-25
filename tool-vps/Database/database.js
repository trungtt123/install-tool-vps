const helper = require('../Action/Helper/helper');
const { DATABASE_URL } = require('../const');
async function getData(){
    try {
        let database = await helper.readFileAsync(DATABASE_URL);
        if (!database) database = {};
        else database = JSON.parse(database);
        return database;
    }
    catch(e){
        return {};
    }
}
async function updateData(newDatabase){
    helper.overwriteFile(DATABASE_URL, JSON.stringify(newDatabase));
}
module.exports = {
    getData,
    updateData
};