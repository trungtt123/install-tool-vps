const puppeteer = require('puppeteer');
const helper = require('../Action/Helper/helper');
const navigation = require('../Action/Navigation/navigation');

async function runLocalProfile(browserLink) {
  console.log('browserLink', browserLink);
  try {
    // lấy ws 
    const browserTmp = await puppeteer.launch({
      headless: "new",
    });
    const pageTmp = await browserTmp.newPage();
    await pageTmp.goto('http://' + browserLink + '/json/version');
    await helper.delay(5);
    const dataBrowser = await pageTmp.evaluate(() => {
      return JSON.parse(document.querySelector('body').innerText);
    });
    await browserTmp.close();
    const browser = await puppeteer.connect({ browserWSEndpoint: dataBrowser.webSocketDebuggerUrl });
    return browser;
  }
  catch (e) {
    console.log('Error', e);
    return null;
  }
}
module.exports = runLocalProfile;
