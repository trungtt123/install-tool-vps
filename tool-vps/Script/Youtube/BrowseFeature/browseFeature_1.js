/*
    script browseFeature_1
    mô tả: buff view youtube 
    tìm kiếm video theo từ khóa tại trang chủ youtube
*/
const navigation = require('../../../Action/Navigation/navigation');
const helper = require('../../../Action/Helper/helper');
const youtubeCommon = require('../Common/youtubeCommon');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const MobileDevice = require('../../../models/MobileDevice');
async function browseFeature_1({ browser, profileData, filePath, config }) {
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
                // tìm xem có video cần buff không
                let timThayVideo = false;
                await mouse.scrollRandom(page, helper.randomInt(8, 10), helper.randomFloat(250, 400));
                timThayVideo = await page.evaluate((listVideoIdBuff) => {
                    try {
                        let query = '';
                        for (let i = 0; i < listVideoIdBuff.length; i++) {
                            query += `a[href*="${listVideoIdBuff[i]}"] img`;
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
                // chưa tìm được video vào phần các kênh đã sub tìm video
            
                if (!timThayVideo) {
                    // click vào nút kênh đã sub
                    await page.evaluate(() => {
                        try {
                            document.querySelector('a#endpoint[href*="/feed/subscriptions"]')?.click();
                            document.querySelectorAll('ytm-pivot-bar-item-renderer span')[2]?.click();
                            return true;
                        }
                        catch (e) {
                            console.log(e);
                            return false;
                        }
                    });
                    await helper.delay(5);
                    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                    timThayVideo = await page.evaluate((listVideoIdBuff) => {
                        try {
                            let query = '';
                            for (let i = 0; i < listVideoIdBuff.length; i++) {
                                query += `a[href*="${listVideoIdBuff[i]}"] img`;
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
                // chưa tìm thấy channel, nhấn vào history
                if (!timThayVideo) {
                    // click vào nút kênh đã sub
                    await page.evaluate(() => {
                        try {
                            document.querySelector('a#endpoint[href*="/feed/you"]')?.click();
                            document.querySelectorAll('ytm-pivot-bar-item-renderer span')[3]?.click();
                            return true;
                        }
                        catch (e) {
                            console.log(e);
                            return false;
                        }
                    });
                    await helper.delay(5);
                    await page.evaluate(() => {
                        try {
                            document.querySelector('a[href*="/feed/history"]')?.click();
                            return true;
                        }
                        catch (e) {
                            console.log(e);
                            return false;
                        }
                    });
                    await helper.delay(5);
                    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                    timThayVideo = await page.evaluate((listVideoIdBuff) => {
                        try {
                            let query = '';
                            for (let i = 0; i < listVideoIdBuff.length; i++) {
                                query += `a[href*="${listVideoIdBuff[i]}"] img`;
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
                    console.log('Không tìm thấy video tại browseFeature_1');
                    continue;
                }
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'browseFeature_1', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'browseFeature_1', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'browseFeature_1', page, filePath, config: newConfig });
                    }
                }
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại browseFeature_1', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại browseFeature_1');
        return false;
    }
}
module.exports = browseFeature_1;
