const helper = require("../../../Action/Helper/helper");
const external_1 = require("./external_1");
const external_2 = require("./external_2");

async function externalView({ browser, profileData, filePath, config }) {
    const random = "2";//"1|2";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await external_1({ browser, profileData, filePath, config });
            break;
        case "2":
            await external_2({ browser, profileData, filePath, config });
            break;
        default:
            break;
    }
}
module.exports = externalView;