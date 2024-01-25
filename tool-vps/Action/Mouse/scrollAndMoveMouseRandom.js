const helper = require('../Helper/helper');
const scrollRandom = require('./scrollRandom');

async function scrollAndMoveMouseRandom({
    page,
    cursor,
    count = 10,
    pixel = 200,
    ratioDown = 0.75,
    timeOutBetween = 5
}) {
    try {
        for (let i = 0; i < count; i++) {
            await scrollRandom(page, 1, pixel, ratioDown, timeOutBetween);
            await cursor.moveTo({ x: helper.randomFloat(500, 505), y: helper.randomFloat(500, 505) });
            const imgs = page.$('')
            await helper.isElementInViewport()
        }
        // await scrollRandom(page, countScroll, pixel, ratioDown, timeOutBetween);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = scrollAndMoveMouseRandom;