/*
    script viewYoutube_4
    mô tả: nuôi xem short của youtube, random like, dislike, xem bình luận
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const config = require('./config');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const { scrollRandom } = require('../../../Action/Mouse/mouse');
async function viewYoutube_4({browser, profileData, filePath, config}) {
    try {
        let process = true;
        let page;
        page = await activateTabByDomain(browser, 'https://www.youtube.com/');
        if (page) page = await openUrl(page, 'https://www.youtube.com/');
        else page = await newTab(browser, 'https://www.youtube.com/');
        if (!page) {
            console.log('error tại vị trí open youtube');
            return false;
        }
        await helper.delay(10);
        // let page = await findActiveTab(page);
        // click open expand
        process = await page.evaluate(() => {
            try {
                document.querySelector('#guide-button #button').click();
                return true;
            }
            catch (e) {

            }
            return false;
        });
        await helper.delay(helper.randomFloat(1, 5));
        // tìm tab short
        process = await page.evaluate(() => {
            try {
                document.querySelector('#guide-button #button')
                let arr = document.querySelectorAll('ytd-guide-section-renderer');
                let btnShort = arr[0].querySelectorAll('ytd-guide-entry-renderer')[1];
                btnShort.click();
                return true;
            }
            catch (e) {

            }
            return false;
        });
        await helper.delay(30);
        /* code xem short */
        // random 5-10 video short
        let maxShort = helper.randomInt(5, 10);
        for (let indexVideo = 0; indexVideo < maxShort; indexVideo++) {
            // xem random video short trong 10-30s
            let timeVideo = helper.randomFloat(10, 30);
            let randomTime = 1;
            // random like or dislike or none
            let isLike = helper.randomFloat(0, 1);
            if (isLike <= 0.2) isLike = '';
            else if (isLike <= 0.6) isLike = 'like';
            else isLike = 'dislike';
            let isSub = helper.randomFloat(0, 1);
            if (isSub <= 0.2) isSub = '';
            else if (isSub <= 0.6) isSub = 'subscribe';
            else isSub = 'unsubscribe';

            const actions = [
                {
                    action: 'delay',
                    randomTime: 0
                },
                {
                    action: isLike,
                    randomTime: helper.randomFloat(0, randomTime),
                },
                {
                    action: isSub,
                    randomTime: helper.randomFloat(0, randomTime),
                },
                {
                    action: 'delay',
                    randomTime: randomTime
                }
            ]
            actions.sort(function (a, b) {
                return a.randomTime - b.randomTime;
            });
            for (let i = 1; i < actions.length; i++) {
                const beforeItem = actions[i - 1];
                const item = actions[i];
                await helper.delay((item.randomTime - beforeItem.randomTime) * timeVideo);
                switch (item.action) {
                    //xử lý like
                    case 'like':
                        await page.evaluate((indexVideo) => {
                            try {
                                let container = document.querySelectorAll('ytd-reel-video-renderer')[indexVideo];
                                let btnLike = container.querySelector('#like-button button');
                                btnLike.click();
                                return true;
                            }
                            catch (e) {

                            }
                            return false;
                        }, indexVideo);
                        break;
                    case 'dislike':
                        await page.evaluate((indexVideo) => {
                            try {
                                let container = document.querySelectorAll('ytd-reel-video-renderer')[indexVideo];
                                let btnLike = container.querySelector('#dislike-button button');
                                btnLike.click();
                                return true;
                            }
                            catch (e) {

                            }
                            return false;
                        }, indexVideo);
                        break;
                    case 'subscribe':
                        await page.evaluate((indexVideo) => {
                            try {
                                let container = document.querySelectorAll('ytd-reel-video-renderer')[indexVideo];
                                let btnLike = container.querySelector('#subscribe-button button');
                                btnLike.click();
                                return true;
                            }
                            catch (e) {

                            }
                            return false;
                        }, indexVideo);
                        break;
                    default:
                        break;
                }

            }
            /* code xem video */
            // next video 80%
            let nextVideo = helper.randomFloat(0, 1) < 0.8 ? true : false;
            if (nextVideo) {
                await page.evaluate(() => {
                    try {
                        document.querySelector('#navigation-button-down button').click();
                        return true;
                    }
                    catch (e) {

                    }
                    return false;
                });
            }
            else {
                await page.evaluate(() => {
                    try {
                        document.querySelector('#navigation-button-up button').click();
                        return true;
                    }
                    catch (e) {

                    }
                    return false;
                });
            }
            await helper.delay(helper.randomFloat(8, 10));
        }
        // random 30% đóng tab sau khi xem
        if (helper.randomFloat(0, 1) < 0.5) {
            await closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewYoutube_4');
        return false;
    }
}
module.exports = viewYoutube_4;
