/*
    script loginFacebook_1
    mô tả: view twitter tại trang chủ, random chọn tab phía trên cùng, lướt xem các bài viết random like, retweet
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const { default: axios } = require('axios');
async function loginFacebook_1({ browser, filePath, config }) {
    try {
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://mbasic.facebook.com/');
        if (page) page = await navigation.openUrl(page, 'https://mbasic.facebook.com/');
        else page = await navigation.newTab(browser, 'https://mbasic.facebook.com/');
        if (!page) {
            console.log('error tại vị trí open mbasic');
            return false;
        }
        await helper.delay(20);

        let isLoggedIn = false;
        isLoggedIn = await page.evaluate(async () => {
            try {
                if (document.querySelector('#m_login_email')) return false;
                return true;
            } catch (e) {
                return false;
            }
        });
        if (isLoggedIn) {
            helper.overwriteFile(filePath + "\\facebook-log\\login-facebook.txt", 'Đã login');
            return true;
        }

        let facebookData = (await helper.readFileAsync(filePath + "\\facebook.txt")) || "";
        const fbId = facebookData.split("|")[0];
        const fbPwd = facebookData.split("|")[1];
        const fb2FA = facebookData.split("|")[2];

        if (!fbId || !fbPwd || !fb2FA) {
            console.log('không có tài khoản facebook');
            return false;
        }

        process = await page.evaluate(async () => {
            try {
                document.querySelector('#m_login_email').focus();
                return true;
            } catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, fbId);

        process = await page.evaluate(async () => {
            try {
                document.querySelector('input[name="pass"]').focus();
                return true;
            } catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, fbPwd);

        process = await page.evaluate(async () => {
            try {
                document.querySelector('input[type="submit"]').click();
                return true;
            } catch (e) {
                return false;
            }
        });
        await helper.delay(20);
        const token = (await axios.get(`https://2fa.live/tok/${fb2FA}`)).data.token;

        process = await page.evaluate(async () => {
            try {
                document.querySelector('input#approvals_code').focus();
                return true;
            } catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, token);

        process = await page.evaluate(async () => {
            try {
                document.querySelector('input[type="submit"]').click();
                return true;
            } catch (e) {
                return false;
            }
        });
        await helper.delay(10);

        process = await page.evaluate(async () => {
            try {
                document.querySelector('input[type="submit"]').click();
                return true;
            } catch (e) {
                return false;
            }
        });
        await helper.delay(10);
        page = await navigation.newTab(browser, 'https://mbasic.facebook.com/');
        await helper.delay(20);
        /* ghi login facebook */
        isLoggedIn = await page.evaluate(async () => {
            try {
                if (document.querySelector('#m_login_email')) return false;
                return true;
            } catch (e) {
                return false;
            }
        });
        helper.overwriteFile(filePath + "\\facebook-log\\login-facebook.txt", isLoggedIn ? 'Đã login' : 'Chưa login');

        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại loginFacebook_1');
        return false;
    }
}
module.exports = loginFacebook_1;
