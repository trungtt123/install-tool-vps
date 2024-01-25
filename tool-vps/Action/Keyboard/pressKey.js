const helper = require('../Helper/helper')
async function pressKey(activePage, text, ratioWrong = 0.2, minSpeed = 0.1, maxSpeed = 0.5) {
    try {
        const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for await (const char of text) {
            if (helper.randomFloat(0, 1) < ratioWrong) {
                const wrongChar = validChars.charAt(Math.floor(Math.random() * validChars.length));
                activePage.keyboard.type(wrongChar);
                await helper.delay(helper.randomFloat(minSpeed, maxSpeed));
                activePage.keyboard.press('Backspace');
                await helper.delay(helper.randomFloat(minSpeed, maxSpeed));
                activePage.keyboard.type(char);
                await helper.delay(helper.randomFloat(minSpeed, maxSpeed));
            }
            else {
                activePage.keyboard.type(char);
                await helper.delay(helper.randomFloat(minSpeed, maxSpeed));
            }
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
module.exports = pressKey;
