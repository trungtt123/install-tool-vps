const puppeteer = require('puppeteer');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const viotp = require('../Common/viotp');
const Mailjs = require("@cemalgnlts/mailjs");
const Mail = require('../../../models/Mail');
async function regGmail_3({ browser, profileData, filePath, config }) {
    try {
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
            const mailjs = new Mailjs();
            const mailData = await Mail.findOne({ GPMProfileId: profileData.id });
            const username = mailData.email;
            const password = mailData.password;
            const mailReco = (await mailjs.createOneAccount()).data.username;
            const firstName = mailData.firstName;
            const lastName = mailData.lastName;
            const phone = mailData.phone;
            const ngaySinh = +mailData.birthDay.split('-')[0];
            const thangSinh = +mailData.birthDay.split('-')[1];
            const namSinh = +mailData.birthDay.split('-')[2];
            const gender = mailData.gender;
            page = await navigation.openUrl(page, 'https://accounts.google.com/signup/v2');
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
            // kiểm tra xem ở form đăng ký nào
            let formType = await page.evaluate(() => {
                try {
                    let arr = document.querySelectorAll('form input');
                    if (arr.length === 2) return 1;
                    return 2;
                }
                catch (e) {
                    console.error(e);
                }
            });
            // form 1
            if (formType === 1) {
                // nhập thông tin page 1, nhập lastName và firstName
                await page.evaluate((info) => {
                    console.log(info);
                    try {
                        document.querySelector('input[id="firstName"]').focus();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await keyboard.pressKey(page, firstName, 0.2, 0.5, 1);
                await page.evaluate((info) => {
                    console.log(info);
                    try {
                        document.querySelector('input[id="lastName"]').focus();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await keyboard.pressKey(page, lastName, 0.2, 0.5, 1);
                // nhấn next
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
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });

                await helper.delay(10);
                // nhập thông tin page 2
                let page2 = await page.evaluate((info) => {
                    try {
                        document.querySelector('input[id="day"]').value = info.ngaySinh;
                        document.querySelector("#month").value = info.thangSinh;
                        document.querySelector('input[id="year"]').value = info.namSinh;
                        document.querySelector('#gender').value = info.gender;
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
                }, { phone, mailReco, ngaySinh, thangSinh, namSinh, gender });
                await helper.delay(10);
                // nhập thông tin page 3
                await page.evaluate(async (info) => {
                    console.log(info);
                    function delay(time) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, time * 1000)
                        });
                    }
                    try {
                        // chọn option create your own nếu có
                        let radioButton = document.querySelector('div[role="radio"][data-value="custom"]');
                        if (radioButton) radioButton.click();
                        await delay(2);
                        document.querySelector('input[name="Username"]').focus();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                }, { username });
                await keyboard.pressKey(page, username.split('@')[0], 0.2, 0.5, 1);
                // nhấn next
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
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await helper.delay(10);
                // nhập thông tin page 4, nhập password và confirm
                await page.evaluate(() => {
                    try {
                        document.querySelector('input[name="Passwd"]').focus();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await keyboard.pressKey(page, password, 0.2, 0.5, 1);
                await page.evaluate(() => {
                    try {
                        document.querySelector('input[name="PasswdAgain"]').focus();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await keyboard.pressKey(page, password, 0.2, 0.5, 1);
                // nhấn next
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
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await helper.delay(10);
                // thuê số điện thoại
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
                            document.querySelector('input[id="phoneNumberId"]').value = vioOtpPhone;
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
                    }, vioOtpPhone);
                    await helper.delay(10);
                    // check xem sdt này đã được sử dụng nhiều lần chưa
                    phoneOk = await page.evaluate(() => {
                        try {
                            if (document.querySelector('div[aria-live="polite"]')) return false;
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
                            document.querySelector('input[id="code"]').value = googleCode;
                            document.querySelector("button").click();
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
                // nhập thông tin page 5
                let page5 = await page.evaluate((info) => {
                    try {
                        document.querySelector('#recoveryEmailId').value = info.mailReco;
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
                }, { mailReco });
                await helper.delay(10);
                // skip nhập phone
                await page.evaluate(() => {
                    try {
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Skip") {
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
                // Nhấn Next
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
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                await helper.delay(10);
            }
            // form 2
            else {
                // nhập thông tin page 1
                let page1 = await page.evaluate((info) => {
                    console.log(info);
                    try {
                        document.querySelector('input[id="lastName"]').value = info.lastName;
                        document.querySelector('input[id="firstName"]').value = info.firstName;
                        document.querySelector('input[id="username"]').value = info.username.split('@')[0];
                        document.querySelector('input[name="Passwd"]').value = info.password;
                        document.querySelector('input[name="ConfirmPasswd"]').value = info.password;
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
                }, { lastName, firstName, username, password });
                await helper.delay(10);
                // chọn đầu số việt nam
                let page2 = await page.evaluate(() => {
                    try {
                        let spans = document.querySelectorAll("span");
                        for (let i = 0; i < spans.length; i++) {
                            let span = spans[i];
                            if (span && span.textContent === "Vietnam (+84)") {
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
                // thuê số điện thoại
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
                            document.querySelector('input[id="phoneNumberId"]').value = vioOtpPhone;
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
                    }, vioOtpPhone);
                    await helper.delay(10);
                    // check xem sdt này đã được sử dụng nhiều lần chưa
                    phoneOk = await page.evaluate(() => {
                        try {
                            if (document.querySelector('div[aria-live="polite"]')) return false;
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
                            document.querySelector('input[id="code"]').value = googleCode;
                            document.querySelector("button").click();
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
                // nhập thông tin page 3
                let page3 = await page.evaluate((info) => {
                    try {
                        document.querySelector('input[id="phoneNumberId"]').value = '';
                        document.querySelector('input[name="recoveryEmail"]').value = info.mailReco;
                        document.querySelector('input[id="day"]').value = info.ngaySinh;
                        document.querySelector("#month").value = info.thangSinh;
                        document.querySelector('input[id="year"]').value = info.namSinh;
                        document.querySelector('#gender').value = info.gender;
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
                }, { phone, mailReco, ngaySinh, thangSinh, namSinh, gender });
                await helper.delay(10);
            }
            // click I agree
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "I agree") {
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
            await helper.delay(20);
            // đổi thông tin
            // vào page personal-info
            await page.evaluate(() => {
                try {
                    document.querySelector('a[href*="personal-info"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            // set home address
            await page.evaluate(() => {
                try {
                    document.querySelector('a[href*="address/home"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            // focus input set home address
            await page.evaluate(() => {
                try {
                    document.querySelector('input[aria-label="Address input field"], input[aria-label="Trường nhập địa chỉ"]').focus()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            // nhập home address
            await keyboard.pressKey(page, homeAddress, 0.2, 0.5, 1);
            // save
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "Save") {
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
            // quay lại
            await navigation.goBack(page);
            await helper.delay(5);
            // set work address
            await page.evaluate(() => {
                try {
                    document.querySelector('a[href*="address/work"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(5);
            // focus input set work address
            await page.evaluate(() => {
                try {
                    document.querySelector('input[aria-label="Address input field"], input[aria-label="Trường nhập địa chỉ"]').focus()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            // nhập work address
            await keyboard.pressKey(page, workAddress, 0.2, 0.5, 1);
            // save
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "Save") {
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
            // quay lại
            await navigation.goBack(page);
            await helper.delay(5);

            // vào data & privacy
            await page.evaluate(() => {
                try {
                    document.querySelector('li a[href*="data-and-privacy"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            // click vào web & app activity
            await page.evaluate(() => {
                try {
                    document.querySelector('a[aria-label="Web & App Activity"], a[aria-label="Hoạt động trên web và ứng dụng"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            await page.evaluate(() => {
                try {
                    document.querySelector('button[data-is-on="false"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(2);
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && span.textContent === "1 step") {
                            span.click();
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
            await helper.delay(5);
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && (span.textContent === "Got it" || span.textContent === "Đã hiểu")) {
                            span.click();
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
            await helper.delay(5);
            await navigation.goBack(page);
            await helper.delay(5);

            // click vào youtube history
            await page.evaluate(() => {
                try {
                    document.querySelector('a[aria-label="YouTube History"], a[aria-label="Nhật ký hoạt động trên YouTube"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(10);
            await page.evaluate(() => {
                try {
                    document.querySelector('button[data-is-on="true"]').click()
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(2);
            // scroll để nút tạm dừng hiển thị
            await page.evaluate(() => {
                try {
                    document.querySelector('c-wiz[data-scroll-to-bottom-text] div[jsname="t0Nzx"]').scrollTo(0, 10000)
                    return true;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(2);
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && (span.textContent === "Tạm dừng" || span.textContent === "Pause")) {
                            span.click();
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
            await helper.delay(5);
            await page.evaluate(() => {
                try {
                    let spans = document.querySelectorAll("span");
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span && (span.textContent === "Got it" || span.textContent === "Đã hiểu")) {
                            span.click();
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
            await helper.delay(5);

            page = await navigation.openUrl(page, 'https://www.google.com/');
            await helper.delay(20);
            isLogin = await page.evaluate(async () => {
                const btnLogin = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
                if (btnLogin) {
                    return false;
                }
                return true;
            });
            if (isLogin) {
                let inputStr = await helper.readFileAsync(filePath + "\\mail.txt");
                let firstPipeIndex = inputStr.indexOf('|');
                let secondPipeIndex = inputStr.indexOf('|', firstPipeIndex + 1);
                let thirdPipeIndex = inputStr.indexOf('|', secondPipeIndex + 1);
                if (firstPipeIndex !== -1 && secondPipeIndex !== -1) {
                    // Tạo chuỗi mới bằng cách ghi đè chuỗi "abc" vào vị trí của ký tự '|' thứ 2 và thứ 3
                    let newStr = inputStr.substring(0, secondPipeIndex + 1) + mailReco + inputStr.substring(thirdPipeIndex);
                    helper.overwriteFile(filePath + "\\mail.txt", newStr.trim());
                }
            }
        }
        console.log("isLogin", isLogin);
        // kiểm tra xem file log đã tồn tại hay chưa, nếu chưa tạo file log 
        helper.createLogFile(filePath + "\\mail-log", 'login-mail.txt');
        let fileData = isLogin ? 'Đã login' : 'Chưa login';
        helper.overwriteFile(filePath + "\\mail-log\\login-mail.txt", fileData);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại regGmail_3');
        return false;
    }
}
module.exports = regGmail_3;
