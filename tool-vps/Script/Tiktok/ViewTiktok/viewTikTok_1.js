/*
    script viewTiktok_1
    mô tả: lướt lên xuống xem video tại trang chủ tiktok, random follow, like
*/
const puppeteer = require('puppeteer');
const navigation = require('../../../Action/Navigation/navigation');
const helper = require('../../../Action/Helper/helper');
async function viewTikTok_1({browser, profileData, filePath}) {
    try {
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://www.tiktok.com/');
        if (page) page = await navigation.openUrl(page, 'https://www.tiktok.com/');
        else page = await navigation.newTab(browser, 'https://www.tiktok.com/');
        if (!page) {
            console.log('error tại vị trí open tiktok');
            return false;
        }
        await helper.delay(30);
        let indexLastVideo = -1;
        const countVideo = helper.randomInt(8, 20);
        while (indexLastVideo < countVideo) {
            indexLastVideo = await page.evaluate(async (indexLastVideo) => {
                function delay(time) {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, time * 1000)
                    });
                }
                function randomFloat(x, y) {
                    return x + (y - x) * Math.random();
                }
                const divs = document.querySelectorAll('div[data-e2e="recommend-list-item-container"]');
                for (let i = indexLastVideo + 1; i < divs.length; i++) {
                    try {
                        divs[i].scrollIntoView();
                        await delay(randomFloat(10, 50));
                        let btns = divs[i].querySelectorAll('button');
                        //follow 50%
                        if (randomFloat(0, 1) < 0.5) btns[0].click();
                        //like 50%
                        if (randomFloat(0, 1) < 0.5) btns[2].click()
                    }
                    catch (e) {

                    }
                    indexLastVideo++;
                    // countVideo = 10
                    if (indexLastVideo >= 10) break;
                }
                console.log('indexLastVideo', indexLastVideo);
                return indexLastVideo;
            }, indexLastVideo);
        }
        if (helper.randomFloat(0, 1) < 1) {
            await navigation.closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewTikTok_1');
        return false;
    }
}
module.exports = viewTikTok_1;
