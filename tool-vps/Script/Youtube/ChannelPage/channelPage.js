const helper = require("../../../Action/Helper/helper");
const channelPage_1 = require("./channelPage_1");
const channelPage_2 = require("./channelPage_2");

async function channelPage({ browser, profileData, filePath, config }) {
    const random = "1|2";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await channelPage_1({browser, profileData, filePath, config});
            break;
        case "2":
            await channelPage_2({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = channelPage;