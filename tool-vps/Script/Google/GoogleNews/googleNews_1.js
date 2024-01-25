/*
    script googleNews_1
    mô tả: đọc tin tức trong google news
*/
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function googleNews_1({ browser, filePath, config }) {
    try {
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://news.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://news.google.com/');
        else page = await navigation.newTab(browser, 'https://news.google.com/');
        if (!page) {
            console.log('error tại vị trí open google news');
            return false;
        }
        await helper.delay(30);
        // vào random 3-5 tab trong google news
        let count = helper.randomInt(3, 5);
        for (let i = 1; i <= count; i++) {
            await page.evaluate(() => {
                try {
                    let arr = [];
                    let homeTab = document.querySelector('a[href*="./home"]');
                    arr.push(homeTab);
                    let forYou = document.querySelector('a[href*=".foryou"]');
                    arr.push(forYou);
                    let topics = document.querySelector('a[href*="./topics"]');
                    arr = arr.concat(topics);
                    let randomIndex = Math.floor(Math.random() * arr.length);
                    arr[randomIndex].click();
                    return true;
                }
                catch (e) {
                    console.log(e);
                    return false;
                }
            });
            await helper.delay(10);
            await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
            await page.evaluate(() => {
                try {
                    let arr = document.querySelectorAll('a[href*="./articles"]');
                    let randomIndex = Math.floor(Math.random() * arr.length);
                    arr[randomIndex].click();
                    return true;
                }
                catch (e) {
                    console.log(e);
                    return false;
                }
            });
            await helper.delay(20);
            let currentPageIndex = await helper.getCurrentPageIndexByUrl(browser, 'https://news.google.com/');
            console.log('currentPageIndex', currentPageIndex);
            let newPage = await navigation.activateTabByIndex(browser, +currentPageIndex + 1);
            await mouse.scrollRandom(newPage, helper.randomInt(5, 10), helper.randomFloat(250, 400));
            await navigation.closeActiveTab(newPage);
        }

        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại googleNews_1');
        return false;
    }
}
module.exports = googleNews_1;
