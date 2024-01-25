/*
    script playlist_1
    mô tả: buff view youtube 
    tìm kiếm channel theo từ khóa, sau đó xem 1-3 video chưa xem trong kênh
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const youtubeCommon = require('../Common/youtubeCommon');
async function playlist_1({ browser, profileData, filePath, config }) {
    try {
        let { listLinkChannelPlaylist, listLinkChannel } = config;
        listLinkChannel = listLinkChannel.split('\n');
        listLinkChannelPlaylist = listLinkChannelPlaylist.split('\n');
        let listIdChannelBuff = listLinkChannel.map(o => helper.getIdChannelFromUrl(o));
        let listIdChannelPlaylist = listLinkChannelPlaylist.map(o => helper.getIdChannelFromUrl(o));
        console.log('listIdChannelPlaylist', listIdChannelPlaylist);
        console.log('listIdChannelBuff', listIdChannelBuff);
        // tìm random 1-2 video
        const countVideoBuff = helper.randomInt(1, 2);
        let page;
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                let watched = await helper.parseLogWatchedVideo(filePath);
                if (!watched) watched = [];
                // mở channel có playlist
                const randomIndex = Math.floor(Math.random() * listLinkChannelPlaylist.length);
                const randomLink = listLinkChannelPlaylist[randomIndex];
                page = await navigation.newTab(browser, randomLink);
                await mouse.scrollRandom(page, helper.randomInt(2, 3), helper.randomFloat(250, 400), 0.6);
                await helper.delay(20);
                let findVideo = await page.evaluate(async ({ watched, listIdChannelBuff }) => {
                    function getIdVideoFromUrl(url) {
                        try {
                            return url.split('v=')[1].split('&')[0];
                        }
                        catch (e) {
                            console.error(e);
                            return '';
                        }
                    }
                    function delay(time) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, time * 1000)
                        });
                    }
                    try {
                        let query = '';
                        for (let index in listIdChannelBuff) {
                            query += `a[href*="${listIdChannelBuff[index]}"]`;
                            if (index < listIdChannelBuff.length - 1) query += ", ";
                        }
                        console.log('query', query);
                        let arr = document.querySelectorAll(query);
                        console.log(arr);
                        // lấy danh sách các arrow-right button của playlist
                        let rightBtns = [];
                        let containers = [];
                        for (let aTag of arr) {
                            let el = aTag;
                            while (el && el.tagName !== "YT-HORIZONTAL-LIST-RENDERER") {
                                el = el.parentElement
                            }
                            if (el) {
                                if (!containers.includes(el)) {
                                    containers.push(el);
                                }
                                let btn = el.querySelector('#right-arrow button');
                                if (!rightBtns.includes(btn)) {
                                    rightBtns.push(btn);
                                }
                            }
                        }
                        console.log('containers', containers);
                        console.log('rightBtns', rightBtns);
                        for (let index in containers) {
                            let container = containers[index];
                            console.log(container);
                            for (let i = 1; i <= 10; i++) {
                                let listATag = container.querySelectorAll('ytd-grid-video-renderer a#thumbnail');
                                let listVideoChuaXem = Array.from(listATag).filter(o => !watched.includes(getIdVideoFromUrl(o?.href)));
                                if (listVideoChuaXem.length === 0) rightBtns[index].click();
                                await delay(5);
                                const randomIndex = Math.floor(Math.random() * listVideoChuaXem.length);
                                const randomLink = listVideoChuaXem[randomIndex];
                                randomLink.click();
                                return true;
                            }
                        }
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return false;
                }, { watched, listIdChannelBuff });
                if (!findVideo) continue;
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'playlist_1', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'playlist_1', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'playlist_1', page, filePath, config: newConfig });
                    }
                }
                await navigation.closeActiveTab(page);
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại playlist_1', filePath, e);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại playlist_1');
        return false;
    }
}
module.exports = playlist_1;
