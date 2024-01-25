const { default: axios } = require('axios');
const helper = require('../Helper/helper');
const keyboard = require('../Keyboard/keyboard');
const fs = require('fs');
const path = require('path');
const { API_PYTHON_URL } = require('../../const');
async function openUrl(page, url, config = {}) {
  try {
    await page.goto(url, { timeout: 60 * 1000 });
    // check captcha
    try {
      if (url.includes('www.google.com')) {
        let frameHandle = await page.$('iframe[title="reCAPTCHA"]');
        let frame = await frameHandle.contentFrame();
        await frame.evaluate(() => {
          document.querySelector('#recaptcha-anchor').click()
        });
        let max = 10;
        while (--max) {
          await helper.delay(5);
          frameHandle = await page.$('iframe[title*="recaptcha"]');
          frame = await frameHandle.contentFrame();
          const clickAudioButotn = await frame.evaluate(() => {
            try {
              document.querySelector('#recaptcha-audio-button').click()
              return true;
            }
            catch (e) {
              console.log(e);
              return false
            }
          });
          if (clickAudioButotn) break;
        }
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
    catch (e) {
    }

    return page;
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = openUrl;
