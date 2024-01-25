/*
    script viewTwitter_1
    mô tả: view twitter tại trang chủ, random chọn tab phía trên cùng, lướt xem các bài viết random like, retweet
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const goBack = require('../../../Action/Navigation/goBack');
const scrollByPixel = require('../../../Action/Mouse/scrollByPixel');
const scrollRandom = require('../../../Action/Mouse/scrollRandom');
async function viewTwitter_1({browser, filePath}) {
    try {
        let process = true;
        let page;
        page = await activateTabByDomain(browser, 'https://twitter.com/');
        if (page) page = await openUrl(page, 'https://twitter.com/');
        else page = await newTab(browser, 'https://twitter.com/');
        if (!page) {
            console.log('error tại vị trí open twitter');
            return false;
        }
        await helper.delay(30);

        // let page = await findActiveTab(page);
        // random tab
        process = await page.evaluate(async () => {
            try {
                const tabs = document.querySelectorAll("div[role='tablist'] div[role='presentation'] a");
                const randomIndex = Math.floor(Math.random() * tabs.length);
                const randomLink = tabs[randomIndex];
                randomLink.click();
            } catch (e) {
            }
            return false;
        });
        // chờ load 
        await helper.delay(30);
        // lướt xem các bài post, xem 20 bài viết
        let cntPost = 0;
        const maxViewPost = 20;
        while (cntPost < maxViewPost) {
            cntPost += await page.evaluate(async () => {
                try {
                    function delay(time) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, time * 1000)
                        });
                    }
                    function randomFloat(x, y) {
                        return x + (y - x) * Math.random();
                    }
                    const articles = document.querySelectorAll('article');
                    // console.log('articles', articles.length);
                    for (let i = 0; i < articles.length; i++) {
                        try {
                            articles[i].scrollIntoView();
                            //random thời gian đọc
                            await delay(randomFloat(10, 30));
                            let btnLike = articles[i].querySelector(`div[data-testid='like']`);
                            let btnRetweet = articles[i].querySelector(`div[data-testid='retweet']`);
                            //follow 50%
                            if (btnLike && randomFloat(0, 1) < 0.5) btnLike.click();
                            //like 50%
                            if (btnRetweet && randomFloat(0, 1) < 0.5) {
                                btnRetweet.click();
                                let retweetConfirm = document.querySelector(`div[data-testid='Dropdown'] div[data-testid='retweetConfirm']`);
                                retweetConfirm.click();
                            }
                        }
                        catch (e) {

                        }
                    }
                    return articles.length;
                }
                catch (e) {
                    return 0;
                }
            });
            await scrollRandom(page, helper.randomInt(1, 5), helper.randomFloat(250, 400));
        }
        if (helper.randomFloat(0, 1) < 0.5) {
            await closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewTwitter_1');
        return false;
    }
}
module.exports = viewTwitter_1;
