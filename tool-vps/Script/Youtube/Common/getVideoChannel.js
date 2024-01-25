/*
    script getVideoChannel
    mô tả: lấy danh sách video của channel
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab } = require('../../../Action/Navigation/navigation');
const helper = require('../../../Action/Helper/helper');
const { scrollRandom } = require('../../../Action/Mouse/mouse');

async function getVideoChannel(browser, url) {
    try {
        let page = await browser.newPage();
        await openUrl(page, url + '/videos');
        await scrollRandom(page, 10, 500, 1);
        return null;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại getViewYoutube');
        return null;
    }
}
module.exports = getVideoChannel;
