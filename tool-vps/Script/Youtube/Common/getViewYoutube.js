/*
    script getViewYoutube
    mô tả: lấy view của video
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab } = require('../../../Action/Navigation/navigation');

async function getViewYoutube(browser, url) {
    try {
        let page = await browser.newPage();
        await openUrl(page, url);
        let view = await page.evaluate(() => {
            try {
                return document.querySelector('#count .ytd-video-view-count-renderer').textContent
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
        await browser?.close();
        return view.split(" ")[0].replace(/,/g, '.');
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại getViewYoutube');
        return null;
    }
}
module.exports = getViewYoutube;
