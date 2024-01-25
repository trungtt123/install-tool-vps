const helper = require("../../../Action/Helper/helper");
const browseFeature_1 = require("./browseFeature_1");

async function browseFeature({ browser, profileData, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await browseFeature_1({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = browseFeature;