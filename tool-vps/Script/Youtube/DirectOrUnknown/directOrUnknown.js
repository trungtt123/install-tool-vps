const helper = require("../../../Action/Helper/helper");
const directOrUnknown_1 = require("./directOrUnknown_1");

async function directOrUnknown({ browser, profileData, filePath, config }) {
    const random = "1";
    let scriptRandom = helper.getRandomPhrase(random, "|");
    console.log('scriptRandom', scriptRandom);
    switch (scriptRandom) {
        case "1":
            await directOrUnknown_1({browser, profileData, filePath, config});
            break;
        default:
            break;
    }
}
module.exports = directOrUnknown;