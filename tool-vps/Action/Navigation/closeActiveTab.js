
async function closeActiveTab(page) {
  try {
    await page.close();
    return true;
  } catch (error) {
    console.error(`Error closing active tab: ${error}`);
    return false;
  }
}
module.exports = closeActiveTab;
