/*
    script common viewVideo
*/
const helper = require('../../../Action/Helper/helper');
const keyboard = require('../../../Action/Keyboard/keyboard');
const mouse = require('../../../Action/Mouse/mouse');
const navigation = require('../../../Action/Navigation/navigation');
const Mail = require('../../../models/Mail');
const detailsReportVideo = require('./detailsReportVideo');

async function viewVideo({ browser, profileData, scriptId, page, filePath, config, cursor }) {
    let pageUrl = await page.url();
    let videoId = helper.getIdVideoFromUrl(pageUrl);
    let clickAdsPercent = config?.clickAdsPercent || 0;
    let viewEndScreenPercent = config?.viewPercent?.endScreen || 0;
    const fileComment = config?.fileComment;
    let onAdsWeb = false;
    let startVideo = true;
    let threadRun = true;
    let viewEndScreen = helper.randomFloat(0, 100) < viewEndScreenPercent;
    let viewVideoEndScreen;
    console.log('viewEndScreen', viewEndScreen);
    let currentYoutubePageIndex = await helper.getCurrentPageIndexByUrl(browser, await page.url());
    let listAds = [];
    async function checkAds({ page, config }) {
        try {
            while (threadRun) {
                if (!onAdsWeb) {
                    let haveAds = await page.evaluate(async () => {
                        try {
                            function delay(time) {
                                return new Promise(function (resolve) {
                                    setTimeout(resolve, time * 1000);
                                });
                            }
                            while (1) {
                                await delay(2);
                                console.log('checkAds');
                                let btnAds = document.querySelector('.ytp-flyout-cta-text-container') || document.querySelector('.ytp-ad-button.ytp-ad-visit-advertiser-button.ytp-ad-button-link');
                                if (btnAds) {
                                    return true;
                                }
                            }
                        }
                        catch (e) {
                            console.error(e);
                            return false;
                        }
                    });
                    // có click
                    if (haveAds) {
                        // có quảng cáo dừng hành động của video
                        startVideo = false;
                        // tỉ lệ click ads
                        if (helper.randomFloat(0, 100) < clickAdsPercent) {
                            // chờ quảng cáo chạy random 3-6s
                            await helper.delay(helper.randomFloat(3, 6));
                            let data = await page.evaluate(async (listAds) => {
                                function delay(time) {
                                    return new Promise(function (resolve) {
                                        setTimeout(resolve, time * 1000)
                                    });
                                }
                                try {
                                    let btnAds = document.querySelector('.ytp-flyout-cta-text-container') || document.querySelector('.ytp-ad-button.ytp-ad-visit-advertiser-button.ytp-ad-button-link');
                                    let spanAds = document.querySelector('.ytp-ad-button.ytp-ad-visit-advertiser-button.ytp-ad-button-link span');
                                    if (btnAds && spanAds) {
                                        // nếu quảng cáo này đã click thì không click lại
                                        if (!listAds.includes(spanAds.textContent)) {
                                            btnAds.click();
                                            return {
                                                onAdsWeb: true,
                                                startVideo: false,
                                                adsKey: spanAds.textContent
                                            };
                                        }
                                        // quảng cáo đã click thì sẽ bị pause, mở lại cho quảng cáo chạy để hiện nút bỏ qua
                                        else {
                                            let dataTitleNoToolTip = ['Play', 'Phát'];
                                            let query = '';
                                            for (let i = 0; i < dataTitleNoToolTip.length; i++) {
                                                query += `.ytp-chrome-bottom .ytp-left-controls button[aria-keyshortcuts="k"][data-title-no-tooltip="${dataTitleNoToolTip[i]}"]`;
                                                if (i < dataTitleNoToolTip.length - 1) query += ", ";
                                            }
                                            document.querySelector(query).click();
                                            // trong khi còn quảng cáo, đợi nút bỏ qua quảng cáo hoặc đợi cho đến khi nó tự hết
                                            while (document.querySelector('.ytp-flyout-cta-text-container') || document.querySelector('.ytp-ad-button.ytp-ad-visit-advertiser-button.ytp-ad-button-link')) {
                                                let btnSkip = document.querySelector('.ytp-ad-skip-button.ytp-button') || document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
                                                if (btnSkip) btnSkip.click();
                                                await delay(2);
                                            }
                                            return {
                                                onAdsWeb: false,
                                                startVideo: true
                                            }
                                        }
                                    }
                                    return {
                                        onAdsWeb: false,
                                        startVideo: true
                                    }
                                }
                                catch (e) {
                                    console.error(e);
                                    return {
                                        onAdsWeb: false,
                                        startVideo: true
                                    }
                                }
                            }, listAds);
                            onAdsWeb = data.onAdsWeb;
                            startVideo = data.startVideo;
                            if (data?.adsKey) listAds.push(data.adsKey);
                        }
                        // không click quảng cáo, đợi nút bỏ qua và click
                        else {
                            console.log('Đợi bỏ qua quảng cáo');
                            await page.evaluate(async () => {
                                function delay(time) {
                                    return new Promise(function (resolve) {
                                        setTimeout(resolve, time * 1000)
                                    });
                                }
                                try {
                                    // trong khi còn quảng cáo, đợi nút bỏ qua quảng cáo hoặc đợi cho đến khi nó tự hết
                                    while (document.querySelector('.ytp-flyout-cta-text-container') || document.querySelector('.ytp-ad-button.ytp-ad-visit-advertiser-button.ytp-ad-button-link')) {
                                        let btnSkip = document.querySelector('.ytp-ad-skip-button.ytp-button') || document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
                                        if (btnSkip) btnSkip.click();
                                        await delay(2);
                                    }
                                    return true;
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            });
                            // hết quảng cáo, start lại video
                            startVideo = true;
                        }
                    }
                }
                await helper.delay(2);
            }
        }
        catch (e) {
            console.log('Lỗi ở checkAds');
            startVideo = true;
            // console.error(e);
        }
    }
    async function actionAds({ browser, config }) {
        try {
            while (threadRun) {
                if (onAdsWeb) {
                    console.log('Đang ở web quảng cáo')
                    try {
                        // lấy page của tab quảng cáo
                        await helper.delay(10);
                        let page = await navigation.activateTabByIndex(browser, +currentYoutubePageIndex + 1);
                        await helper.delay(5);
                        await mouse.scrollRandom(page, helper.randomInt(5, 10), helper.randomFloat(250, 400));
                        await navigation.closeTabByIndex(browser, +currentYoutubePageIndex + 1);
                        onAdsWeb = false;
                    }
                    catch (e) {
                        console.error(e);
                        onAdsWeb = false;
                    }
                }
                await helper.delay(2);
            }
        }
        catch (e) {
            console.log('Lỗi ở action Ads');
            startVideo = true;
            // console.error(e);
        }
    }
    async function checkEndScreen({ page, config }) {
        try {
            while (threadRun) {
                viewVideoEndScreen = await page.evaluate(async () => {
                    try {
                        function delay(time) {
                            return new Promise(function (resolve) {
                                setTimeout(resolve, time * 1000);
                            });
                        }
                        while (1) {
                            await delay(2);
                            console.log('checkEndScreen');
                            let arr = document.querySelectorAll('.ytp-ce-element-show');
                            const randomIndex = Math.floor(Math.random() * arr.length);
                            const randomVideo = arr[randomIndex];
                            randomVideo.click();
                            return true;
                        }
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                if (viewVideoEndScreen) break;
                await helper.delay(2);
            }
        }
        catch (e) {
            console.log('Lỗi ở check end screen video');
        }
    }
    try {
        /* code xem video */
        let { likeVideo, subVideo, timeVideo, autoNextVideo, reportVideo, commentVideo } = config;
        //check tồn tại config cho video
        if (!likeVideo) likeVideo = {};
        if (!subVideo) subVideo = {};
        if (!timeVideo) timeVideo = {};
        if (!likeVideo?.like) likeVideo.like = 0;
        if (!likeVideo?.dislike) likeVideo.dislike = 0;
        if (!subVideo?.sub) subVideo.sub = 0;
        if (!timeVideo?.type) timeVideo.type = 'percent';
        if (!timeVideo?.min) timeVideo.min = 0;
        if (!timeVideo?.max) timeVideo.max = 0;
        if (!autoNextVideo) autoNextVideo = false;
        if (!reportVideo) reportVideo = {};
        if (!reportVideo.reportPercent) {
            reportVideo.reportPercent = 0;
        }
        else {
            if (!reportVideo.reportIndex) reportVideo.reportIndex = 9;
            if (!reportVideo.reasonIndex) reportVideo.reasonIndex = 5;
        }
        if (!reportVideo?.reportTimelinePercent) reportVideo.reportTimelinePercent = 0;

        console.log('likeVideo', likeVideo);
        console.log('commentVideo', commentVideo);
        console.log('subVideo', subVideo);
        console.log('reportVideo', reportVideo);
        console.log('timeVideo', timeVideo);
        console.log('autoNextVideo', autoNextVideo);
        console.log('Đang xem video');
        await helper.delay(5);
        checkAds({ browser, page, config });
        actionAds({ browser, config });
        if (viewEndScreen) checkEndScreen({ page, config });
        // on/off autoNextVideo
        while (1) {
            // không có quảng cáo thì mới click
            if (!onAdsWeb) {
                await page.evaluate((autoNextVideo) => {
                    try {
                        let currentAuto = document.querySelector('.ytp-chrome-bottom .ytp-right-controls button[data-tooltip-target-id="ytp-autonav-toggle-button"] .ytp-autonav-toggle-button').ariaChecked;
                        if (currentAuto === 'true') currentAuto = true;
                        else if (currentAuto === 'false') currentAuto = false;
                        if (currentAuto != autoNextVideo) document.querySelector('.ytp-chrome-bottom .ytp-right-controls button[data-tooltip-target-id="ytp-autonav-toggle-button"]').click();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                }, autoNextVideo);
                break;
            }
            await helper.delay(2);
        }
        //check xem video có đang bị pause không, nếu bị pause -> bật lên
        while (1) {
            // không có quảng cáo thì mới click
            if (!onAdsWeb) {
                await page.evaluate(() => {
                    try {
                        let dataTitleNoToolTip = ['Play', 'Phát'];
                        let query = '';
                        for (let i = 0; i < dataTitleNoToolTip.length; i++) {
                            query += `.ytp-chrome-bottom .ytp-left-controls button[aria-keyshortcuts="k"][data-title-no-tooltip="${dataTitleNoToolTip[i]}"]`;
                            if (i < dataTitleNoToolTip.length - 1) query += ", ";
                        }
                        document.querySelector(query).click();
                        return true;
                    }
                    catch (e) {
                        console.error(e);
                        return false;
                    }
                });
                break;
            }
            await helper.delay(2);
        }

        let textTimeVideo;
        let videoDuration;
        while (1) {
            // không có quảng cáo thì mới lấy giá trị của thời lượng video
            if (!onAdsWeb) {
                textTimeVideo = await page.evaluate(() => {
                    try {
                        const durationText = document.querySelector('.ytp-time-duration').textContent;
                        return durationText;
                    }
                    catch (e) {
                        console.error(e);
                        return 0;
                    }
                });
                break;
            }
            await helper.delay(2);
        }

        let timeCurrentVideo = 0;
        let randomTime = 1;
        /* setup các action khi xem video */
        // random xem video trong thời lượng video
        if (timeVideo.type === 'percent') {
            timeCurrentVideo = helper.convertTimeToSeconds(textTimeVideo);
            randomTime = (helper.randomFloat(timeVideo.min, timeVideo.max)) / 100;
        }
        // random xem video theo thời gian cố định
        else timeCurrentVideo = helper.randomFloat(timeVideo.min, timeVideo.max);
        console.log('timeCurrentVideo', timeCurrentVideo)
        // random like or dislike or none
        let isLike = helper.randomFloat(0, 100);
        if (isLike <= likeVideo.like) isLike = 'like';
        else if (isLike <= (likeVideo.like + likeVideo.dislike)) isLike = 'dislike';
        else isLike = '';
        // random report
        let isReport = helper.randomFloat(0, 100);
        if (isReport <= reportVideo.reportPercent) isReport = 'report';
        else isReport = '';

        let isReportTimeline = helper.randomFloat(0, 100);
        if (isReportTimeline <= reportVideo.reportTimelinePercent) isReportTimeline = true;
        else isReportTimeline = false;

        let isSub = helper.randomFloat(0, 100);
        if (isSub <= subVideo.sub) isSub = 'subscribe';
        else isSub = '';

        let isComment = helper.randomFloat(0, 100);
        if (isComment <= commentVideo.percent) isComment = 'comment';
        else isComment = '';

        const actions = [
            {
                action: 'delay',
                randomTime: 0
            },
            {
                action: isLike,
                randomTime: helper.randomFloat(0, randomTime),
            },
            {
                action: isComment,
                randomTime: helper.randomFloat(0, randomTime),
            },
            {
                action: isReport,
                randomTime: helper.randomFloat(0, randomTime),
            },
            {
                action: isSub,
                randomTime: helper.randomFloat(0, randomTime),
            },
            {
                action: 'delay',
                randomTime: randomTime
            }
        ]
        actions.sort(function (a, b) {
            return a.randomTime - b.randomTime;
        });
        console.log('actions', JSON.stringify(actions));
        const logData = {
            timeView: {},
            like: {},
            dislike: {},
            subscribe: {},
            report: {}
        }
        let data = {
            time: '#',
            like: '#',
            dislike: '#',
            sub: '#',
            report: "#"
        };
        data.time = randomTime * timeCurrentVideo;
        logData.timeView = {
            time: randomTime * timeCurrentVideo
        }
        let i = 1;
        while (i < actions.length) {
            const beforeItem = actions[i - 1];
            const item = actions[i];
            // CHECK TAB TO UNMUTE
            await page.evaluate(() => {
                try {
                    let btn = document.querySelector('.ytp-unmute-icon')
                    if (btn) {
                        btn.click();
                        return true;
                    }
                    return false;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            });
            await helper.delay(2);
            // check chất lượng video
            // await page.evaluate(() => {
            //     try {
            //         const btn = document.querySelector('button[data-tooltip-target-id="ytp-settings-button"]') || document.querySelector('button[aria-label="Playback Settings"]');
            //         if (btn) {
            //             btn.click();
            //             return true;
            //         }
            //         return false;
            //     }
            //     catch (e) {
            //         console.error(e);
            //         return false;
            //     }
            // });
            // await helper.delay(2);
            // try {
            //     let random = Math.floor(Math.random() * 2) + 1;
            //     if (random === 1) (await page.$$('select'))[1].select("tiny");
            //     else (await page.$$('select'))[1].select("tiny");
            //     await helper.delay(5);
            //     await page.evaluate(() => {
            //         try {
            //             document.querySelector('.dialog-buttons button').click();
            //             return true;
            //         }
            //         catch (e) {
            //             console.error(e);
            //             return false;
            //         }
            //     });
            // }
            // catch (e) {
            //     console.error(e);
            // }

            // await page.evaluate(() => {
            //     try {
            //         const arr = document.querySelectorAll('.ytp-popup.ytp-settings-menu .ytp-menuitem');
            //         for (const item of arr) {
            //             if (item?.textContent?.trim()?.includes("Quality")) {
            //                 if (!item?.textContent?.trim()?.includes("144")) item.click();
            //                 return true;
            //             }
            //         }
            //         return true;
            //     }
            //     catch (e) {
            //         console.error(e);
            //         return false;
            //     }
            // });
            // await helper.delay(2);
            // await page.evaluate(() => {
            //     try {
            //         let arr = document.querySelectorAll('.ytp-panel.ytp-quality-menu .ytp-panel-menu .ytp-menuitem');
            //         let random = Math.floor(Math.random() * 2) + 1;

            //         if (random === 1) {
            //             if (arr.length >= 2) {
            //                 arr[arr.length - 2]?.click();
            //             }
            //         }
            //         else {
            //             if (arr.length >= 2) {
            //                 arr[arr.length - 2]?.click();
            //             }
            //         }
            //         return true;
            //     }
            //     catch (e) {
            //         console.error(e);
            //         return false;
            //     }
            // });
            // await helper.delay(2);
            while (1) {
                if (startVideo) {
                    console.log('delay', (item.randomTime - beforeItem.randomTime) * timeCurrentVideo);
                    await helper.delay((item.randomTime - beforeItem.randomTime) * timeCurrentVideo);
                    if (!startVideo) i--;
                    switch (item.action) {
                        //xử lý like
                        case 'like':
                            data.like = item.randomTime * timeCurrentVideo;
                            const actionLike = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('#segmented-like-button button[aria-pressed="false"]') || document.querySelector('ytm-toggle-button-renderer.animated-like-toggle-button button[aria-pressed="false"]')
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            if (actionLike) logData.like = {
                                time: item.randomTime * timeCurrentVideo
                            }
                            break;
                        case 'comment':
                            data.like = item.randomTime * timeCurrentVideo;
                            await mouse.scrollRandom(page, helper.randomInt(2, 3), helper.randomFloat(300, 400), 1);
                            // mở popup comment
                            await page.evaluate(() => {
                                try {
                                    document.querySelector('ytm-item-section-renderer[section-identifier="comments-entry-point"] button').click();
                                    return true;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(2);
                            await page.evaluate(() => {
                                try {
                                    document.querySelector('button.comment-simplebox-reply').click();

                                    return true;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(2);

                            let focusInputMobile = await page.evaluate(() => {
                                try {
                                    const input = document.querySelector('textarea.comment-simplebox-reply');
                                    input.focus();
                                    return true;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(2);
                            // reply tren pc
                            if (!focusInputMobile) {
                                await page.evaluate(() => {
                                    try {
                                        let arr = document.querySelectorAll('ytd-comment-action-buttons-renderer');
                                        const randomIndex = Math.floor(Math.random() * arr.length);
                                        const elm = arr[randomIndex];
                                        if (elm) {
                                            elm.querySelectorAll('button')[0].click();
                                            elm.querySelectorAll('button')[2].click();
                                        }
                                        return true;
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return false;
                                    }
                                });
                                await helper.delay(2);
                            }
                            let listComment = await helper.readFileAsync(fileComment);
                            const comment = helper.getRandomPhrase(listComment, "|");
                            await keyboard.pressKey(page, comment, 0.01, 0.1, 0);
                            if (!focusInputMobile) {
                                await page.keyboard.down('ControlLeft');
                                await page.keyboard.press('Enter');
                                await page.keyboard.up('ControlLeft')
                            }
                            else {
                                await page.evaluate(() => {
                                    try {
                                        document.querySelectorAll('.comment-simplebox-input button')[1].click();
                                        return true;
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return false;
                                    }
                                });
                            }
                            await helper.delay(10);
                            break;
                        case 'dislike':
                            data.dislike = item.randomTime * timeCurrentVideo;
                            const actionDislike = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('#segmented-dislike-button button[aria-pressed="false"]') || document.querySelector('ytm-toggle-button-renderer button[aria-label="Dislike this video"]')
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            if (actionDislike) logData.dislike = {
                                time: item.randomTime * timeCurrentVideo
                            }
                            break;
                        case 'report':
                            console.log('run report');
                            data.report = item.randomTime * timeCurrentVideo;
                            textTimeVideo = await page.evaluate(() => {
                                try {
                                    const durationText = document.querySelector('.ytp-time-duration').textContent;
                                    return durationText;
                                }
                                catch (e) {
                                    console.error(e);
                                    return 0;
                                }
                            });
                            videoDuration = helper.convertTimeToSeconds(textTimeVideo);
                            // kiểm tra xem có report bằng cách tua ko
                            let timelineRandom;
                            if (isReportTimeline) {
                                // tua
                                timelineRandom = helper.randomFloat(reportVideo.timelineStart, reportVideo.timelineEnd);
                                console.log('timelineRandom', timelineRandom);
                                console.log('videoDuration', videoDuration);
                                // tính tỉ lệ % trên thanh tua
                                let ratioForward = timelineRandom / videoDuration;
                                console.log('ratioForward', ratioForward);
                                // lấy tọa độ thanh thời gian
                                const bounding = await page.evaluate(() => {
                                    try {
                                        let b = document.querySelector('.ytp-progress-list').getBoundingClientRect();
                                        return {
                                            x: b.x,
                                            y: b.y,
                                            width: b.width,
                                            height: b.height
                                        };
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return null;
                                    }
                                });

                                console.log(bounding);
                                if (bounding && bounding.x) {
                                    let y = bounding.y;
                                    let x = bounding.x + bounding.width * ratioForward
                                    console.log(x, y);
                                    await page.mouse.click(x, y);
                                    await helper.delay(5);
                                }
                            }
                            // open popup
                            let actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('#above-the-fold #menu yt-button-shape#button-shape button');
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btns = document.querySelectorAll('#contentWrapper ytd-menu-popup-renderer tp-yt-paper-listbox ytd-menu-service-item-renderer yt-formatted-string');
                                    for (const btn of btns) {
                                        if (btn.textContent === 'Report' || btn.textContent === 'Báo vi phạm') {
                                            btn.click();
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(10);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelectorAll('yt-report-form-modal-renderer tp-yt-paper-radio-button')[8];
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelectorAll('yt-report-form-modal-renderer tp-yt-paper-radio-button')[8].nextElementSibling;
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelectorAll('yt-report-form-modal-renderer tp-yt-paper-radio-button')[8].nextElementSibling.querySelectorAll('tp-yt-iron-dropdown tp-yt-paper-item')[5];
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('yt-report-form-modal-renderer yt-button-renderer#submit-button button');
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            // nhập văn mẫu
                            actionReport = await page.evaluate(() => {
                                try {
                                    let input = document.querySelector("yt-report-details-form-renderer textarea");
                                    if (input) {
                                        input.focus();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(2);
                            await keyboard.pressKey(page, detailsReportVideo.getDetailsReport(), 0.1, 0.1, 0.2);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('yt-report-details-form-renderer #submit-button button');
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(10);
                            actionReport = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector("yt-fancy-dismissible-dialog-renderer #confirm-button");
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            if (actionReport) {
                                logData.report = {
                                    time: timelineRandom || item.randomTime * timeCurrentVideo
                                }
                            }
                            break;
                        case 'subscribe':
                            data.sub = item.randomTime * timeCurrentVideo;
                            let actionSubscribe = await page.evaluate(() => {
                                try {
                                    let btn = document.querySelector('#subscribe-button ytd-subscribe-button-renderer:not([subscribe-button-hidden]) button')
                                    if (btn) {
                                        btn.click();
                                        return true;
                                    }
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionSubscribe = await page.evaluate(() => {
                                try {
                                    document.querySelector('#notification-preference-button button').click();
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            await helper.delay(5);
                            actionSubscribe = await page.evaluate(() => {
                                try {
                                    document.querySelector('ytd-popup-container #contentWrapper ytd-menu-service-item-renderer').click()
                                    return false;
                                }
                                catch (e) {
                                    console.error(e);
                                    return false;
                                }
                            });
                            if (actionSubscribe) {
                                logData.subscribe = {
                                    time: item.randomTime * timeCurrentVideo
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                }
                await helper.delay(2);
            }
            i++;
        }
        threadRun = false;
        /* xóa log */
        if (config?.autoClearLog) {
            try {
                helper.createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
                console.log(filePath + "\\youtube-log\\watched-video-log.txt");
                let dataLog = await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt");
                let lines = dataLog?.trim()?.split('\n');
                let newLines = '';
                for (let line of lines) {
                    if (!line) continue;
                    let dateString = line?.split("|")[5]?.split("-")[1];
                    if (!helper.checkDateBeforeDays(dateString, config?.clearLogDateAgo)) {
                        newLines += line + "\n";
                    }
                }
                helper.overwriteFile(filePath + "\\youtube-log\\watched-video-log.txt", newLines?.trim() + "\n");
            }
            catch (e) {
                console.error(e);
            }
        }
        /* ghi log */
        if (videoId) {
            helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${data?.time}|like-${data?.like}|dislike-${data?.dislike}|sub-${data?.sub}|date-${helper.getNowFormatDate()}`);
        }
        // new version
        // const mailData = await Mail.findOne({ GPMProfileId: profileData.id });
        // let currentTimeVideo = await page.evaluate(() => {
        //     try {
        //         const durationText = document.querySelector('.ytp-time-current').textContent;
        //         return durationText;
        //     }
        //     catch (e) {
        //         console.error(e);
        //         return 0;
        //     }
        // });
        // logData.timeView = {
        //     time: helper.convertTimeToSeconds(currentTimeVideo)
        // }
        /*
        await YoutubeLogs.create({ 
            email: mailData?.email, 
            GPMGroupName: profileData.group_name, 
            scriptId: scriptId, 
            videoUrl: pageUrl,
            data: JSON.stringify(logData) });
        */
        /* code xem video */
        return {
            process: true,
            viewVideoEndScreen: viewVideoEndScreen
        };
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewVideo');
        return {
            process: false
        };
    }
}
module.exports = viewVideo;
