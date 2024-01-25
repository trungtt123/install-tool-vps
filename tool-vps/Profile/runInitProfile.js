const puppeteer = require('puppeteer');

const args = [
  // '--disable-background-networking',
  // '--disable-background-timer-throttling',
  // '--disable-client-side-phishing-detection',
  // '--disable-default-apps',
  // '--disable-dev-shm-usage',
  // '--disable-extensions',
  // '--disable-features=site-per-process',
  // '--disable-hang-monitor',
  // '--disable-popup-blocking',
  // '--disable-prompt-on-repost',
  // '--disable-sync',
  // '--disable-translate',
  // '--disable-web-security',
  // '--metrics-recording-only',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  // '--user-data-dir=C:/Users/ADMIN/AppData/Local/Google/Chrome/User Data/Profile 1'
];

async function runInitProfile(headless = 'new') {
  try {
    const browser = await puppeteer.launch({
      args: args,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: headless
    });
    const browserWsEndpoint = browser.wsEndpoint();
    console.log('Remote debugging URL:', browserWsEndpoint);
    let page = await browser.newPage();
    await page.goto('https://www.google.com/')
    return browser;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}
// runInitProfile()
module.exports = runInitProfile;
