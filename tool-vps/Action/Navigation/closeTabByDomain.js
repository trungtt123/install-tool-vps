async function closeTabByDomain(browser, domain) {
    try {
        const pages = await browser.pages();

        for (let page of pages) {
            const url = await page.url();

            if (url.includes(domain)) {
                await page.close();
            }
        }

        return true;
    } catch (error) {
        console.error(`Error closing tab(s) for ${domain}: ${error}`);
        return false;
    }
}
module.exports = closeTabByDomain;