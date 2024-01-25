const puppeteer = require('puppeteer');
const activateTabByDomain = require('../../Action/Navigation/activeTabByDomain');
const closeTabByIndex = require('../../Action/Navigation/closeTabByIndex');
const reload = require('../../Action/Navigation/reload');
const helper = require('../../Action/Helper/helper');

let listQ = [];

async function connectBrowser() {
    try {
        // lấy ws 
        // const browserTmp = await puppeteer.launch({
        //   headless: true,
        // });
        // const pageTmp = await browserTmp.newPage();
        // await pageTmp.goto('http://' + browserLink + '/json/version');
        // await helper.delay(5);

        // const dataBrowser = await pageTmp.evaluate(() => {
        //   return JSON.parse(document.querySelector('body').innerText);
        // });
        // await browserTmp.close();

        const browserFB = await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:54852/devtools/browser/d5f39a99-a1c3-4d27-bd6b-2f8e6887bf7f' });
        const browserGPT = await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:54900/devtools/browser/866e2048-2d66-4942-b5ae-5df013603c0a' });

        const fb = await activateTabByDomain(browserFB, 'https://m.facebook.com/');
        const gpt = await activateTabByDomain(browserGPT, 'https://chat.openai.com/');
        // await helper.delay(5);
        await fb.reload();
        await gpt.reload();
        // await helper.delay(5);

        let arrContent = await fb.evaluate(() => {
            try {
                let arr = document.querySelectorAll('#messageGroup ._z3m .msg ._34ej');
                let data = [];
                for (const item of arr) {
                    if (item.textContent.includes('#gpt')) {
                        data.push(item.textContent.replace(/#gpt/g, ""));
                    }
                }
                return data;
            }
            catch (e) {
                return [];
            }
        })
        console.log(arrContent);
        for (const question of arrContent) {
            if (!listQ.includes(question)) {
                await gpt.type('textarea', question);
                await helper.delay(1);
                await gpt.keyboard.press('Enter');
                await helper.delay(10);
                const arr = await gpt.$$('.flex.flex-col.items-center.text-sm .group');
                const answer = (await arr[arr.length - 1].evaluate((node) => node.textContent)).replace(/(1|2) \/ (1|2)/, '');
                await fb.type('textarea', "q: " + question + "\n" + "aws: " + answer);
                await fb.click('#message-reply-composer form button[type="submit"]');
                listQ.push(question);
            }
        }
    }
    catch (e) {
        console.log('Error', e);
        return null;
    }
}
async function run() {
    while (1) {
        connectBrowser();
        await helper.delay(30);
    }
}

run();