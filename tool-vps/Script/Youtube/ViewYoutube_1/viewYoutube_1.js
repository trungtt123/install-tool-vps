/*
    script viewYoutube_1
    mô tả: nuôi xem youtube vào trang chủ youtube, tìm kiếm từ khóa với từ khóa bất kỳ trong file config, xem ngẫu nhiên video với thời gian ngẫu nhiên, ngẫu nhiên like, dislike (trong file config), xem ngẫu nhiên các video bên cột đề xuất
    random like, dislike, sub kênh
*/
const puppeteer = require('puppeteer');
const { openUrl, reload, newTab, closeActiveTab } = require('../../../Action/Navigation/navigation');
const { findActiveTab } = require('../../../Action/Helper/helper')
const { pressKey } = require('../../../Action/Keyboard/keyboard');
const { readAndDeleteLine } = require('../../../Action/Data/data');
const helper = require('../../../Action/Helper/helper');
const activateTabByDomain = require('../../../Action/Navigation/activeTabByDomain');
const { scrollRandom } = require('../../../Action/Mouse/mouse');
const viewVideo = require('../Common/viewVideo');
async function viewYoutube_1({browser, profileData, filePath, config}) {
    try {
        console.log(filePath);
        let { listKeyword } = config;
        if (!listKeyword) listKeyword = "";
        console.log('listKeyword tại viewYoutube_1: ', listKeyword);
        // kiểm tra xem file log đã tồn tại hay chưa, nếu chưa tạo file log 
        helper.createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
        // đọc log các video đã xem
        let watched = (await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt"))?.split('\n')?.filter(o => o !== '')?.map(o => o.split("|")[0]);
        console.log('watched', watched);
        let process = true;
        let page;
        page = await activateTabByDomain(browser, 'https://www.youtube.com/');
        if (page) page = await openUrl(page, 'https://www.youtube.com/');
        else page = await newTab(browser, 'https://www.youtube.com/');
        if (!page) {
            console.log('error tại vị trí open youtube');
            return false;
        }
        await helper.delay(10);
        await scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        await helper.delay(10);
        // let page = await findActiveTab(page);
        process = await page.evaluate(() => {
            const btnSearch = document.querySelector('#search-button-narrow')
            if (btnSearch) {
                btnSearch.click();
                return true;
            }
            return false;
        });
        // search từ khóa
        if (process)
            process = await pressKey(page, helper.getRandomPhrase(listKeyword));
        await helper.delay(3);
        process = await page.evaluate(() => {
            try {
                document.querySelector('#search-icon-legacy').click();
                return true;
            }
            catch (e) {
                return false;
            }
        })
        await helper.delay(10);
        // lướt tìm video
        await scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
        // xem 1 video bất kì, while đến khi chắc chắn tìm được 1 video (while đối đa 5 lần)
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
            for (let i = 0; i < 5; i++) {
                let videoId;
                try {
                    let links = document.querySelectorAll('a[href*="/watch?v="]#video-title');
                    const randomIndex = Math.floor(Math.random() * links.length);
                    const randomLink = links[randomIndex];
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
                catch (e) {
                    console.error(e);
                }
            }
            return {
                process: false
            };
        }, watched);
        // không tìm thấy video nào
        if (!findVideo.process) {
            console.log('Không tìm thấy video nào');
            return false;
        }
        let videoId = findVideo.videoId;
        /* code xem video */
        let dataViewVideo = await viewVideo({browser, page, filePath, config});
        // ghi log
        if (dataViewVideo)
            helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${dataViewVideo?.time}|like-${dataViewVideo?.like}|dislike-${dataViewVideo?.dislike}|sub-${dataViewVideo?.sub}|date-${helper.getNowFormatDate()}`);
        await scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(100, 300));
        await helper.delay(30);
        // đang có 1 video được xem
        console.log('dang co video duoc xem', process);
        if (process) {
            // xem 1 video bất kì bên cột đề xuất, while đến khi chắc chắn tìm được 1 video chưa xem (while đối đa 10 lần), xem liên tục 3-5 lần như vậy
            watched = (await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt"))?.split('\n')?.filter(o => o !== '')?.map(o => o.split("|")[0]);
            for (let i = 1; i <= helper.randomInt(3, 5); i++) {
                let nextVideo = await page.evaluate((watched) => {
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
                    for (let j = 0; j < 10; j++) {
                        let videoId;
                        try {
                            let links = document.querySelectorAll('a[href*="/watch?v="].yt-simple-endpoint.style-scope.ytd-compact-video-renderer');
                            const randomIndex = Math.floor(Math.random() * links.length);
                            const randomLink = links[randomIndex];
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
                        catch (e) {
                            console.error(e);
                        }
                    }
                    return {
                        process: false
                    };
                }, watched);
                // sang được video kế tiếp
                if (nextVideo.process) {
                    /* code xem video */
                    let videoId = nextVideo.videoId;
                    let dataViewVideo = await viewVideo({browser, page, filePath, config});
                    // ghi log
                    if (dataViewVideo)
                        helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${dataViewVideo?.time}|like-${dataViewVideo?.like}|dislike-${dataViewVideo?.dislike}|sub-${dataViewVideo?.sub}|date-${helper.getNowFormatDate()}`);
                    await scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(100, 300));
                }
            }
        }
        // trường hợp không chọn được video trong trang chủ
        else {

        }
        // random 30% đóng tab sau khi xem
        if (helper.randomFloat(0, 1) < 0.5) {
            await closeActiveTab(page);
        }
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewYoutube_1');
        return false;
    }
}
module.exports = viewYoutube_1;
