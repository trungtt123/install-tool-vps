const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const path = require('path');
const fs = require('fs');
const Fakerator = require("fakerator");
const { default: axios } = require('axios');
const { API_PYTHON_URL } = require('../../../const');
const dbLocal = require('../../../Database/database');
async function track({ browser, profileData, config }) {
    try {
        const track = "31nfSRfiLgAaByunzEfTCb";
        let page = await navigation.newTab(browser, `https://open.spotify.com/track/${track}`);
        await helper.delay(10);
        await page.evaluate(() => {
            try {
                document.querySelector('main button[data-testid="play-button"]').click()
                return false;
            }
            catch (e) {
                return true;
            }
        });
        await helper.delay(120);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại login');
        return false;
    }
}
module.exports = track;
