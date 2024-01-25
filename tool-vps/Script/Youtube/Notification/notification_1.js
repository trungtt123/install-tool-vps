/*
    script notification_1
    mô tả: buff view youtube 
    tìm kiếm channel theo từ khóa, sau đó xem 1-3 video chưa xem trong kênh
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const youtubeCommon = require('../Common/youtubeCommon');
async function notification_1({ browser, filePath, config }) {
    try {
        let { listLinkVideo } = config;
        listLinkVideo = listLinkVideo.split('\n');
        // tìm random 1-2 video
        const countVideoBuff = helper.randomInt(1, 2);
        let page;
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                // mở tab youtube
                page = await navigation.activateTabByDomain(browser, 'https://www.youtube.com/');
                if (page) page = await navigation.openUrl(page, 'https://www.youtube.com/');
                else page = await navigation.newTab(browser, 'https://www.youtube.com/');
                // check thông báo
                await page.evaluate(() => {
                    try {
                        document.querySelector('ytd-notification-topbar-button-renderer button').click()
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return false;
                });
                await helper.delay(10);
                let watched = await helper.parseLogWatchedVideo(filePath);
                let findVideo = await page.evaluate((watched) => {
                    function getIdVideoFromUrl(url) {
                        try {
                            return url.split('v=')[1].split('&')[0];
                        }
                        catch (e) {
                            console.error(e);
                            return '';
                        }
                    }
                    let videoId;
                    try {
                        let links = document.querySelectorAll('ytd-notification-renderer a[href*="/watch?v="]');
                        let linkVideoChuaXem = [];
                        for (let i = 0; i < links.length; i++) {
                            var link = links[i];
                            videoId = getIdVideoFromUrl(link?.href ? link?.href : "");
                            if (!watched.includes(videoId)) linkVideoChuaXem.push(link);
                        }
                        let randomIndex = Math.floor(Math.random() * linkVideoChuaXem.length);
                        linkVideoChuaXem[randomIndex].click();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return false;
                }, watched);
                if (!findVideo) break;
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'notification_1', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'notification_1', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'notification_1', page, filePath, config: newConfig });
                    }
                }
                await navigation.closeActiveTab(page);
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại notification_1', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại notification_1');
        return false;
    }
}
module.exports = notification_1;
