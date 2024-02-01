const helper = require('../../../Action/Helper/helper');
const followInstagram_1 = require('./followInstagram_1');
async function followInstagram({ browser, profileData, config }) {
    const randStr = "1"; //"1|2";
    const random = helper.getRandomPhrase(randStr, "|");
    switch (random) {
        case "1":
            await followInstagram_1({ browser, profileData, config })
            break;
        default:
            break;
    }
}
module.exports = followInstagram;