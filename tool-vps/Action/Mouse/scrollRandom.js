const helper = require('../Helper/helper')
async function scrollRandom(page, count = 10, pixel = 200, ratioDown = 0.75, timeOutBetween = 5) {
    try {
        // const page = await helper.findActiveTab(browser);
        const maxScrolls = count;
        const scrollAmount = pixel;
        for (let i = 0; i < maxScrolls; i++) {
            const direction = Math.random() < ratioDown ? 1 : 0;
            const scrollY = direction ? scrollAmount : -scrollAmount;
            await page.evaluate((y) => {
                window.scrollBy({
                    top: y,
                    behavior: 'smooth'
                });
            }, scrollY);
            await page.waitForTimeout(timeOutBetween * 1000); // Wait for timeOutBetween second between scrolls
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = scrollRandom;