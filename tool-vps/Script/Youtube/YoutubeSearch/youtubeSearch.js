const helper = require("../../../Action/Helper/helper");
const youtubeSearch_1 = require("./youtubeSearch_1");
const youtubeSearch_2 = require("./youtubeSearch_2")

async function youtubeSearch({ browser, profileData, filePath, config }) {
    const random = "1|2";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    switch (scriptRandom) {
        case "1":
            await youtubeSearch_1({browser, profileData, filePath, config});
            break;
        case "2":
            await youtubeSearch_2({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = youtubeSearch;