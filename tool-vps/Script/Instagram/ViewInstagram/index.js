const helper = require('../../../Action/Helper/helper');
const homeInstagram = require('./homeInstagram');
const reelInstagram = require('./reelInstagram');
async function viewInstagram({ browser, profileData, config }) {
    const randStr = "1|2";
    const random = helper.getRandomPhrase(randStr, "|");
    switch (random) {
        case "1":
            await homeInstagram({ browser, profileData, config })
            break;
        case "2":
            await reelInstagram({ browser, profileData, config })
            break;
        default:
            break;
    }

}
module.exports = viewInstagram;