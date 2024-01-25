async function activateTabByDomain(browser, domain) {
    try {
        const pages = await browser.pages();
        for (const page of pages) {
            const url = await page.url();
            if (url.includes(domain)) {
                await page.bringToFront();
                return page;
            }
        }
        console.error(`No tab found with domain: ${domain}`);
        return null;
    } catch (error) {
        console.error(`Error activating tab by domain: ${error}`);
        return null;
    }
}
module.exports = activateTabByDomain;