const helper = require('../Helper/helper')
async function click(cursor, selector = undefined) {
    try {
      if (selector) await cursor.click(selector);
      else await cursor.click();
      return true;
    } catch (error) {
      console.error(`Error clicking on element: ${error}`);
      return false;
    }
  }
  
module.exports = click;