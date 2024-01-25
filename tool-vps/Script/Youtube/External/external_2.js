/*
    script external_2
    mô tả: buff view youtube 
    xem video trong web
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const youtubeCommon = require('../Common/youtubeCommon');
async function external_2({ browser, profileData, filePath, config }) {
    try {
        let { fileListIframe, fileLinkWebCanAddIframe } = config;
        let listIframe = await helper.parseFileWithDetermine(fileListIframe, "\r\n");
        let listWebCanAddIframe = await helper.parseFileWithDetermine(fileLinkWebCanAddIframe, "\r\n");

        const countVideoBuff = helper.randomInt(2, 3);
        let page;
        // mở random 1 web
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                let watched = await helper.parseLogWatchedVideo(filePath);
                if (!watched) watched = [];
                listIframe = listIframe.filter(o => !watched.includes(helper.getIdVideoFromEmbedLink(o))) 
                if (listIframe.length == 0) return true;
                page = await navigation.newTab(browser);
                let randomIndex = Math.floor(Math.random() * listWebCanAddIframe.length);
                const randomWeb = listWebCanAddIframe[randomIndex];
                page = await navigation.openUrl(page, randomWeb);
                await helper.delay(20);
                randomIndex = Math.floor(Math.random() * listIframe.length);
                const randomEmbedLink = listIframe[randomIndex];
                await page.evaluate((randomEmbedLink) => {
                    try {
                        document.body.innerHTML = randomEmbedLink + document.body.innerHTML;
                    }
                    catch (e){

                    }
                }, randomEmbedLink);
                const data = {
                    time: helper.randomFloat(300, 600),
                    like: undefined,
                    dislike: undefined,
                    sub: undefined
                };
                await helper.delay(data.time);
                const videoId = helper.getIdVideoFromEmbedLink(randomEmbedLink);
                if (videoId) helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${data?.time}|like-${data?.like}|dislike-${data?.dislike}|sub-${data?.sub}|date-${helper.getNowFormatDate()}`);
                await navigation.closeActiveTab(page);
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại external_2', filePath, e);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại external_2');
        return false;
    }
}
module.exports = external_2;
