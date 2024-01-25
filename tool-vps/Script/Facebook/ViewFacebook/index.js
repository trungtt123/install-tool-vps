const helper = require('../../../Action/Helper/helper');
const homeFacebook = require('./homeFacebook');
const watchFacebook = require('./watchFacebook');
async function index({browser, profileData, config}) {
    const randStr = "1|2";
    const random = helper.getRandomPhrase(randStr, "|");
    switch (random) {
        case "1":
            await homeFacebook({ browser, profileData, config })
            break;
        case "2":
            await watchFacebook({ browser, profileData, config })
            break;
        default:
            break;
    }
}
module.exports = index;