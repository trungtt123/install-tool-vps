/*
    script yahooSearch_1
    mô tả: nhập từ khóa bất kỳ trong danh sách listKeyword trong file config và xem bài viết bất kỳ
*/
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function yahooSearch_1({ browser, filePath, config }) {
    try {
        let { listKeyword, listLinkWeb, onlyListWeb, timeOnWeb, pasteLinkPercent } = config;
        if (!listKeyword) listKeyword = "";
        if (!listLinkWeb) listLinkWeb = "";
        if (!onlyListWeb) onlyListWeb = false;
        if (!pasteLinkPercent) pasteLinkPercent = 0;
        if (!timeOnWeb) timeOnWeb = 0;
        // console.log('listKeyword tại yahooSearch_1: ', listKeyword);
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://search.yahoo.com/');
        if (page) page = await navigation.openUrl(page, 'https://search.yahoo.com/');
        else page = await navigation.newTab(browser, 'https://search.yahoo.com/');
        const currentPage = await navigation.getCurrentPageIndexByUrl(browser, 'https://search.yahoo.com/');
        if (!page) {
            console.log('error tại vị trí open search yahoo');
            return false;
        }
        await helper.delay(10);
        // let page = await findActiveTab(page);
        process = await page.evaluate(() => {
            const input = document.querySelector('input');
            if (input) {
                input.focus();
                return true;
            }
            return false;
        });
        process = await keyboard.pressKey(page, helper.getRandomPhrase(listKeyword));
        await page.keyboard.press("Enter");
        // tìm trang web không bị block
        const listWeb = listLinkWeb.split('|');
        await helper.delay(10);
        console.log('onlyListWeb', onlyListWeb);
        let pageUrl = "";
        let timThayWeb = false;
        await mouse.scrollRandom(page, helper.randomInt(10, 20), helper.randomFloat(250, 400));
        // if (onlyListWeb) {
        //     await mouse.scrollRandom(page, helper.randomInt(10, 20), helper.randomFloat(250, 400));
        //     const data = await page.evaluate((listWeb) => {
        //         try {
        //             let queryListWeb = '';
        //             for (let i = 0; i < listWeb.length; i++) {
        //                 if (i === 0) queryListWeb += `#results a[href*="${listWeb[i]}"]`;
        //                 else queryListWeb += `, #results a[href*="${listWeb[i]}"]`;
        //             }
        //             let webVaoDuoc = document.querySelectorAll(queryListWeb);
        //             const iLink = Math.floor(Math.random() * webVaoDuoc.length);
        //             webVaoDuoc[iLink].click();
        //             return {
        //                 pageUrl: webVaoDuoc[iLink].landing_href,
        //                 timThayWeb: true
        //             };
        //         }
        //         catch (e) {
        //             return {
        //                 pageUrl: "",
        //                 timThayWeb: false
        //             };
        //         }
        //     }, listWeb)
        //     pageUrl = data?.pageUrl;
        //     timThayWeb = data?.timThayWeb;
        //     // không tìm thấy web nào -> dán link pasteLinkPercent %
        //     if (!timThayWeb && (helper.randomInt(0, 100) < pasteLinkPercent)) {
        //         let randomIndex = helper.randomInt(0, listWeb.length - 1);
        //         page = await navigation.openUrl(page, listWeb[randomIndex]);
        //     }
        // }
        // else {
        timThayWeb = await page.evaluate(() => {
            try {
                const links = document.querySelectorAll('#results a[href][target="_blank"]');
                const iLink = Math.floor(Math.random() * links.length);
                links[iLink].click();
                console.log('links[iLink]', links[iLink]);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        console.log('timThayWeb', timThayWeb);
        await helper.delay(10);
        if (timThayWeb) {
            page = await navigation.activateTabByIndex(browser, currentPage + 1);
        }
        else {
            let randomIndex = helper.randomInt(0, listWeb.length - 1);
            page = await navigation.openUrl(page, listWeb[randomIndex]);
        }
        
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
        console.log('Lỗi tại yahooSearch_1');
        return false;
    }
}
module.exports = yahooSearch_1;
