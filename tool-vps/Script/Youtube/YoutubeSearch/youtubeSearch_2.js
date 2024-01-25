/*
    script youtubeSearch_2
    mô tả: buff view youtube 
    tìm kiếm video theo từ khóa tại trang chủ youtube
*/
const navigation = require('../../../Action/Navigation/navigation');
const helper = require('../../../Action/Helper/helper');
const youtubeCommon = require('../Common/youtubeCommon');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const MobileDevice = require('../../../models/MobileDevice');
async function youtubeSearch_2({ browser, profileData, filePath, config }) {
    try {
        const mobileDevice = await MobileDevice.findOne({ GPMProfileId: profileData.id });
        let { listVideoKeyword, listLinkVideo } = config;
        if (!listVideoKeyword) {
            console.log('Không có keyword tại youtubeSearch_1');
        }
        if (!listLinkVideo) {
            console.log('Không có linkVideo tại youtubeSearch_1');
        }
        console.log('listVideoKeyword', listVideoKeyword);
        listLinkVideo = listLinkVideo.trim().split("\n");
        // random số lượng video buff 1-3 video
        const countVideoBuff = helper.randomInt(1, Math.min(listLinkVideo.length, 3));
        console.log('Số lượng video buff: ', countVideoBuff);
        let page;
        for (let i = 1; i <= countVideoBuff; i++) {
            try {
                // lấy list video đã xem
                let watched = await helper.parseLogWatchedVideo(filePath);
                if (!watched) watched = [];
                const listVideoIdBuff = listLinkVideo.map(o => helper.getIdVideoFromUrl(o)).filter(o => !watched.includes(o));
                console.log('listVideoIdBuff', listVideoIdBuff);
                // mở tab youtube
                page = await navigation.newTab(browser);
                if (mobileDevice?.mobileMode) {
                    await page.setUserAgent(mobileDevice.userAgent);
                }
                page = await navigation.openUrl(page, 'https://www.youtube.com/');
                await helper.delay(10);

                //danh sách videoId cần buff
                console.log('listVideoIdBuff', listVideoIdBuff);
                //scroll để tìm video cần buff
                await mouse.scrollRandom(page, helper.randomInt(8, 10), helper.randomFloat(250, 400));
                // tìm xem có video cần buff không
                let timThayVideo = await page.evaluate((listVideoIdBuff) => {
                    try {
                        let query = '';
                        for (let i = 0; i < listVideoIdBuff.length; i++) {
                            query += `a[href*="${listVideoIdBuff[i]}"]#thumbnail img, a[href*="${listVideoIdBuff[i]}"].media-item-thumbnail-container img`;
                            if (i < listVideoIdBuff.length - 1) query += ', ';
                        }
                        let links = document.querySelectorAll(query);
                        const randomIndex = Math.floor(Math.random() * links.length);
                        const randomLink = links[randomIndex];
                        randomLink.click();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                }, listVideoIdBuff);
                console.log('timThayVideo', timThayVideo);
                // chưa tìm được video trong trang chủ -> nhập keyword vào ô search để tìm
                if (!timThayVideo) {
                    await page.evaluate(() => {
                        try {
                            document.querySelector('#search-button-narrow')?.click();
                            document.querySelectorAll('button[aria-label="Search YouTube"]')[0]?.click();
                            document.querySelectorAll('button[aria-label="Search YouTube"]')[1]?.click();
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    });
                    await helper.delay(2);
                    await keyboard.pressKey(page, (helper.shuffleAndSelectWords(helper.getRandomPhrase(listVideoKeyword, "|"))).toLowerCase());
                    await helper.delay(3);
                    await page.evaluate(() => {
                        try {
                            document.querySelector('#search-icon-legacy')?.click();
                            document.querySelectorAll('button[aria-label="Search YouTube"]')[0]?.click();
                            document.querySelectorAll('button[aria-label="Search YouTube"]')[1]?.click();
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    })
                    await helper.delay(20);
                    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                    // tìm video sau khi nhập từ khóa
                    timThayVideo = await page.evaluate((listVideoIdBuff) => {
                        try {
                            let query = '';
                            for (let i = 0; i < listVideoIdBuff.length; i++) {
                                query += `a[href*="${listVideoIdBuff[i]}"]#thumbnail img, a[href*="${listVideoIdBuff[i]}"].media-item-thumbnail-container img`;
                                if (i < listVideoIdBuff.length - 1) query += ', ';
                            }
                            let links = document.querySelectorAll(query);
                            const randomIndex = Math.floor(Math.random() * links.length);
                            const randomLink = links[randomIndex];
                            randomLink.click();
                            return true;

                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    }, listVideoIdBuff);
                }
                if (!timThayVideo) {
                    console.log('Không tìm thấy video tại youtubeSearch_2');
                    continue;
                }
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_2', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_2', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_2', page, filePath, config: newConfig });
                    }
                }
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại youtubeSearch_2', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại youtubeSearch_2');
        return false;
    }
}
module.exports = youtubeSearch_2;
