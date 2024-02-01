const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const dbLocal = require('../../../Database/database');
const mouse = require('../../../Action/Mouse/mouse');
const Fakerator = require("fakerator");
const fakerator = Fakerator();
async function followInstagram_1({ browser, profileData, config }) {
    try {
        let { likePercent, commentPercent, sharePercent } = config || {};
        if (!likePercent) likePercent = 20;
        if (!commentPercent) commentPercent = 0;
        if (!sharePercent) sharePercent = 20;
        let page = await navigation.newTab(browser, 'https://www.instagram.com/');
        await helper.delay(20);
        // random tìm 3-5 người
        const count = helper.randomInt(3, 5);
        for (let i = 1; i <= count; i++) {
            const text = fakerator.names.name();
            await page.evaluate(() => {
                try {
                    document.querySelector('input[type=search]')?.focus();
                }
                catch (e) {

                }
            });
            await keyboard.pressKey(page, text);
            await page.keyboard.press('Enter');
            await helper.delay(10);
            // random add 1 bạn
            await page.evaluate(() => {
                function randomInt(x, y) {
                    return Math.floor(Math.random() * (y - x + 1)) + x;
                }
                try {
                    let arr = document.querySelectorAll('div[aria-label="Add friend"]');
                    return arr[randomInt(0, arr.length - 1)].click();
                }
                catch (e) {

                }
            });
            await helper.delay(10);
            await mouse.scrollRandom(page, helper.randomInt(1, 2), helper.randomFloat(250, 400), 0.75);
            // random follow 1 page
            await page.evaluate(() => {
                function randomInt(x, y) {
                    return Math.floor(Math.random() * (y - x + 1)) + x;
                }
                try {
                    let arr = document.querySelectorAll('div[aria-label="Follow"]');
                    return arr[randomInt(0, arr.length - 1)].click();
                }
                catch (e) {

                }
            });
            await helper.delay(10);
            await mouse.scrollRandom(page, helper.randomInt(1, 2), helper.randomFloat(250, 400), 0.75);
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại followInstagram_1');
        return false;
    }
}
module.exports = followInstagram_1;
