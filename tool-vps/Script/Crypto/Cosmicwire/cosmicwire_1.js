/*
    script cosmicwire_1
    mô tả: lướt lên xuống xem video tại trang chủ tiktok, random follow, like
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const goBack = require('../../../Action/Navigation/goBack');
const scrollByPixel = require('../../../Action/Mouse/scrollByPixel');
const scrollRandom = require('../../../Action/Mouse/scrollRandom');
const navigation = require('../../../Action/Navigation/navigation');
async function cosmicwire_1({browser, filePath}) {
    try {
        let page = await newTab(browser, 'https://www.cosmicwire.com/');
        // tạo file log 
        let listMails = (await helper.readFileAsync('C:\\listmails\\listmails.txt'))?.trim()?.split('\n');
        while (listMails.length > 0){
            page = await navigation.reload(page);
            await helper.delay(helper.randomFloat(15, 20));
            let submited = (await helper.readFileAsync("C:\\listmails\\submited-mail.txt"))?.trim()?.split('\n');
            listMails = listMails.filter(o => !submited.includes(o));
            if (listMails.length > 0){
                let randomIndex = helper.randomInt(0, listMails.length - 1);
                let data = listMails[randomIndex];
                let mail = data.split("|")[0];
                let lastName = data.split("|")[1];
                let firstName = data.split("|")[2];
                let check = await page.evaluate(async (info) => {
                    try {
                        document.querySelector('#First-Name').value = info.firstName;
                        document.querySelector('#Last-Name').value = info.lastName;
                        document.querySelector('input[type="email"]').value = info.mail;
                        document.querySelector('input[type="submit"]').click();
                        return true;
                    }
                    catch(e){
                        return false;
                    }
                }, {mail, lastName, firstName});
                if (check){
                    helper.appendToLog("C:\\listmails\\submited-mail.txt", data);
                    await helper.delay(helper.randomFloat(5, 7));
                }
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại cosmicwire_1');
        return false;
    }
}
module.exports = cosmicwire_1;
