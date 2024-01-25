const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const Mail = require('../../../models/Mail');
const dbLocal = require('../../../Database/database');
async function loginMail_1({browser, profileData, filePath}) {
    try {
        let database = await dbLocal.getData();
        let profile = database?.profiles?.find(o => o.id.toString() === profileData.id.toString());
        if (!profile) return false;
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://www.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://www.google.com/');
        else page = await navigation.newTab(browser, 'https://www.google.com/');
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(20);
        // chuyển ngôn ngữ sang tiếng anh
        await page.evaluate(async () => {
            try {
                document.querySelector('a[href*="hl=en&source=homepage"]').click();
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(20);
        if (!page) {
            console.log('error tại vị trí tìm active page');
            return false;
        }
        let isLogin = await page.evaluate(async () => {
            const btnLogin = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
            if (btnLogin) {
                btnLogin.click();
                return false;
            }
            return true;
        });
        await helper.delay(30);
        console.log('isLogin: ', isLogin);
        const mailData = profile.mail
        let username = mailData.email;
        let password = mailData.password;
        let mailReco = mailData.recoverEmail;
        if (!isLogin) {
            process = await page.focus('input#identifierId');
            process = await keyboard.pressKey(page, username);
            await page.keyboard.press("Enter");
            await helper.delay(20);
            process = await keyboard.pressKey(page, password);
            await page.keyboard.press("Enter");
            await helper.delay(30);
            //check nhập mail recovery
            process = await page.evaluate(() => {
                const btnMail = document.querySelectorAll('div.vxx8jf')[2];
                if (btnMail) {
                    btnMail.click();
                    return true;
                }
                return false;
            });
            if (process) {
                await helper.delay(10);
                // focus input
                process = await page.evaluate(() => {
                    try {
                        document.querySelector('input#knowledge-preregistered-email-response').focus();
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                });
                if (process) {
                    process = await keyboard.pressKey(page, mailReco);
                    await page.keyboard.press("Enter");
                    await helper.delay(30);
                }
                // check xem co thong bao confirm khong
            }
            process = await page.evaluate(() => {
                const btnConfirm = document.querySelector('#confirm');
                if (btnConfirm) {
                    btnConfirm.click();
                    return true;
                }
                return false;
            });
            await helper.delay(30);
            page = await navigation.activateTabByDomain(browser, 'https://www.google.com/');
            if (page) page = await navigation.openUrl(page, 'https://www.google.com/');
            else page = await navigation.newTab(browser, 'https://www.google.com/');
            await helper.delay(20);
            isLogin = await page.evaluate(async () => {
                const btnLogin = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
                if (btnLogin) {
                    return false;
                }
                return true;
            });
        }
        console.log("isLogin", isLogin);
        database = await dbLocal.getData();
        profile = database?.profiles?.find(o => o.id.toString() === profileData.id.toString());
        let mail = profile?.mail || {};
        mail["isLogin"] = isLogin;
        profile["mail"] = mail;
        await dbLocal.updateData(database);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại loginMail_1');
        return false;
    }
}
module.exports = loginMail_1;
