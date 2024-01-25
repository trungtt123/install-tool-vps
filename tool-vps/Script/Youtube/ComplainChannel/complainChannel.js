const helper = require("../../../Action/Helper/helper");
const complainChannel_1 = require("./complainChannel_1");

async function complainChannel({ browser, profileData, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await complainChannel_1({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = complainChannel;