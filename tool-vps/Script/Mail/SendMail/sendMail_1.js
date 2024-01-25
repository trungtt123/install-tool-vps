/*
    script sendMail_1
    mô tả: Gửi mail giữa các mail
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function sendMail_1({ browser, filePath, config }) {
    try {
        let { listKeyword } = config;
        if (!listKeyword) listKeyword = "";
        // listKeyword = helper.getRandomPhrase(listKeyword);
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://mail.google.com/');
        else page = await navigation.newTab(browser, 'https://mail.google.com/');
        if (!page) {
            console.log('error tại vị trí open mail');
            return false;
        }
        await helper.delay(10);
        // click gửi mail
        await page.evaluate(() => {
            try {
                document.querySelector('div[role="button"][gh="cm"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        // focus input nhập mail người nhận
        await page.evaluate(() => {
            try {
                document.querySelector('#\\:c1').focus();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(2);
        await keyboard.pressKey(page, 'bruceleemax@gmail.com');
        await page.keyboard.press('Enter');
        await helper.delay(1000);
        // random 50% đóng tab sau khi xem
        if (helper.randomFloat(0, 1) < 1) {
            await navigation.closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại sendMail_1');
        return false;
    }
}
module.exports = sendMail_1;
