/*
    script youtubeSearch_1
    mô tả: buff view youtube 
    tìm kiếm video theo từ khóa tại google
*/
const helper = require('../../../Action/Helper/helper');
const navigation = require('../../../Action/Navigation/navigation');
const mouse = require('../../../Action/Mouse/mouse');
const keyboard = require('../../../Action/Keyboard/keyboard');
const youtubeCommon = require('../Common/youtubeCommon');
async function youtubeSearch_1({ browser, profileData, filePath, config }) {
    try {
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
                // mở tab google
                page = await navigation.newTab(browser);
                page = await navigation.openUrl(page, 'https://www.google.com/');
                await helper.delay(10);
                // click vào nút tìm kiếm của google
                await page.evaluate(() => {
                    const input = document.querySelector('input[name="q"], textarea[name="q"]');
                    if (input) {
                        input.focus();
                        return true;
                    }
                    return false;
                });
                // nhập từ khóa tìm kiếm
                await keyboard.pressKey(page, (helper.shuffleAndSelectWords(helper.getRandomPhrase(listVideoKeyword, "|"))).toLowerCase());
                let clickSearch = await page.evaluate(() => {
                    try {
                        document.querySelector('input[type=submit]').click();
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                });
                if (!clickSearch) await page.keyboard.press("Enter");
                await helper.delay(20);
                await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                // tìm các link video tại tab all
                let timThayVideo = await page.evaluate((listVideoIdBuff) => {
                    try {
                        let query = '';
                        for (let i = 0; i < listVideoIdBuff.length; i++) {
                            query += `a[href*="${listVideoIdBuff[i]}"]`;
                            if (i < listVideoIdBuff.length - 1) query += ', ';
                        }
                        console.log('query', query);
                        let listVideoTimThay = document.querySelectorAll(query);
                        listVideoTimThay = Array.from(listVideoTimThay).filter(o => {
                            const bound = o.getBoundingClientRect();
                            return bound.width * bound.height !== 0;
                        })
                        let data = [];
                        data = data.concat(listVideoTimThay);
                        for (const item of listVideoTimThay) {
                            try {
                                const newItem = item.parentElement.querySelector('a');
                                if (newItem) data.push(newItem);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        // random click 1 video
                        let randomIndex = Math.floor(Math.random() * data.length);
                        data[randomIndex].click();
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                }, listVideoIdBuff);
                // không tìm thấy video ở tab tất cả -> sang tab video
                if (!timThayVideo) {
                    // sang tab video
                    await page.evaluate(() => {
                        try {
                            let tabVideo = document.querySelector('a[href^="/search"][href*="tbm=vid"]');
                            if (tabVideo) {
                                tabVideo.click();
                                return true;
                            }
                            return false;
                        }
                        catch (e) {
                            return false;
                        }
                    });
                    await helper.delay(20);
                    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                    timThayVideo = await page.evaluate((listVideoIdBuff) => {
                        try {
                            let query = '';
                            for (let i = 0; i < listVideoIdBuff.length; i++) {
                                query += `a[href*="${listVideoIdBuff[i]}"]`;
                                if (i < listVideoIdBuff.length - 1) query += ', ';
                            }
                            console.log('query', query);
                            let listVideoTimThay = document.querySelectorAll(query);
                            listVideoTimThay = Array.from(listVideoTimThay).filter(o => {
                                const bound = o.getBoundingClientRect();
                                return bound.width * bound.height !== 0;
                            })
                            let data = [];
                            data = data.concat(listVideoTimThay);
                            for (const item of listVideoTimThay) {
                                try {
                                    const newItem = item.parentElement.querySelector('a');
                                    if (newItem) data.push(newItem);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            // random click 1 video
                            let randomIndex = Math.floor(Math.random() * data.length);
                            data[randomIndex].click();
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    }, listVideoIdBuff);
                }
                if (!timThayVideo) {
                    console.log('Không tìm được video nào tại youtubeSearch_1', filePath);
                    continue;
                }
                /* code xem video */
                let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_1', page, filePath, config });
                // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                let newConfig = config;
                newConfig['viewEndScreenPercent'] = 0;
                if (viewVideoData.viewVideoEndScreen) {
                    await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_1', page, filePath, config: newConfig });
                }
                else {
                    let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                    if (videoDeXuat) {
                        await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'youtubeSearch_1', page, filePath, config: newConfig });
                    }
                }
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại youtubeSearch_1', filePath, e);
            }
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại youtubeSearch_1');
        return false;
    }
}
module.exports = youtubeSearch_1;
