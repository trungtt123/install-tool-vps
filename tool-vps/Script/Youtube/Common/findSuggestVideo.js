const helper = require("../../../Action/Helper/helper");
const mouse = require("../../../Action/Mouse/mouse");

async function findSuggestVideo({ page, filePath, config }) {
    try {
        let { listChannelName, viewPercent } = config;
        console.log(viewPercent);
        if (helper.randomFloat(0, 100) > +viewPercent.suggest) return null;
        console.log('Tìm video đề xuất');
        listChannelName = listChannelName.trim().split("|");
        // nếu có video tại cột đề xuất thì sau khi xem xong video click vào xem
        await mouse.scrollRandom(page, helper.randomInt(8, 10), helper.randomFloat(250, 400), 0.9);
        let dataSuggestVideo = await page.evaluate((listChannelName) => {
            function getIdVideoFromUrl(url) {
                try {
                    return url.split('v=')[1].split('&')[0];
                }
                catch (e) {
                    console.error(e);
                    return '';
                }
            }
            try {
                let arr = document.querySelectorAll('ytd-watch-next-secondary-results-renderer #contents ytd-compact-video-renderer');
                if (arr.length === 0) arr = document.querySelectorAll('ytm-video-with-context-renderer .media-item-metadata');
                console.log('arr', arr);
                for (let node of arr) {
                    let channelName = node?.querySelector('#channel-name yt-formatted-string')?.textContent?.trim() || node?.querySelector('ytm-badge-and-byline-renderer .yt-core-attributed-string')?.textContent?.trim();
                    if (listChannelName.includes(channelName)) {
                        let link = node?.querySelector('a#thumbnail') || node?.querySelector('a[href*="/watch?v="]');
                        let videoId = getIdVideoFromUrl(link?.href);
                        if (videoId) link.click();
                        return {
                            videoId: videoId,
                            channelName: channelName
                        };
                    }
                }
                // có link trong comment
                let linkInComment = document.querySelectorAll('ytd-comment-renderer')[0]?.querySelector('#content-text a');
                if (!linkInComment) {
                    document.querySelector('ytm-item-section-renderer[section-identifier="comments-entry-point"] button')?.click();
                    linkInComment = document.querySelector('.comment-content a');
                }
                if (linkInComment) {
                    let videoId = getIdVideoFromUrl(linkInComment?.href);
                    linkInComment.click();
                    return {
                        videoId: videoId,
                        channelName: ''
                    }
                }
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        }, listChannelName);
        return dataSuggestVideo;
    }
    catch (e) {
        console.error(e);
    }
}
module.exports = findSuggestVideo;