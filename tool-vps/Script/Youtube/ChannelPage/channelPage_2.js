/*
    script channelPage_2
    mô tả: buff view youtube 
    tìm kiếm channel theo từ khóa tại trang chủ youtube
*/
const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const youtubeCommon = require('../Common/youtubeCommon');
const mouse = require('../../../Action/Mouse/mouse');
async function channelPage_2({ browser, profileData, filePath, config }) {
    try {
        let { listChannelKeyword, listLinkChannel, pasteLinkChannel } = config;
        if (!pasteLinkChannel) pasteLinkChannel = 0;
        listLinkChannel = listLinkChannel.split('\n');
        console.log('listLinkChannel', listLinkChannel);
        let listChannelId = listLinkChannel.map(o => helper.getIdChannelFromUrl(o));
        console.log('listChannelId', listChannelId);
        // tìm random 1-2 channel
        const countChannelBuff = helper.randomInt(1, 2);
        let page;
        // tìm kiếm channel 1-2 lần
        for (let i = 1; i <= countChannelBuff; i++) {
            try {
                // mở tab youtube
                page = await navigation.newTab(browser);
                page = await navigation.openUrl(page, 'https://www.youtube.com/');
                await helper.delay(10);
                let timThayChannel = false;
                //scroll để tìm video cần buff
                await mouse.scrollRandom(page, helper.randomInt(8, 10), helper.randomFloat(250, 400));
                // tìm xem có channel cần tìm trong trang chủ không
                timThayChannel = await page.evaluate((listChannelId) => {
                    try {
                        let query = '';
                        for (let i = 0; i < listChannelId.length; i++) {
                            query += `a[href*="${listChannelId[i]}"][id="avatar-link"], a[href*="${listChannelId[i]}"]`;
                            if (i < listChannelId.length - 1) query += ', ';
                        }
                        let listChannelTimThay = document.querySelectorAll(query);
                        console.log('query', query);
                        // random click 1 channel
                        let randomIndex = Math.floor(Math.random() * listChannelTimThay.length);
                        listChannelTimThay[randomIndex].click();
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                }, listChannelId);

                // chưa tìm được channel trong trang chủ -> nhập keyword channelvào ô search để tìm
                if (!timThayChannel) {
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
                    await keyboard.pressKey(page, (helper.shuffleAndSelectWords(helper.getRandomPhrase(listChannelKeyword, "|"))).toLowerCase());
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
                    timThayChannel = await page.evaluate((listChannelId) => {
                        function getIdChannelFromUrl(url) {
                            try {
                                let arr = url.split('/');
                                return arr[arr.length - 1];
                            }
                            catch (e) {
                                console.error(e);
                                return '';
                            }
                        }
                        try {
                            let links = document.querySelectorAll('a[href]');
                            links = Array.from(links).filter(link => listChannelId.includes(getIdChannelFromUrl(link?.href)));
                            const randomIndex = Math.floor(Math.random() * links.length);
                            const randomLink = links[randomIndex];
                            randomLink.click();
                            return true;

                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }

                    }, listChannelId);
                }
                // chưa tìm thấy channel, nhấn vào các channel đã sub
                if (!timThayChannel) {
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
                    })
                    await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                    timThayChannel = await page.evaluate((listChannelId) => {
                        console.log('listChannelId', listChannelId);
                        function getIdChannelFromUrl(url) {
                            try {
                                let arr = url.split('/');
                                return arr[arr.length - 1];
                            }
                            catch (e) {
                                console.error(e);
                                return '';
                            }
                        }
                        try {
                            let links = document.querySelectorAll('ytd-browse[role="main"] a[href]');
                            if (links.length === 0) links = document.querySelectorAll('a[href]');
                            links = Array.from(links).filter(link => listChannelId.includes(getIdChannelFromUrl(link?.href)));
                            const randomIndex = Math.floor(Math.random() * links.length);
                            const randomLink = links[randomIndex];
                            randomLink.click();
                            return true;
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    }, listChannelId);
                }
                // chưa tìm thấy channel, nhấn vào history
                if (!timThayChannel) {
                    // click vào nút kênh đã sub
                    await page.evaluate(() => {
                        try {
                            document.querySelector('a#endpoint[href*="/feed/you"]')?.click();
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
                    timThayChannel = await page.evaluate((listChannelId) => {
                        console.log('listChannelId', listChannelId);
                        function getIdChannelFromUrl(url) {
                            try {
                                let arr = url.split('/');
                                return arr[arr.length - 1];
                            }
                            catch (e) {
                                console.error(e);
                                return '';
                            }
                        }
                        try {
                            let links = document.querySelectorAll('ytd-browse[role="main"] a[href]');
                            if (links.length === 0) links = document.querySelectorAll('a[href]');
                            links = Array.from(links).filter(link => listChannelId.includes(getIdChannelFromUrl(link?.href)));
                            const randomIndex = Math.floor(Math.random() * links.length);
                            const randomLink = links[randomIndex];
                            randomLink.click();
                            return true;
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    }, listChannelId);
                }
                if (!timThayChannel) {
                    if (helper.randomFloat(0, 100) < pasteLinkChannel) {
                        // random link channel
                        const randomIndex = Math.floor(Math.random() * listLinkChannel.length);
                        let linkChannel = listLinkChannel[randomIndex]
                        await navigation.openUrl(page, linkChannel);
                        timThayChannel = true;
                    }
                }
                // vào đc 1 channel bất kỳ, xem 1-3 video chưa xem trong channel, hoặc video đề xuất (nếu có)
                if (timThayChannel) {
                    for (let countVideo = 1; countVideo <= helper.randomInt(1, 3); countVideo++) {
                        await helper.delay(20);
                        // random tìm video trong trang chủ hoặc tab video hoặc cả 2
                        const optionTimTrongTab = helper.getRandomPhrase('0|1|2', '|');
                        let findVideo = false;
                        if (+optionTimTrongTab == 0 || +optionTimTrongTab == 2) {
                            //random scroll, click vào các button mũi tên trái, phải, để hiện thêm nhiều video
                            await youtubeCommon.randomScrollClickLeftRightButton(page, 10);
                            let watched = await helper.parseLogWatchedVideo(filePath);
                            findVideo = await page.evaluate((watched) => {
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
                                    let links = document.querySelectorAll('ytd-browse[role="main"] ytd-grid-video-renderer a#thumbnail[href^="/watch?v="]');
                                    if (links.length === 0) links = document.querySelectorAll('ytd-browse[role="main"] ytd-thumbnail a#thumbnail[href^="/watch?v="]');
                                    if (links.length === 0) links = document.querySelectorAll('a[href*="/watch?v="]');

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
                        }
                        // vào tab video tìm kiếm video
                        if (+optionTimTrongTab == 1 || +optionTimTrongTab == 2) {
                            // vào tab video
                            await page.evaluate(() => {
                                for (let j = 0; j < 5; j++) {
                                    try {
                                        let tabs = document.querySelectorAll('tp-yt-paper-tab');
                                        const randomLink = tabs[1];
                                        randomLink.click();
                                        return true;
                                    }
                                    catch (e) {
                                        console.error(e);
                                    }
                                }
                                return false;
                            });
                            await helper.delay(20);
                            let watched = await helper.parseLogWatchedVideo(filePath);
                            // loop đến khi tìm được video chưa xem, loop tối đa 5 lần
                            const maxLoop = 5;
                            for (let iLoop = 1; iLoop <= maxLoop; iLoop++) {
                                // random scroll xuống
                                await mouse.scrollRandom(page, helper.randomInt(3, 5), helper.randomFloat(250, 400), 0.9);
                                findVideo = await page.evaluate((watched) => {
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
                                        let links = document.querySelectorAll('ytd-browse[role="main"] ytd-grid-video-renderer a#thumbnail[href^="/watch?v="]');
                                        if (links.length === 0) links = document.querySelectorAll('ytd-browse[role="main"] ytd-thumbnail a#thumbnail[href^="/watch?v="]');
                                        if (links.length === 0) links = document.querySelectorAll('a[href*="/watch?v="]');

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
                                if (findVideo) break;
                            }
                        }
                        console.log('findVideo', findVideo);
                        if (!findVideo) continue;

                        let viewVideoData = await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'channelPage_2', page, filePath, config });
                        // chỉ xem video endscreen 1 lần, nếu xem được video đề xuất thì ko xem video endscreen sau đó
                        let newConfig = config;
                        newConfig['viewEndScreenPercent'] = 0;
                        if (viewVideoData.viewVideoEndScreen) {
                            await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'channelPage_2', page, filePath, config: newConfig });
                        }
                        else {
                            let videoDeXuat = await youtubeCommon.findSuggestVideo({ page, filePath, config });
                            if (videoDeXuat) {
                                await youtubeCommon.viewVideo({ browser, profileData, scriptId: 'channelPage_2', page, filePath, config: newConfig });
                            }// không có or không xem video đề xuất -> quay lại channel
                            else {
                                let goChannel = await page.evaluate(() => {
                                    try {
                                        document.querySelector('#above-the-fold #top-row #owner #upload-info #text-container a').click();
                                        return true;
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return false;
                                    }
                                });
                                if (!goChannel) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.log('Buff view gặp lỗi tại channelPage_2', filePath, e);
            } 
            finally {
                await navigation.closeActiveTab(page);
            }
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại channelPage_2');
        return false;
    }
}
module.exports = channelPage_2;
