const helper = require('../Helper/helper')
async function goBack(activePage) {
  try {
    await activePage.goBack();
    return activePage;
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = goBack;
