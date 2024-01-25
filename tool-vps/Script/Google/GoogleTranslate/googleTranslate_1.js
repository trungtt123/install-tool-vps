/*
    script googleTranslate_1
    mô tả: sử dụng google dịch, random dịch từ trong danh sách
*/
const { createCursor, installMouseHelper } = require('ghost-cursor');
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const navigation = require('../../../Action/Navigation/navigation');
const sentences = require('./sentences');
async function googleTranslate_1({ browser, profileData, config }) {
    try {
        let page = await navigation.newTab(browser, `https://translate.google.com/?sl=auto&tl=en&op=translate`);
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(10);
        let count = helper.randomInt(10, 20);
        while (--count){
            const randomIndex = helper.randomInt(0, sentences.length - 1);
            const percent = helper.randomFloat(50, 100);
            const sentence = helper.shuffleAndSelectWords(sentences[randomIndex], percent);
            await page.evaluate(() => {
                try {
                    document.querySelector('textarea').value = '';
                }
                catch (e){
    
                }
            });
            await helper.delay(2);
            await page.evaluate(() => {
                try {
                    document.querySelector('textarea').focus();
                }
                catch (e){
    
                }
            });
            await keyboard.pressKey(page, sentence);
            // random ngôn ngữ dịch
            if (helper.randomFloat(0, 1) < 0.5){
                await page.evaluate(() => {
                    try {
                        document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb.EjH7wc > div.aCQag > c-wiz > div.zXU7Rb > c-wiz > div:nth-child(5) > button").click()
                    }
                    catch (e){
        
                    }
                });
                await helper.delay(2);
                const languages = ['vi', 'ja', 'de', 'ko', 'pt', 'fr', 'pa', 'it', 'sv'];
                const randomLanguageIndex = helper.randomInt(0, languages.length - 1);
                const language = languages[randomLanguageIndex];
                await page.evaluate((language) => {
                    try {
                        document.querySelector(`#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb.EjH7wc > div.aCQag > c-wiz > div:nth-child(2) > c-wiz > div.ykTHSe`).querySelector(`div[data-language-code="${language}"]`).click()
                    }
                    catch (e){
        
                    }
                }, (language));
                await helper.delay(2);
            }
            await helper.delay(helper.randomFloat(10, 20));
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại googleTranslate_1');
        return false;
    }
}
module.exports = googleTranslate_1;
