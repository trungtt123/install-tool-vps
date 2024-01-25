async function up(page) {
    try {
      await page.mouse.up();
      return true;
    } catch (error) {
      console.error(`Error up: ${error}`);
      return false;
    }
  }
  
module.exports = up;