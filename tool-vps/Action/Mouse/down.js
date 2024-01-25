async function down(page) {
    try {
      await page.mouse.down();
      return true;
    } catch (error) {
      console.error(`Error down: ${error}`);
      return false;
    }
  }
  
module.exports = down;