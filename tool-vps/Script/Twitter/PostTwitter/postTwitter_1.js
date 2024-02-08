/*
    script postTwitter_1
    mô tả: view twitter tại trang chủ, random chọn tab phía trên cùng, lướt xem các bài viết random like, retweet
*/
const puppeteer = require('puppeteer');
const navigation = require('../../../Action/Navigation/navigation');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const posts = require('./posts');
async function postTwitter_1({ browser, profileData, config }) {
    try {
        let page = await navigation.newTab(browser, 'https://twitter.com/');
        if (!page) {
            console.log('error tại vị trí open twitter');
            return false;
        }
        await helper.delay(30);

        // let page = await findActiveTab(page);
        // random post bài
        await page.evaluate(async () => {
            try {
                document.querySelector('div[data-testid*="tweetTextarea"]').click()
            } catch (e) {
            }
            return false;
        });
        await keyboard.pressKey(page, posts[helper.randomInt(0, posts.length - 1)]);
        await helper.delay(2);
        await page.evaluate(async () => {
            try {
                document.querySelector('div[data-testid="tweetButtonInline"]').click() 
            } catch (e) {
            }
            return false;
        });
        await helper.delay(5);
        if (helper.randomFloat(0, 1) < 1) {
            await navigation.closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại postTwitter_1');
        return false;
    }
}
module.exports = postTwitter_1;
