const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const path = require('path');
const fs = require('fs');
const Fakerator = require("fakerator");
const { default: axios } = require('axios');
const { API_PYTHON_URL } = require('../../../const');
const dbLocal = require('../../../Database/database');
async function login({ browser, profileData, config }) {
    try {
        const email = profileData?.spotify?.email;
        const password = profileData?.spotify?.password;
        let page = await navigation.newTab(browser, 'https://open.spotify.com/');
        await helper.delay(10);
        // logout
        let isLoggined = await page.evaluate(() => {
            try {
                document.querySelector('button[data-testid="login-button"]').click();
                return false;
            }
            catch (e) {
                return true;
            }
        });
        if (!isLoggined) {
            await helper.delay(5);
            await page.evaluate(() => {
                try {
                    document.querySelector('input#login-username').focus();
                }
                catch (e) {

                }
            });
            await keyboard.pressKey(page, email, 0);
            await helper.delay(2);
            await page.evaluate(() => {
                try {
                    document.querySelector('input#login-password').focus();
                }
                catch (e) {

                }
            });
            await keyboard.pressKey(page, password, 0);
            await helper.delay(2);
            await page.evaluate(() => {
                try {
                    document.querySelector('button#login-button').click();
                    return true;
                }
                catch (e) {
                    return false;
                }
            });
            await helper.delay(10);
            let frameHandle, count = 10;
            while (!frameHandle && count > 0) {
                await helper.delay(5);
                frameHandle = await page.$('iframe[title="reCAPTCHA"]');
            }
            if (frameHandle) {
                await helper.delay(5);
                let frame = await frameHandle.contentFrame();
                await frame.evaluate(() => {
                    try {
                        document.querySelector('#recaptcha-anchor').click()
                    }
                    catch (e){

                    }
                });

                await helper.delay(5);
                frameHandle = await page.$('iframe[title*="recaptcha"]');
                if (frameHandle) {
                    frame = await frameHandle.contentFrame();
                    await frame.evaluate(() => {
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
            }
            isLoggined = await page.evaluate(() => {
                try {
                    document.querySelector('button[data-testid="login-button"]').click();
                    return false;
                }
                catch (e) {
                    return true;
                }
            });
        }
        const data = await dbLocal.getData();
        const profile = data?.profiles?.find(o => o.id === profileData.id);
        let spotify = profile?.spotify || {};
        spotify["login"] = isLoggined;
        profile["spotify"] = spotify;
        await dbLocal.updateData(data);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại login');
        return false;
    }
}
module.exports = login;
