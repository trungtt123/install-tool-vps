/*
    script createChannel
    mô tả: Tải tệp lên google drive
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function createChannel({ browser, filePath, config }) {
    try {
        let { pathDriveFolder, avatarPercent, createChannelPercent } = config;
        if (helper.randomFloat(0, 100) > createChannelPercent) return true;
        if (pathDriveFolder.endsWith("/")) {
            // Xóa dấu "/" ở cuối đường dẫn
            pathDriveFolder = pathDriveFolder.slice(0, -1);
        }
        console.log('pathDriveFolder', pathDriveFolder);
        let files = helper.getFilesInDirectory(pathDriveFolder);
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://www.youtube.com/');
        if (page) page = await navigation.openUrl(page, 'https://www.youtube.com/');
        else page = await navigation.newTab(browser, 'https://www.youtube.com/');
        if (!page) {
            console.log('error tại vị trí open youtube');
            return false;
        }
        await helper.delay(20);
        // check xem có dialog không, nếu có thì đóng cmn vào
        await page.evaluate(() => {
            try {
                document.querySelector('button#avatar-btn').click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(5);
        await page.evaluate(() => {
            try {
                document.querySelector('#manage-account a').click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(5);
        if (helper.randomFloat(0, 100) <= avatarPercent) {
            const btnUploadFile = await page.$('button[aria-label="Upload picture"]');
            let randomIndex = Math.floor(Math.random() * files.length);
            const filePath = `${pathDriveFolder}/${files[randomIndex]}`; // Thay đổi đường dẫn tệp tin thành tệp tin thực tế bạn muốn chọn
            console.log('filePath', filePath);
            try {
                const [fileChooser] = await Promise.all([
                    btnUploadFile?.click(),
                    page?.waitForFileChooser()
                ])
                if (!fileChooser) {
                    console.log('Không mở được filechooser')
                }
                else {
                    await fileChooser?.accept([filePath]);
                    await helper.delay(10);
                    await page.evaluate(() => {
                        try {
                            document.querySelector('button[aria-label="Done"]').click()
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    });
                    await helper.delay(5);
                }
            }
            catch (e) {
                // console.log(e);
            }
        }
        await page.evaluate(() => {
            try {
                document.querySelector('button[aria-label="Create channel"]').click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(100);
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại createChannel');
        return false;
    }
}
module.exports = createChannel;
