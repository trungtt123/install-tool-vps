const puppeteer = require('puppeteer');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const mouse = require('../../../Action/Mouse/mouse');


async function page_1({ browser, username, password }) {
    let page;
    page = await navigation.newTab(browser, 'https://www.acouplecooks.com/');
    await helper.delay(30);
    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
    await page.evaluate((info) => {
        try {
            let input = document.querySelectorAll('input[type=email]')[1];
            input.scrollIntoView({ behavior: 'smooth', block: 'center' })
            input.value = info.username;
            document.querySelector('input[type=checkbox]').click();
            document.querySelector('main .wpforms-submit-container > button[type=submit]').click();
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }, { username });
    await helper.delay(10);
    await navigation.closeActiveTab(page);
}
async function page_2({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://amindfullmom.com/newsletter/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await page.evaluate((info) => {
            try {
                let forms = document.querySelectorAll('form[action*="https://app.convertkit.com"]');
                for (let form of forms) {
                    form.querySelectorAll('input')[0].value = info.username.split('@')[0];
                    form.querySelectorAll('input')[1].value = info.username;
                    form.querySelector('button').click();
                }
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function page_3({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://comfortablefood.com/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await page.evaluate((info) => {
            try {
                let input = document.querySelector('input[type=email]');
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = info.username;
                document.querySelector('button[type=submit]').click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://mail.google.com/');
        else page = await navigation.newTab(browser, 'https://mail.google.com/');
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('span[email="hello@comfortablefood.com"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await mouse.scrollRandom(page, helper.randomInt(2, 5), helper.randomFloat(250, 400));
        await page.evaluate(() => {
            try {
                document.querySelector('a[href*="https://app.mlsend.com/webforms/confirm"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function page_4({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://cookieandkate.com/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await page.evaluate((info) => {
            try {
                let input = document.querySelector('input[type=email]');
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = info.username;
                document.querySelector('input[type=submit]#subbutton').click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function page_5({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://downshiftology.com/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await page.evaluate((info) => {
            try {
                let input = document.querySelector('input[type=email]');
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = info.username;
                document.querySelector('button[type=submit].email-submit').click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://mail.google.com/');
        else page = await navigation.newTab(browser, 'https://mail.google.com/');
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('span[email="lisab@downshiftology.com"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await mouse.scrollRandom(page, helper.randomInt(2, 5), helper.randomFloat(250, 400));
        await page.evaluate(() => {
            try {
                document.querySelector('a[href*="https://us8.mailchimp.com"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function page_6({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://www.easycheesyvegetarian.com/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        // nhấn nút để subs
        await page.evaluate(() => {
            try {
                document.querySelector('.feastsubscribebutton a[href*="/subscribe"]').click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(15);
        await page.evaluate((info) => {
            try {
                let input = document.querySelector('input[name="fields[name]"]');
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = info.username?.split("@")[0];
                input = document.querySelector('input[type=email]');
                input.value = info.username;
                document.querySelector('button[type=submit]').click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://mail.google.com/');
        else page = await navigation.newTab(browser, 'https://mail.google.com/');
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('span[email="becca@easycheesyvegetarian.com"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await mouse.scrollRandom(page, helper.randomInt(2, 5), helper.randomFloat(250, 400));
        await page.evaluate(() => {
            try {
                document.querySelector('a[href*="https://app.mlsend.com/webforms/confirm/"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function page_7({ browser, username, password }) {
    try {
        let page;
        page = await navigation.newTab(browser, 'https://www.eatthis.com/');
        await helper.delay(30);
        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await helper.delay(15);
        await page.evaluate((info) => {
            try {
                let input = document.querySelector('input[type=email]');
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = info.username;
                document.querySelectorAll('button[type=submit]')[1].click();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }, { username });
        await helper.delay(10);
        page = await navigation.activateTabByDomain(browser, 'https://mail.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://mail.google.com/');
        else page = await navigation.newTab(browser, 'https://mail.google.com/');
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('span[email="becca@easycheesyvegetarian.com"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await mouse.scrollRandom(page, helper.randomInt(2, 5), helper.randomFloat(250, 400));
        await page.evaluate(() => {
            try {
                document.querySelector('a[href*="https://app.mlsend.com/webforms/confirm/"]').click()
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        await helper.delay(10);
        await navigation.closeActiveTab(page);
    }
    catch (e) {
        console.log(e);
    }
}
async function subMail_1({ browser, filePath, config }) {
    try {
        let tmp = await helper.readFileAsync(filePath + "\\mail.txt");
        tmp = tmp.split("|");
        const username = tmp[0];
        const password = tmp[1];
        await page_1({ browser, username, password });
        await page_2({ browser, username, password });
        await page_3({ browser, username, password });
        await page_4({ browser, username, password });
        await page_5({ browser, username, password });
        await page_6({ browser, username, password });
        await page_7({ browser, username, password });
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại subMail_1');
        return false;
    }
}
module.exports = subMail_1;
