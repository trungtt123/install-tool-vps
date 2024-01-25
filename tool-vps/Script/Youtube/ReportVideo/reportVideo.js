const helper = require("../../../Action/Helper/helper");
const reportVideo_1 = require("./reportVideo_1");

async function reportVideo({ browser, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            // await reportVideo_1({browser, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = reportVideo;