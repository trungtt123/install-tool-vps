/*
    script googleSearch_1
    mô tả: nhập từ khóa bất kỳ trong danh sách listKeyword trong file config và xem bài viết bất kỳ
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const goBack = require('../../../Action/Navigation/goBack');
const scrollByPixel = require('../../../Action/Mouse/scrollByPixel');
const scrollRandom = require('../../../Action/Mouse/scrollRandom');
async function checkAllWeb_1(browser, filePath) {
    try {
        let process = true;
        process = await newTab(browser, 'https://www.google.com/');
        process = await newTab(browser, 'https://gmail.com/');
        process = await newTab(browser, 'https://www.youtube.com/');
        process = await newTab(browser, 'https://www.tiktok.com/');
        process = await newTab(browser, 'https://twitter.com/');
        process = await newTab(browser, 'https://www.amazon.com/');
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại checkAllWeb_1');
        return false;
    }
}
module.exports = checkAllWeb_1;
