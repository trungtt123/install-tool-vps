const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const dbLocal = require('../../../Database/database');
const mouse = require('../../../Action/Mouse/mouse');
async function watchFacebook({ browser, profileData, config }) {
    try {
        let { likePercent, commentPercent, sharePercent } = config || {};
        if (!likePercent) likePercent = 20;
        if (!commentPercent) commentPercent = 0;
        if (!sharePercent) sharePercent = 20;
        let page = await navigation.newTab(browser, 'https://www.facebook.com/watch');
        await helper.delay(20);
        const randomScroll = helper.randomInt(5, 20);
        const videoDaXem = [];
        for (let i = 1; i <= randomScroll; i++) {
            // select video
            const blobLink = await page.evaluate((videoDaXem) => {
                function randomInt(x, y) {
                    return Math.floor(Math.random() * (y - x + 1)) + x;
                }
                try {
                    const videos = Array.from(document.querySelectorAll('video')).filter(o => !videoDaXem.includes(o.src));
                    const randomVideo = videos[randomInt(0, Math.min(videos.length, 5))];
                    return randomVideo.src;
                }
                catch (e) {

                }
            }, (videoDaXem));
            console.log('blobLink', blobLink);
            if (blobLink) videoDaXem.push(blobLink);
            else {
                await mouse.scrollRandom(page, 1, helper.randomFloat(800, 1200), 1);
                await helper.randomDelay(5, 10);
                continue;
            }
            // scroll tới video
            await page.evaluate(async (blobLink) => {
                try {
                    const video = document.querySelector(`video[src="${blobLink}"]`);
                    video?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                catch (e) {

                }
            }, (blobLink));
            await helper.randomDelay(5, 10);
            // like
            if (helper.randomInt(0, 100) < likePercent) {
                await page.evaluate(async (blobLink) => {
                    try {
                        const video = document.querySelector(`video[src="${blobLink}"]`);
                        const btn = video.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.querySelector('div[aria-label="Like"');
                        btn?.click();
                    }
                    catch (e) {

                    }
                }, (blobLink));
            }
            await helper.randomDelay(5, 10);
            // comment
            if (helper.randomInt(0, 100) < commentPercent) {
                await page.evaluate(async (blobLink) => {
                    try {
                        const video = document.querySelector(`video[src="${blobLink}"]`);
                        const btn = video.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.querySelector('div[aria-label="Leave a comment"');
                        btn?.click();
                    }
                    catch (e) {

                    }
                }, (blobLink));
            }
            await helper.randomDelay(5, 10);
            // share
            if (helper.randomInt(0, 100) < sharePercent) {
                await page.evaluate(async (blobLink) => {
                    try {
                        const video = document.querySelector(`video[src="${blobLink}"]`);
                        const btn = video.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.querySelector('div[aria-label="Send this to friends or post it on your profile."');
                        btn?.click();
                    }
                    catch (e) {

                    }
                }, (blobLink));
                await helper.delay(2);
                await page.evaluate(async () => {
                    try {
                        const btn = document.querySelector('div[aria-label="Share options"] div[data-visualcompletion="ignore-dynamic"] > div')
                        btn?.click();
                    }
                    catch (e) {

                    }
                });
            }
            await helper.randomDelay(10, 20);
        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại watchFacebook');
        return false;
    }
}
module.exports = watchFacebook;
