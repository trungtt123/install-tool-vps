const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
async function grvt({ browser, filePath, config }) {
    try {
        const refsStr = await helper.readFileAsync("C:\\tool-social\\grvt-refs.txt");
        const refs = refsStr.split("\r\n");
        console.log("refs", refs);
        const randomIndex = Math.floor(Math.random() * refs.length);
        const ref = refs[randomIndex];
        let page = await navigation.newTab(browser, ref);
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('img[src*="/_images/personal-sign-up.png"]').click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(5);
        await page.evaluate(() => {
            try {
                let arr = document.querySelectorAll('.fx.fx-ai-center button');
                for (const item of arr) {
                    if (item.textContent.trim().toUpperCase() === "GOOGLE") {
                        item.click();
                        break;
                    }
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('div[data-identifier*="@gmail.com"]').click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelectorAll('button')[1].click()
                return true;
            }
            catch (e) {
                return false;
            }
        });
        await helper.delay(200);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại grvt');
        return false;
    }
}
module.exports = grvt;

