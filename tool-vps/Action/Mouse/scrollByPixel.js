const helper = require('../Helper/helper')
async function scrollByPixel(page, pixel) {
    try {
        // const page = await helper.findActiveTab(browser);
        await page.evaluate(() => {
            window.scrollBy(0, 500);
        });

        return true;
    } catch (error) {
        console.error(`Error scroll on element: ${error}`);
        return false;
    }
}

module.exports = scrollByPixel;