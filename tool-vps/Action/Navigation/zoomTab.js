const helper = require('../Helper/helper');
async function zoomTab(page, zoom = 1) {
  try {
    // const page = await helper.findActiveTab(browser);
    // await page.evaluate((zoom) => {
    //   document.body.style.zoom = zoom;
    // }, [zoom]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
module.exports = zoomTab;
