async function getCurrentPageIndexByUrl(browser, domain) {
    try {
        const pages = await browser.pages();
        for (const index in pages) {
            const url = await pages[index].url();
            if (url.includes(domain)) {
                return +index + 1;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}
module.exports = getCurrentPageIndexByUrl;