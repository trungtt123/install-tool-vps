/*
    script directOrUnknown_1
    mô tả: buff view youtube 
    tìm kiếm channel theo từ khóa, sau đó xem 1-3 video chưa xem trong kênh
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const youtubeCommon = require('../Common/youtubeCommon');
async function directOrUnknown_1({ browser, profileData, filePath, config }) {
    try {
        let { listLinkVideo } = config;
        listLinkVideo = listLinkVideo.split('\n');
        // tìm random 1-2 video
        const countVideoBuff = helper.randomInt(1, Math.min(2, listLinkVideo.length));
        let page;
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                let watched = await helper.parseLogWatchedVideo(filePath);
                if (!watched) watched = [];
                listLinkVideo = listLinkVideo.filter(o => !watched.includes(helper.getIdVideoFromUrl(o)));
                const randomIndex = Math.floor(Math.random() * listLinkVideo.length);
                const randomLink = listLinkVideo[randomIndex];
                if (!randomLink) continue;
                page = await navigation.newTab(browser);
                page = await navigation.openUrl(page, randomLink);
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'directOrUnknown_1', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'directOrUnknown_1', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'directOrUnknown_1', page, filePath, config: newConfig });
                    }
                }
                await navigation.closeActiveTab(page);
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại directOrUnknown_1', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại directOrUnknown_1');
        return false;
    }
}
module.exports = directOrUnknown_1;
