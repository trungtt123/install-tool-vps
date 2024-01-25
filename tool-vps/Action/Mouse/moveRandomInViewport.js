const helper = require("../Helper/helper");

async function moveRandomInViewport(page, cursor, count) {
  try {
    const {width, height} = await page.evaluate(() => {
      try {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return { width: viewportWidth, height: viewportHeight };
      }
      catch (e) {
        console.error(e);
        return null;
      }
    });
    for (let i = 1; i <= count; i++){
      await cursor.moveTo({x: helper.randomFloat(0, width), y: helper.randomFloat(0, height)});
    }
    return true;
  } catch (error) {
    console.error(`Error moving on element: ${error}`);
    return false;
  }
}

module.exports = moveRandomInViewport;