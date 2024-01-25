const helper = require('../Helper/helper')
async function moveToElement(cursor, selector) {
    try {
      await cursor.move(selector);
      return true;
    } catch (error) {
      console.error(`Error moving on element: ${error}`);
      return false;
    }
  }
  
module.exports = moveToElement;