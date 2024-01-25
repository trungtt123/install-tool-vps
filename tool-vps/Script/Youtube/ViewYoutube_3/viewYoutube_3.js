/*
    script viewYoutube_3
    mô tả: nuôi xem youtube 
    1. vào google tìm kiếm tên kênh 
    2. nếu có kênh thì vào kênh luôn, nếu không bấm vào 1 video bất kì
    3. (nếu vào kênh luôn thì tìm xem 1 video bất kì trong tab trang chủ, hoặc tab video -> quay lại kênh) (lặp lại 3-5 lần)
       nếu ko vào kênh luôn thì xem video bất kì (20-50%) -> bấm vào kênh -> (xem 1 video bất kì trong kênh -> quay lại kênh) lặp lại 3-5 lần
    4. trong khi xem video, random like, sub kênh
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const config = require('./config');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const { scrollRandom } = require('../../../Action/Mouse/mouse');
const viewVideo = require('../Common/viewVideo');
async function viewYoutube_3({browser, profileData, filePath, config}) {
    try {
        console.log(filePath);
        let { listKeyword } = config;
        if (!listKeyword) listKeyword = "";
        console.log('listKeyword tại viewYoutube_3: ', listKeyword);
        // kiểm tra xem file log đã tồn tại hay chưa, nếu chưa tạo file log 
        helper.createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
        // đọc log các video đã xem
        let watched = (await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt"))?.split('\n')?.filter(o => o !== '')?.map(o => o.split("|")[0]);
        console.log('watched', watched);
        let process = true;
        let page;
        page = await activateTabByDomain(browser, 'https://www.google.com/');
        if (page) page = await openUrl(page, 'https://www.google.com/');
        else page = await newTab(browser, 'https://www.google.com/');
        if (!page) {
            console.log('error tại vị trí open google');
            return false;
        }
        await helper.delay(10);
        // let page = await findActiveTab(page);
        process = await page.evaluate(() => {
            const input = document.querySelector('input[name="q"], textarea[name="q"]');
            if (input) {
                input.focus();
                return true;
            }
            return false;
        });
        process = await pressKey(page, helper.getRandomPhrase(listKeyword));
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
        // đợi load
        await helper.delay(30);
        await scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        // tìm channel tại trang chủ
        let hasLinkChannel = await page.evaluate(() => {
            try {
                var linkChannel = document.querySelector('a[href^="https://www.youtube.com/user"]');
                if (!linkChannel) linkChannel = document.querySelector('a[href^="https://www.youtube.com/channel"]');
                if (linkChannel) {
                    linkChannel.click(); // click vào phần tử
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        // ko có channel tại trang chủ -> vào tab video tìm kiếm
        if (!hasLinkChannel) {
            // tìm tab video
            process = await page.evaluate(() => {
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
            await helper.delay(30);
            await scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
            hasLinkChannel = await page.evaluate(() => {
                try {
                    var linkChannel = document.querySelector('a[href^="https://www.youtube.com/user"]');
                    if (!linkChannel) linkChannel = document.querySelector('a[href^="https://www.youtube.com/channel"]');
                    if (!linkChannel) linkChannel = document.querySelector('a[href^="https://www.youtube.com/c"]');
                    if (!linkChannel) linkChannel = document.querySelector('a[href^="https://www.youtube.com/@"]');
                    if (linkChannel) {
                        linkChannel.click(); // click vào phần tử
                        return true;
                    }
                    return false;
                }
                catch (e) {
                    return false;
                }
            });
        }
        await helper.delay(30);
        console.log('hasLinkChannel', hasLinkChannel);
        let findVideo = {};
        // không tìm thấy link chanel -> xem 1 video bất kỳ
        if (!hasLinkChannel) {
            // xem bất kì 1 video, loop 3 lần tới khi tìm được video
            let maxQuery = 3;
            for (let i = 1; i <= maxQuery; i++) {
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
                    let listWatchedVideo = watched;
                    let videoId;
                    try {
                        const elements = document.querySelectorAll('a[href^="https://www.youtube.com/watch"]:not([class])');
                        const randomIndex = Math.floor(Math.random() * elements.length); // lấy chỉ mục ngẫu nhiên
                        const randomLink = elements[randomIndex]; // truy cập phần tử có chỉ mục ngẫu nhiên
                        videoId = getIdVideoFromUrl(randomLink?.href ? randomLink?.href : "");
                        if (listWatchedVideo.includes(videoId)) return {
                            process: false
                        };
                        if (randomLink) {
                            randomLink.click(); // click vào phần tử
                            return {
                                process: true,
                                videoId: videoId
                            };
                        }
                        return {
                            process: false
                        };
                    }
                    catch (e) {
                        return {
                            process: false
                        };
                    }
                }, watched);
                if (findVideo.process) break;
            }
            console.log('hasVideo', findVideo?.videoId);
            // nếu không tìm thấy link video youtube nào -> kết thúc viewYoutube_3
            if (!findVideo.process) return false;
        }
        // tìm thấy channel -> xem 1 video bất kì trong tab trang chủ hoặc video
        else {
            let randomGoTabVideo = helper.randomFloat(0, 1) < 0.5 ? true : false;
            if (randomGoTabVideo) {
                console.log('randomGoTabVideo', randomGoTabVideo)
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
            }
            await helper.delay(30);
            console.log('randomVideo')
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
                let listWatchedVideo = watched;
                let videoId;
                try {
                    let links = document.querySelectorAll('ytd-grid-video-renderer a#thumbnail[href^="/watch?v="]');
                    if (links.length === 0) links = document.querySelectorAll('ytd-thumbnail a#thumbnail[href^="/watch?v="]');
                    for (let i = 0; i < links.length; i++) {
                        var randomLink = links[i];
                        videoId = getIdVideoFromUrl(randomLink?.href ? randomLink?.href : "");
                        if (listWatchedVideo.includes(videoId)) continue;
                        else {
                            randomLink.click();
                            return {
                                process: true,
                                videoId: videoId
                            };
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
                return { process: false };
            }, watched);
            console.log('findVideo', findVideo);
        }
        if (!findVideo.process) {
            console.log('Không tìm thấy video nào viewYoutube_3');
            return false;
        }
        let videoId = findVideo.videoId;
        await helper.delay(30);
        /* code xem video */
        let dataViewVideo = await viewVideo({browser, page, filePath, config});
        // ghi log
        if (dataViewVideo)
            helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${dataViewVideo?.time}|like-${dataViewVideo?.like}|dislike-${dataViewVideo?.dislike}|sub-${dataViewVideo?.sub}|date-${helper.getNowFormatDate()}`);
        // vào channel -> tiếp tục xem ngẫu nhiên video 2-5 video nữa
        for (let i = 1; i <= helper.randomInt(2, 5); i++) {
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
            await helper.delay(30);
            if (goChannel) {
                watched = (await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt"))?.split('\n')?.filter(o => o !== '')?.map(o => o.split("|")[0]);
                let randomGoTabVideo = helper.randomFloat(0, 1) < 0.5 ? true : false;
                // vào tab video
                if (randomGoTabVideo) {
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
                    await helper.delay(30);
                }
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
                    let listWatchedVideo = watched;
                    let videoId;
                    try {
                        let links = document.querySelectorAll('ytd-grid-video-renderer a#thumbnail[href^="/watch?v="]');
                        if (links.length === 0) links = document.querySelectorAll('ytd-thumbnail a#thumbnail[href^="/watch?v="]');
                        for (let i = 0; i < links.length; i++) {
                            var randomLink = links[i];
                            videoId = getIdVideoFromUrl(randomLink?.href ? randomLink?.href : "");
                            if (listWatchedVideo.includes(videoId)) continue;
                            else {
                                randomLink.click();
                                return {
                                    process: true,
                                    videoId: videoId
                                };
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return { process: false };
                }, watched);
                if (!findVideo.process) {
                    console.log('Không tìm thấy video nào viewYoutube_3');
                    return false;
                }
                let videoId = findVideo.videoId;
                await helper.delay(30);
                /* code xem video */
                let dataViewVideo = await viewVideo({browser, page, filePath, config});
                // ghi log
                if (dataViewVideo)
                    helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${dataViewVideo?.time}|like-${dataViewVideo?.like}|dislike-${dataViewVideo?.dislike}|sub-${dataViewVideo?.sub}|date-${helper.getNowFormatDate()}`);
                await scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(100, 300));
            }
        }
        // random 30% đóng tab sau khi xem
        if (helper.randomFloat(0, 1) < 0.5) {
            await closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewYoutube_3');
        return false;
    }
}
module.exports = viewYoutube_3;
