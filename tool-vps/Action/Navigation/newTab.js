const puppeteer = require('puppeteer');
const helper = require('../Helper/helper');
const openUrl = require('./openUrl');

async function newTab(browser, url = undefined, config = {}) {
  try {
    const page = await browser.newPage({ timeout: 60 * 1000 });
    config["width"] = helper.randomInt(450, 500);
    config["height"] = helper.randomInt(300, 300);
    if (config?.width && config?.height) await page.setViewport({
      width: 1920,//config.width,
      height: 1080//config.height,
    });
    if (url) await openUrl(page, url)
    return page;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = newTab;
