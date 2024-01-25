const helper = require('../Helper/helper')
async function reload(activePage) {
  try {
    await activePage.reload();
    return activePage;
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = reload;
