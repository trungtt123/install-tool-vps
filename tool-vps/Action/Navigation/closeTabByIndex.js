async function closeTabByIndex(browser, tabIndex) {
  try {
    const pages = await browser.pages();

    if (tabIndex <= 0 || tabIndex > pages.length) {
      console.error(`Tab index ${tabIndex} out of range`);
      return false;
    }

    const page = pages[tabIndex - 1];
    await page.close();
    return true;
  } catch (error) {
    console.error(`Error closing tab by index: ${error}`);
    return false;
  }
}
module.exports = closeTabByIndex;
