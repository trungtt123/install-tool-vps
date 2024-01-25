const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const Mail = require('../../../models/Mail');
const dbLocal = require('../../../Database/database');
const mouse = require('../../../Action/Mouse/mouse');
async function reelInstagram({ browser, profileData }) {
    try {
        let page = await navigation.newTab(browser, 'https://www.instagram.com/reels');
        const randomScroll = helper.randomInt(10, 20);
        for (let i = 1; i <= randomScroll; i++) {
            await helper.delay(helper.randomFloat(8, 15));
            await page.keyboard.down('ArrowDown');
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại reelInstagram ');
        return false;
    }
}
module.exports = reelInstagram;
