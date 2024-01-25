const puppeteer = require('puppeteer');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const viotp = require('../Common/viotp');
const { reportDisableMail } = require('../Common/index');
async function complaintMail_1({ browser, filePath, config }) {
    try {
        let listConfirmMail = config.listConfirmMail || "";
        listConfirmMail = listConfirmMail?.trim()?.split("\n");
        console.log('listConfirmMail', listConfirmMail);
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://www.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://www.google.com/');
        else page = await navigation.newTab(browser, 'https://www.google.com/');
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(10);
        if (!page) {
            console.log('error tại vị trí tìm active page');
            return false;
        }
        let isLogin = await page.evaluate(async () => {
            const btnLogin = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
            if (btnLogin) return false;
            return true;
        });
        console.log('isLogin: ', isLogin);
        if (!isLogin) {
            let tmp = '';
            tmp = await helper.readFileAsync(filePath + "\\mail.txt");
            tmp = tmp.split("|");
            const username = tmp[0];
            const password = tmp[1];
            const mailReco = tmp[2];
            const firstName = tmp[3];
            const lastName = tmp[4];
            const phone = tmp[5];
            const ngaySinh = +tmp[6]?.split('-')[0];
            const thangSinh = +tmp[6]?.split('-')[1];
            const namSinh = +tmp[6]?.split('-')[2];
            const gender = tmp[7];
            page = await navigation.openUrl(page, 'https://accounts.google.com');
            await helper.delay(10);
            // chuyển sang tiếng anh
            await page.evaluate(() => {
                try {
                    document.querySelector('li[data-value="en"]').click();
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            //check verify
            let isVerify = await page.evaluate(() => {
                try {
                    return document.querySelector('#headingText span').textContent.includes("Verify it");
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            // nếu không bị verify
            if (!isVerify) return true;
            helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", "Bị verify");
            // click next
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "Next") {
                            span.parentElement.click();
                            break;
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            // check + click try another way
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "Try another way") {
                            span.parentElement.click();
                            break;
                        }
                    }
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            // nhập password + nhấn next
            await page.evaluate((password) => {
                try {
                    document.querySelector('input[type=password]').value = password;
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "Next") {
                            span.parentElement.click();
                            break;
                        }
                    }
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            }, password);
            await helper.delay(10);
            // kiểm tra disable
            let isDisable = await page.evaluate(() => {
                try {
                    return document.querySelector('#headingText span').textContent === 'Your account has been disabled';
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            // nếu bị disable
            if (isDisable) {
                helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", "Bị disable");
                // start appear
                await page.evaluate(() => {
                    try {
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Start appeal") {
                                span.parentElement.click();
                                break;
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await helper.delay(10);
                // kiểm tra đã kháng chưa
                let daKhang = await page.evaluate(() => {
                    try {
                        return document.querySelector('#headingText span').textContent === 'You already submitted an appeal'
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                console.log('daKhang', daKhang);
                helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", daKhang ? 'Đã kháng' : 'Bị disable');
                if (daKhang) return true;
                // next đến trang nhập kháng
                await page.evaluate(() => {
                    try {
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Next") {
                                span.parentElement.click();
                                break;
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await helper.delay(5);
                let reason = reportDisableMail.getConplaint();
                // nhập kháng + next
                await page.evaluate((reason) => {
                    try {
                        document.querySelector('textarea').value = reason;
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Next") {
                                span.parentElement.click();
                                break;
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                }, reason);
                await helper.delay(5);
                // nhập mail xác nhận
                let randomIndex = Math.floor(Math.random() * listConfirmMail.length);
                let confirmMail = listConfirmMail[randomIndex];;
                await page.evaluate((confirmMail) => {
                    try {
                        document.querySelector('input[type=email]').value = confirmMail;
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Submit appeal") {
                                span.parentElement.click();
                                break;
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                }, confirmMail);
                await helper.delay(10);
                let khangXong = await page.evaluate(() => {
                    try {
                        return document.querySelector('#headingText span').textContent === 'Your appeal was submitted'
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                console.log('khangXong', khangXong);
                let fileData = khangXong ? 'Đã kháng' : 'Bị disable';
                helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", fileData);
            }
            // nếu chỉ bị verify
            else {
                let dataViotp;
                let phoneOk;
                // chạy thuê phone tối đa 10 lần
                for (let i = 1; i <= 10; i++) {
                    dataViotp = await viotp.thueSo(config.viotpToken);
                    const vioOtpPhone = dataViotp?.data?.data?.phone_number;
                    if (!vioOtpPhone) continue;
                    // nhập số điện thoại
                    await page.evaluate((vioOtpPhone) => {
                        try {
                            document.querySelector('#deviceAddress').value = vioOtpPhone;
                            document.querySelector('input[type=submit]').click();
                            return true;
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    }, vioOtpPhone);
                    await helper.delay(10);
                    // check xem sdt này đã được sử dụng nhiều lần chưa
                    phoneOk = await page.evaluate(() => {
                        try {
                            if (document.querySelector('#error')) return false;
                            return true;
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    });
                    if (phoneOk) break;
                }
                if (!phoneOk) {
                    console.log('Không thuê được sim');
                    return false;
                }
                const requestId = dataViotp.data.data.request_id;
                let codeOk;
                // chạy lấy code tối đa 3 lần
                for (let i = 1; i <= 3; i++) {
                    await helper.delay(30);
                    dataViotp = await viotp.layCode(config.viotpToken, requestId);
                    const googleCode = dataViotp?.data?.data?.Code;
                    if (!googleCode) continue;
                    console.log('googleCode', googleCode);
                    // nhập code
                    codeOk = await page.evaluate((googleCode) => {
                        try {
                            document.querySelector('#smsUserPin').value = googleCode;
                            document.querySelector('input[type=submit]').click();
                            return true;
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    }, googleCode);
                    if (codeOk) break;
                }
                await helper.delay(10);
                if (!codeOk) {
                    console.log('Sim không trả về mã');
                    return false;
                }
            }
            await helper.delay(20);
            page = await navigation.openUrl(page, 'https://www.google.com/');
            await helper.delay(20);
            isLogin = await page.evaluate(async () => {
                const btnLogin = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
                if (btnLogin) {
                    return false;
                }
                return true;
            });
            let fileData = isLogin ? 'Đã verify' : 'Bị verify';
            helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", fileData);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại complaintMail_1');
        return false;
    }
}
module.exports = complaintMail_1;
