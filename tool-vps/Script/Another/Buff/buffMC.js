/*
    script googleSearch_1
    mô tả: nhập từ khóa bất kỳ trong danh sách listKeyword trong file config và xem bài viết bất kỳ
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
function generateRandomString() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const stringLength = Math.floor(Math.random() * 5) + 1;

    let randomString = '';
    for (let i = 0; i < stringLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}
async function buffMC({ browser, filePath, config }) {
    try {
        // console.log('listKeyword tại googleSearch_1: ', listKeyword);
        let process = true;
        await navigation.newTab(browser, 'https://voting.thefacefptu.com/');
        await navigation.newTab(browser, 'https://mail.google.com/mail/u/0/#inbox');
        await helper.delay(20);
        let page;
        let tmp = await helper.readFileAsync(filePath + "\\mail.txt");
        tmp = tmp.split("|");
        let mail = tmp[0];
        if (mail.includes("@")) mail = mail += "@gmail.com";
        let first = mail.split("@")[0];
        for (let i = 1; i <= 100; i++) {
            mail = `${first}+${generateRandomString()}@gmail.com`;

            page = await navigation.activateTabByDomain(browser, 'https://voting.thefacefptu.com/');
            // await mouse.scrollRandom(page, helper.randomInt(10, 20), helper.randomFloat(250, 400));

            await page.evaluate(() => {
                document.querySelector('a[modelid="1360"]').scrollIntoView({ behavior: 'smooth', block: "center" })
            });
            await helper.delay(5);
            await page.evaluate(() => {
                document.querySelector('a[modelid="1360"]').click();
            });
            await helper.delay(5);
            await page.evaluate(() => {
                document.querySelector('input[type=email]').focus()
            });
            await helper.delay(5);
            await keyboard.pressKey(page, helper.getRandomPhrase(mail), 0, 0.01, 0.02);
            await page.evaluate(() => {
                document.querySelector('input[type=submit]').click();
            });
            await helper.delay(30);
            
            page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/mail/u/0/#inbox');
            await page.evaluate(() => {
                return document.querySelector('span[email]').click();
            });
            await helper.delay(5);
            const otp = await page.evaluate(() => {
                let arr = document.querySelectorAll('div[data-message-id]');
                return arr[arr.length - 1].textContent.split("  ")[1].trim();
            });
            await page.goBack();
            page = await navigation.activateTabByDomain(browser, 'https://voting.thefacefptu.com/');
            await page.evaluate(() => {
                document.querySelector('input#otp').focus()
            });
            
            await helper.delay(5);
            await keyboard.pressKey(page, helper.getRandomPhrase(otp), 0, 0.01, 0.02);
            await page.evaluate(() => {
                document.querySelector('input[type=submit]').click();
            });
            await helper.delay(10);
            await page.evaluate(() => {
                document.querySelector(".close").click()
            });
        }


        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại buffMC');
        return false;
    }
}
module.exports = buffMC;
