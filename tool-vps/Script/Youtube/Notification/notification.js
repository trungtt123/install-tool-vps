const helper = require("../../../Action/Helper/helper");
const notification_1 = require("./notification_1");

async function notification({ browser, profileData, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await notification_1({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = notification;