/*
    script googleMap_1
    mô tả: Tìm kiếm các địa chỉ trong danh sách
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function googleMap_1({ browser, filePath, config }) {
    try {
        let { listKeyword } = config;
        if (!listKeyword) listKeyword = "";
        // listKeyword = helper.getRandomPhrase(listKeyword);
        let process = true;
        let page;
        page = await navigation.activateTabByDomain(browser, 'https://www.google.com/maps');
        if (page) page = await navigation.openUrl(page, 'https://www.google.com/maps');
        else page = await navigation.newTab(browser, 'https://www.google.com/maps');
        if (!page) {
            console.log('error tại vị trí open google map');
            return false;
        }
        let cursor = createCursor(page);
        await installMouseHelper(page);
        page = await navigation.reload(page);
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                const inputSearch = document.querySelector('input');
                inputSearch.focus();
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await keyboard.pressKey(page, helper.getRandomPhrase(listKeyword, "|"));
        await page.keyboard.press("Enter");
        await helper.delay(10);
        // click chọn random địa điểm
        await page.evaluate(async () => {
            try {
                const placeArr = document.querySelectorAll('a[href*="https://www.google.com/maps/place"]');
                const randomIndex = Math.floor(Math.random() * placeArr.length);
                const randomLink = placeArr[randomIndex];
                randomLink.click();
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(10);
        // nhấn nút close panel
        await page.evaluate(async () => {
            try {
                let arr = document.querySelectorAll('button[aria-label="Collapse side panel"]');
                for (let btn of arr) {
                    const { width, height } = btn.getBoundingClientRect();
                    if (width * height !== 0) {
                        btn.click();
                        return true;
                    }
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        // nhấn giữ kéo 10 lần
        for (let i = 1; i <= 10; i++){
            await mouse.moveToPosition(cursor, { x: helper.randomFloat(0, 500), y: helper.randomFloat(0, 500) });
            await mouse.down(page);
            await mouse.moveToPosition(cursor, { x: helper.randomFloat(0, 500), y: helper.randomFloat(0, 500) });
            await mouse.up(page);
            await helper.delay(2);
        }
        // random 50% đóng tab sau khi xem
        if (helper.randomFloat(0, 1) < 1) {
            await navigation.closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại googleMap_1');
        return false;
    }
}
module.exports = googleMap_1;
