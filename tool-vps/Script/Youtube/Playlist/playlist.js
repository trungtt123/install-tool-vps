const helper = require("../../../Action/Helper/helper");
const playlist_1 = require("./playlist_1");

async function playlist({ browser, profileData, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await playlist_1({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = playlist;