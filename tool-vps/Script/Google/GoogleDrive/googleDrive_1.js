/*
    script googleDrive_1
    mô tả: Tải tệp lên google drive
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function googleDrive_1({ browser, filePath, config }) {
    try {
        let { pathDriveFolder } = config;
        if (pathDriveFolder.endsWith("/")) {
            // Xóa dấu "/" ở cuối đường dẫn
            pathDriveFolder = pathDriveFolder.slice(0, -1);
        }
        console.log('pathDriveFolder', pathDriveFolder);
        let files = helper.getFilesInDirectory(pathDriveFolder);
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://drive.google.com/');
        if (page) page = await navigation.openUrl(page, 'https://drive.google.com/');
        else page = await navigation.newTab(browser, 'https://drive.google.com/');
        if (!page) {
            console.log('error tại vị trí open drive');
            return false;
        }
        await helper.delay(30);
        // check xem có dialog không, nếu có thì đóng cmn vào
        await page.evaluate(() => {
            try {
                document.querySelector('button[aria-label="Đóng"], button[aria-label="Close"]').click();
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(5);
        const btnAdd = await page.$('button[guidedhelpid="new_menu_button"]');
        await btnAdd.click();
        await helper.delay(5);
        const btnUploadFile = (await page.$$('div[role="presentation"] div[role="menuitem"]'))[1];
        let randomIndex = Math.floor(Math.random() * files.length);
        const filePath = `${pathDriveFolder}/${files[randomIndex]}`; // Thay đổi đường dẫn tệp tin thành tệp tin thực tế bạn muốn chọn

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            btnUploadFile.click()
        ])
        if (!fileChooser) {
            console.log('Không mở được filechooser')
            return false;
        }
        await fileChooser.accept([filePath]);
        await helper.delay(10);
        await page.evaluate(() => {
            function randomFloat(x, y) {
                return x + (y - x) * Math.random();
            }
            try {
                if (randomFloat(0, 1) < 0.5) {
                    document.querySelectorAll('div[role="dialog"] div[role="radiogroup"] div[role="presentation"] input')[0].click();
                }
                else {
                    document.querySelectorAll('div[role="dialog"] div[role="radiogroup"] div[role="presentation"] input')[1].click();
                }
                console.log('run');
                document.querySelectorAll('div[role="dialog"] button')[1].click();
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        for (let i = 1; i < 100; i++) {
            await helper.delay(2);
            let uploaded = await page.evaluate(() => {
                try {
                    let el = document.querySelector('span[aria-label="1 upload complete"], span[aria-label="Đã tải xong 1 mục lên"]');
                    if (el) return true;
                    return false;
                }
                catch (e) {
                    console.log(e);
                    return false;
                }
            });
            if (uploaded) break;
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại googleDrive_1');
        return false;
    }
}
module.exports = googleDrive_1;
