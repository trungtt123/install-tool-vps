async function scrollToElement(page, selector) {
    try {
        return await page.evaluate((selector) => {
            const element = selector;
            const blockValues = ['start', 'center', 'end', 'nearest'];
            const block = blockValues[Math.floor(Math.random() * blockValues.length)];
            try {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return true;
            }
            catch (e) {
                return false;
            }
        }, selector);
    } catch (error) {
        console.error(`Lỗi khi cuộn đến phần tử: ${error.message}`);
        return false;
    }
}
module.exports = scrollToElement;