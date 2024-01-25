/*
    script common viewVideo
*/
const helper = require('../../../Action/Helper/helper');
const mouse = require('../../../Action/Mouse/mouse');
const navigation = require('../../../Action/Navigation/navigation');

async function viewVideoInWeb({ page, profileData, filePath, config, videoId }) {
    try {
        /* code xem video */
        let { likeVideo, subVideo, timeVideo, autoNextVideo } = config;
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
        console.log('likeVideo', likeVideo);
        console.log('subVideo', subVideo);
        console.log('timeVideo', timeVideo);
        console.log('autoNextVideo', autoNextVideo);
        console.log('Đang xem video');
        await helper.delay(5);
        // on/off autoNextVideo
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

        await page.evaluate(() => {
            try {
                let dataTitleNoToolTip = ['Pause', 'Tạm dừng'];
                let query = '';
                for (let i = 0; i < dataTitleNoToolTip.length; i++) {
                    query += `.ytp-chrome-bottom .ytp-left-controls button[aria-keyshortcuts="k"][data-title-no-tooltip="${dataTitleNoToolTip[i]}"]`;
                    if (i < dataTitleNoToolTip.length - 1) query += ", ";
                }
                // nếu có btnPause thì ko cần ấn nút start (lỗi web khi vào xem video lần đầu luôn bị pause)
                let btnPause = document.querySelector(query);
                if (!btnPause){
                    dataTitleNoToolTip = ['Play', 'Phát'];
                    query = '';
                    for (let i = 0; i < dataTitleNoToolTip.length; i++) {
                        query += `button[aria-label="${dataTitleNoToolTip[i]}"]`;
                        if (i < dataTitleNoToolTip.length - 1) query += ", ";
                    }
                    document.querySelector(query).click();
                }
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
        let textTimeVideo;
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
        let isSub = helper.randomFloat(0, 100);
        if (isSub <= subVideo.sub) isSub = 'subscribe';
        // else if (isSub <= 0.6) isSub = 'subscribe';
        else isSub = '';

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
        let data = {
            time: '#',
            like: '#',
            dislike: '#',
            sub: '#'
        };
        data.time = randomTime * timeCurrentVideo;
        let i = 1;
        while (i < actions.length) {
            const beforeItem = actions[i - 1];
            const item = actions[i];
            console.log('delay', (item.randomTime - beforeItem.randomTime) * timeCurrentVideo);
            await helper.delay((item.randomTime - beforeItem.randomTime) * timeCurrentVideo);
            switch (item.action) {
                //xử lý like
                case 'like':
                    data.like = item.randomTime * timeCurrentVideo;
                    await page.evaluate(() => {
                        try {
                            let btn = document.querySelector('#segmented-like-button button[aria-pressed="false"]')
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
                    break;
                case 'dislike':
                    data.dislike = item.randomTime * timeCurrentVideo;
                    await page.evaluate(() => {
                        try {
                            let btn = document.querySelector('#segmented-dislike-button button[aria-pressed="false"]')
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
                    break;
                case 'subscribe':
                    data.sub = item.randomTime * timeCurrentVideo;
                    await page.evaluate(() => {
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
                    break;
                default:
                    break;
            }
            i++;
        }
        threadRun = false;
        helper.appendToLog(filePath + "\\youtube-log\\watched-video-log.txt", videoId + `|time-${data?.time}|like-${data?.like}|dislike-${data?.dislike}|sub-${data?.sub}|date-${helper.getNowFormatDate()}`);
        /* code xem video */
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại viewVideo');
        return false;
    }
}
module.exports = viewVideoInWeb;
