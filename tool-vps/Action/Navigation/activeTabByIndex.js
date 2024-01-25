async function activateTabByIndex(browser, tabIndex) {
    try {
        const pages = await browser.pages();
        console.log('pages.length', pages.length);
        const index = tabIndex - 1;
        if (index >= 0 && index < pages.length) {
            await pages[index].bringToFront();
            return pages[index];
        }
        console.error(`Invalid tab index: ${tabIndex}`);
        return null;
    } catch (error) {
        console.error(`Error activating tab by index: ${error}`);
        return null;
    }
}
module.exports = activateTabByIndex;