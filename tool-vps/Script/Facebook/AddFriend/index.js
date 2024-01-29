const helper = require('../../../Action/Helper/helper');
const addFriend_1 = require('./addFriend_1');
async function addFriend({ browser, profileData, config }) {
    const randStr = "1"; //"1|2";
    const random = helper.getRandomPhrase(randStr, "|");
    switch (random) {
        case "1":
            await addFriend_1({ browser, profileData, config })
            break;
        default:
            break;
    }
}
module.exports = addFriend;