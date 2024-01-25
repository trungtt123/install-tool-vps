const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const dbLocal = require('../../../Database/database');
const mouse = require('../../../Action/Mouse/mouse');
async function watchFacebook({ browser, profileData, config }) {
    try {
        let page = await navigation.newTab(browser, 'https://www.facebook.com/watch');
        await helper.delay(1000);
        const randomScroll = helper.randomInt(10, 20);
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại watchFacebook');
        return false;
    }
}
module.exports = watchFacebook;
