/*
    script googleSearch_1
    mô tả: nhập từ khóa bất kỳ trong danh sách listKeyword trong file config và xem bài viết bất kỳ
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function googleSearch_1({ browser, filePath, config }) {
    try {
        let { listKeyword, listLinkWeb, onlyListWeb, timeOnWeb, pasteLinkPercent, keywordOnGoogleTrend } = config;
        if (!listKeyword) listKeyword = "";
        if (!listLinkWeb) listLinkWeb = "";
        if (!onlyListWeb) onlyListWeb = false;
        if (!pasteLinkPercent) pasteLinkPercent = 0;
        if (!timeOnWeb) timeOnWeb = 0;
        // console.log('listKeyword tại googleSearch_1: ', listKeyword);
        let process = true;
        let page;
        if (helper.randomInt(0, 100) < keywordOnGoogleTrend) {
            page = await navigation.newTab(browser, 'https://trends.google.com/trends/trendingsearches/daily');
            await helper.delay(10);
            listKeyword = await page.evaluate(() => {
                try {
                    const arr = document.querySelectorAll("md-list .details span[ng-repeat]");
                    let keyword = "";
                    for (const index in arr) {
                        if (!arr[index]?.textContent?.trim()) continue;
                        if (index < arr.length - 1)
                            keyword += arr[index]?.textContent?.trim() + "|";
                        else keyword += arr[index]?.textContent?.trim()
                    }
                    console.log('keyword', keyword);
                    return keyword;
                }
                catch (e) {

                }
            });
            await navigation.closeActiveTab(page);
        }
        console.log('listKeyword', listKeyword);
        page = await navigation.newTab(browser, 'https://www.google.com/');
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(10);
        // let page = await findActiveTab(page);
        process = await page.evaluate(() => {
            const input = document.querySelector('input[name="q"], textarea[name="q"]');
            if (input) {
                input.focus();
                return true;
            }
            return false;
        });
        process = await keyboard.pressKey(page, helper.getRandomPhrase(listKeyword));
        process = await page.evaluate(() => {
            try {
                document.querySelector('input[type=submit]').click();
                return true;
            }
            catch (e) {
                return false;
            }
        });
        if (!process) await page.keyboard.press("Enter");
        // tìm trang web không bị block
        const listWeb = listLinkWeb.split('|');
        await helper.delay(10);
        console.log('onlyListWeb', onlyListWeb)
        if (onlyListWeb) {
            await mouse.scrollRandom(page, helper.randomInt(10, 20), helper.randomFloat(250, 400));
            let timThayWeb = await page.evaluate((listWeb) => {
                try {
                    let queryListWeb = '';
                    for (let i = 0; i < listWeb.length; i++) {
                        if (i === 0) queryListWeb += `#search a[href*="${listWeb[i]}"]`;
                        else queryListWeb += `, #search a[href*="${listWeb[i]}"]`;
                    }
                    let webVaoDuoc = document.querySelectorAll(queryListWeb);
                    console.log('webVaoDuoc', webVaoDuoc);
                    const iLink = Math.floor(Math.random() * webVaoDuoc.length);
                    webVaoDuoc[iLink].click();
                    return true;
                }
                catch (e) {
                    return false;
                }
            }, listWeb)
            // không tìm thấy web nào -> dán link pasteLinkPercent %
            if (!timThayWeb && (helper.randomInt(0, 100) < pasteLinkPercent)) {
                let randomIndex = helper.randomInt(0, listWeb.length - 1);
                page = await navigation.openUrl(page, listWeb[randomIndex]);
            }
        }
        else {
            await page.evaluate(() => {
                try {
                    const links = document.querySelectorAll(`#search a[href]`);
                    const iLink = Math.floor(Math.random() * links.length);
                    links[iLink].click();
                    return true;
                }
                catch (e) {
                    return false;
                }
            });
        }
        await helper.delay(10);
        const actionLoop = helper.randomInt(10, 20);
        for (let i = 1; i <= actionLoop; i++) {
            await mouse.scrollRandom(page, 1, helper.randomFloat(250, 400), 0.65, 1);
            await helper.delay(timeOnWeb / actionLoop);
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại googleSearch_1');
        return false;
    }
}
module.exports = googleSearch_1;
