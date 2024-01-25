const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const Mail = require('../../../models/Mail');
const dbLocal = require('../../../Database/database');
const path = require('path');
const fs = require('fs');
const Fakerator = require("fakerator");
const { default: axios } = require('axios');
const { API_PYTHON_URL } = require('../../../const');
const fakerator = Fakerator();
async function spotifySignUp({ browser, profileData, filePath }) {
    try {
        for (let i = 1; i <= 100; i++) {
            try {
                let page = await navigation.newTab(browser, 'https://open.spotify.com/');
                await helper.delay(10);
                // logout
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="user-widget-link"]').click();
                    }
                    catch (e) {

                    }
                });
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="user-widget-dropdown-logout"]').click();
                    }
                    catch (e) {

                    }
                });
                await helper.delay(10);
                const randomEmail = fakerator.internet.email();
                const email = randomEmail.split("@")[0] + fakerator.internet.userName() + "@" + randomEmail.split("@")[1];

                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="login-button"]').previousElementSibling.click();
                    }
                    catch (e) {

                    }
                });
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('input#username').focus();
                    }
                    catch (e) {

                    }
                });
                await keyboard.pressKey(page, email, 0);
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="submit"]').click()
                    }
                    catch (e) {

                    }
                });
                await helper.delay(5);
                await page.evaluate(() => {
                    try {
                        document.querySelector('input#new-password').focus();
                    }
                    catch (e) {

                    }
                });
                await keyboard.pressKey(page, 'trungtt123', 0);
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="submit"]').click()
                    }
                    catch (e) {

                    }
                });
                await helper.delay(5);
                const displayName = fakerator.names.name();
                await page.evaluate(() => {
                    try {
                        document.querySelector('input#displayName').focus();
                    }
                    catch (e) {

                    }
                });
                await keyboard.pressKey(page, displayName, 0);
                await helper.delay(2);
                const year = helper.randomInt(1975, 2005);
                await page.evaluate(() => {
                    try {
                        document.querySelector('input#year').focus();
                    }
                    catch (e) {

                    }
                });
                await keyboard.pressKey(page, year.toString(), 0);
                await helper.delay(2);
                const month = helper.randomInt(1, 12);
                await page.select('select#month', month.toString());
                await helper.delay(2);
                const day = helper.randomInt(1, 28);
                await page.evaluate(() => {
                    try {
                        document.querySelector('input#day').focus();
                    }
                    catch (e) {

                    }
                });
                await keyboard.pressKey(page, day.toString(), 0);
                await helper.delay(2);
                const gender = helper.randomInt(0, 4);
                await page.evaluate((gender) => {
                    try {
                        document.querySelectorAll('input[type="radio"]')[gender].click()
                    }
                    catch (e) {

                    }
                }, (gender));
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="submit"]').click()
                    }
                    catch (e) {

                    }
                });
                await helper.delay(5);
                await page.evaluate(() => {
                    try {
                        document.querySelectorAll('input[type="checkbox"]')[0].click()
                        document.querySelectorAll('input[type="checkbox"]')[1].click()
                        document.querySelectorAll('input[type="checkbox"]')[2].click()
                    }
                    catch (e) {

                    }
                });
                await helper.delay(2);
                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-testid="submit"]').click()
                    }
                    catch (e) {

                    }
                });
                let frameHandle, count = 10;
                while (!frameHandle && count > 0) {
                    await helper.delay(5);
                    frameHandle = await page.$('iframe[title="reCAPTCHA"]');
                }

                await helper.delay(5);
                let frame = await frameHandle.contentFrame();
                await frame.evaluate(() => {
                    document.querySelector('#recaptcha-anchor').click()
                });

                await helper.delay(5);
                frameHandle = await page.$('iframe[title*="recaptcha"]');
                if (frameHandle) {
                    frame = await frameHandle.contentFrame();
                    const clickAudioButotn = await frame.evaluate(() => {
                        try {
                            document.querySelector('#recaptcha-audio-button').click();
                            return true;
                        }
                        catch (e) {
                            console.log(e);
                            return false
                        }
                    });

                    await helper.delay(2);
                    const fileUrl = await frame.evaluate(() => {
                        try {
                            return document.querySelector('a[href*="audio.mp3"]').href;
                        }
                        catch (e) {
                            console.log(e);
                            return ""
                        }
                    });
                    console.log("fileUrl", fileUrl);
                    const folderPath = __pythonService + "\\python-service\\Service\\SpeechToText\\file";
                    const fileName = `audio_${(new Date()).getTime()}`;
                    const filePath = path.join(folderPath, fileName + ".mp3");
                    // tải file audio
                    await axios({
                        method: 'get',
                        url: fileUrl,
                        responseType: 'stream', // Thiết lập responseType để nhận dữ liệu dưới dạng stream
                    })
                        .then(response => {
                            // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa, tạo thư mục
                            if (!fs.existsSync(folderPath)) {
                                fs.mkdirSync(folderPath, { recursive: true });
                            }

                            // Mở một writable stream để lưu dữ liệu vào tệp tin
                            const writer = fs.createWriteStream(filePath);

                            // Pipe dữ liệu từ response.data (stream) vào writable stream
                            response.data.pipe(writer);

                            // Trả về một Promise để xác nhận khi tải xong
                            return new Promise((resolve, reject) => {
                                writer.on('finish', resolve);
                                writer.on('error', reject);
                            });
                        })
                        .then(() => {
                            console.log(`File downloaded to: ${filePath}`);
                        })
                        .catch(error => {
                            console.error(`Error downloading file: ${error.message}`);
                        });
                    const result = await axios({
                        method: 'get',
                        url: `${API_PYTHON_URL}/api/python-service/speech-to-text?fileName=${fileName}`
                    })
                    const message = result.data.message;
                    await frame.evaluate(() => {
                        try {
                            document.querySelector('input#audio-response').focus();
                        }
                        catch (e) {
                            console.log(e);
                        }
                    });
                    await keyboard.pressKey(page, message, 0, 0.01, 0.1);
                    await helper.delay(2);
                    await frame.evaluate(() => {
                        try {
                            document.querySelector('button#recaptcha-verify-button').click();
                        }
                        catch (e) {
                            console.log(e);
                        }
                    });
                    await helper.delay(10);
                }

                await page.evaluate(() => {
                    try {
                        document.querySelector('button[data-is-ready="true"]').click();
                        return true;
                    }
                    catch (e) {

                    }
                });
                console.log(email | 'trungtt123');
                helper.appendToLog('C:\\tool-vps\\Spotify\\signup.txt', `${email}|trungtt123`);
                await helper.delay(10);
                await navigation.closeTabByDomain(browser, 'spotify.com');
            }
            catch (e) {
                await navigation.closeTabByDomain(browser, 'spotify.com');
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại spotifySignUp');
        return false;
    }
}
module.exports = spotifySignUp;
