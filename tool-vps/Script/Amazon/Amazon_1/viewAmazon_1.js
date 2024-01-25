/*
    script viewAmazone_1
    mô tả: lướt lên xuống tại trang amazon, random click vào radio button bên trái, random click vào xem sản phẩm
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const config = require('./config');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const goBack = require('../../../Action/Navigation/goBack');
const scrollByPixel = require('../../../Action/Mouse/scrollByPixel');
const scrollRandom = require('../../../Action/Mouse/scrollRandom');
async function viewAmazon_1({browser, filePath}) {
    try {
        let process = true;
        let page;
        page = await activateTabByDomain(browser, 'https://www.amazon.com/');
        if (page) page = await openUrl(page, 'https://www.amazon.com/');
        else page = await newTab(browser, 'https://www.amazon.com/');
        if (!page) {
            console.log('error tại vị trí open amazon');
            return false;
        }
        // let page = await findActiveTab(page);
        let randomTextSearch = helper.getRandomPhrase(config.listKeyword);
        // search
        process = await page.evaluate((randomTextSearch) => {
            const input = document.querySelector('#twotabsearchtextbox');
            if (input) {
                input.value = randomTextSearch;
                const btnSearch = document.querySelector('#nav-search-submit-button');
                if (btnSearch) {
                    btnSearch.click();
                    return false;
                }
                return true;
            }
            return false;
        }, randomTextSearch);
        await helper.delay(30);
        //scroll lên xuống
        await scrollRandom(page, helper.randomInt(8, 10), helper.randomFloat(250, 400));
        // random click vào 1-5 link filter 
        let cntFilter = helper.randomInt(1, 5);
        for (let i = 1; i <= cntFilter; i++) {
            await page.evaluate(() => {
                try {
                    const links = document.querySelectorAll("#s-refinements .a-section a[href*='/s?k=']");
                    const randomIndex = Math.floor(Math.random() * links.length);
                    const randomLink = links[randomIndex];
                    randomLink.click();
                }
                catch (e) {
                    console.error(e);
                }
            });
            await helper.delay(30);
            await scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(250, 400));
        }
        // random click vào 3-5 sản phẩm
        let cntSp = helper.randomInt(3, 5);
        for (let i = 1; i <= cntSp; i++) {
            await page.evaluate(() => {
                try {
                    const links = document.querySelectorAll("a.a-link-normal.s-no-outline");
                    const randomIndex = Math.floor(Math.random() * links.length);
                    const randomLink = links[randomIndex];
                    randomLink.click();
                }
                catch (e) {
                    console.error(e);
                }
            });
            await helper.delay(30);
            await scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(250, 400));
            await goBack(page);
            await helper.delay(30);
        }
        if (helper.randomFloat(0, 1) < 0.5) {
            await closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewAmazon_1');
        return false;
    }
}
module.exports = viewAmazon_1;
