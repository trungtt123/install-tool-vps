const click = require('./click');
const moveToElement = require('./moveToElement');
const scrollByPixel = require('./scrollByPixel');
const scrollRandom = require('./scrollRandom');
const scrollToElement = require('./scrollToElement');
const moveRandomInViewport = require('./moveRandomInViewport');
const moveToPosition = require('./moveToPosition');
const down = require('./down');
const up = require('./up');
const mouse = {
    click,
    moveToElement,
    scrollByPixel,
    scrollRandom,
    scrollToElement,
    moveRandomInViewport,
    moveToPosition,
    down, 
    up
}
module.exports = mouse;