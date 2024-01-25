/*
    script external_1
    mô tả: buff view youtube 
    xem video trong web
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const youtubeCommon = require('../Common/youtubeCommon');
async function external_1({ browser, profileData, filePath, config }) {
    try {
        let { listLinkVideo, listLinkWebEmbed } = config;
        listLinkVideo = listLinkVideo.split('\n');
        listLinkWebEmbed = listLinkWebEmbed.split('\n');
        // tìm random 1-2 video
        const countVideoBuff = helper.randomInt(1, 2);
        let page;
        const randomIndex = Math.floor(Math.random() * listLinkWebEmbed.length);
        const randomLink = listLinkWebEmbed[randomIndex];
        // mở random 1 web
        page = await navigation.newTab(browser, randomLink);
        await helper.delay(20);
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                await mouse.scrollRandom(page, helper.randomInt(3, 5), helper.randomFloat(250, 400), 0.6);
                let videoIdTrenWeb = await page.evaluate(() => {
                    try {
                        let arr = document.querySelectorAll('#content a[data-videoid]');
                        return Array.from(arr).map(o => o.getAttribute('data-videoid'));
                    }
                    catch (e) {
                        console.error(e);
                        return [];
                    }
                });
                console.log('videoIdTrenWeb', videoIdTrenWeb);
                let watched = await helper.parseLogWatchedVideo(filePath);
                if (!watched) watched = [];
                videoIdTrenWeb = videoIdTrenWeb.filter(o => !watched.includes(o));
                const randomIndex = Math.floor(Math.random() * videoIdTrenWeb.length);
                const randomIdVideo = videoIdTrenWeb[randomIndex];
                // tìm thẻ a có data-videoid = randomIdVideo và click vào xem video
                let dangXemVideo = await page.evaluate((randomIdVideo) => {
                    try {
                        document.querySelector(`#content a[data-videoid="${randomIdVideo}"]`).click();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                    }
                }, randomIdVideo);
                await helper.delay(20);
                let frame = page.frames().find(frame => frame.url().includes('https://www.youtube.com'));
                console.log('frame', frame)
                if (dangXemVideo) {
                    let xemVideoTrenWeb = false;//helper.randomInt(0, 1) < 1;
                    console.log('xemVideoTrenWeb', xemVideoTrenWeb);
                    if (xemVideoTrenWeb) await youtubeCommon.viewVideoInWeb({ page: frame, filePath, config, videoId: randomIdVideo })
                    else {
                        try {
                            await frame.$eval(`a[href*="/watch?v=${randomIdVideo}"]`, el => el.click())
                        }
                        catch (e) {
                            console.log(e)
                        }
                        await helper.delay(5);
                        let pageYoutube = await helper.getCurrentPageByUrl(browser, `https://www.youtube.com/watch?v=${randomIdVideo}`);

                        let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'external_1', page: pageYoutube, filePath, config });
                        // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                        let newConfig = config;
                        newConfig['viewEndScreenPercent'] = 0;
                        if (viewVideoData.viewVideoEndScreen) {
                            await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'external_1', page: pageYoutube, filePath, config: newConfig });
                        }
                        else {
                            let videoDeXuat = await youtubeCommon.findSuggestVideo({ page: pageYoutube, filePath, config });
                            if (videoDeXuat) {
                                await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'external_1', page: pageYoutube, filePath, config: newConfig });
                            }
                        }
                        await navigation.closeActiveTab(pageYoutube);
                    }
                }
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại external_1', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại external_1');
        return false;
    }
}
module.exports = external_1;
