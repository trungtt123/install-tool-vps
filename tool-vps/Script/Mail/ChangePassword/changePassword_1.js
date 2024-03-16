const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const dbLocal = require('../../../Database/database');
async function changePassword_1({browser, filePath, config}) {
    try {
        let database = await dbLocal.getData();
        let profile = database?.profiles?.find(o => o.id.toString() === profileData.id.toString());
        if (!profile) return false;
        let { listNewMail } = config;
        if (!listNewMail) listNewMail = "";
        listNewMail = listNewMail.trim().split('\n');
        console.log('listNewMail', listNewMail);
        let process = true;
        let page;
        page = await navigation.newTab(browser, 'https://myaccount.google.com/signinoptions/password');
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(20);
        const mailData = profile.mail
        let username = mailData.email;
        let password = mailData.password;
        let mailReco = mailData.recoverEmail;
        let newData = listNewMail.find(o => o.includes(username));
        if (!newData) return true;
        let newPassword = newData.split("|")[1];
        console.log(newPassword);
        // check xem có cần verify bằng current password không
        let inputCurrentPassword = await page.evaluate(() => {
            try {
                let inputCurrentPassword = document.querySelector('input[type="password"][autocomplete="current-password"]');
                if (inputCurrentPassword) {
                    inputCurrentPassword.focus();
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        if (inputCurrentPassword) {
            await keyboard.pressKey(page, password);
            await page.keyboard.press("Enter");
            await helper.delay(20);
        }
        // nhập pass mới
        await page.evaluate(() => {
            try {
                let newPass = document.querySelectorAll('input[type="password"][autocomplete="new-password"]')[0];
                if (newPass) {
                    newPass.focus();
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, newPassword);
        // confirm pass mới
        // nhập confirm pass mới
        await page.evaluate(() => {
            try {
                let confirmPass = document.querySelectorAll('input[type="password"][autocomplete="new-password"]')[1];
                if (confirmPass) {
                    confirmPass.focus();
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, newPassword);
        await page.keyboard.press("Enter");
        await helper.delay(5);
        // check xem có dialog confirm ko, nếu có click
        await page.evaluate(() => {
            try {
                let confirmChangePage = document.querySelector('button[data-mdc-dialog-action="ok"]');
                if (confirmChangePage) {
                    confirmChangePage.click();
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(30);
        const currentURL = await page.url();
        console.log('currentURL', currentURL);
        if (currentURL.includes('https://myaccount.google.com/security-checkup-welcome')){
            helper.overwriteFile(`${filePath + "\\mail.txt"}`, `${username}|${newPassword}|${mailReco}`);
            helper.createLogFile(filePath + "\\mail-log", 'change-password-mail.txt');
            helper.overwriteFile(filePath + "\\mail-log\\change-password-mail.txt", 'true');
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại changePassword_1');
        return false;
    }
}
module.exports = changePassword_1;
