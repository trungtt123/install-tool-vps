const youtubeSearch = require('./YoutubeSearch/youtubeSearch');
const channelPage = require('./ChannelPage/channelPage');
const directOrUnknown = require('./DirectOrUnknown/directOrUnknown');
const externalView = require('./External/externalView');
const playlist = require('./Playlist/playlist');
const notification = require('./Notification/notification');
const browseFeature = require('./BrowseFeature/browseFeature');
const reportVideo = require('./ReportVideo/reportVideo');
const viewYoutube_1 = require('./ViewYoutube_1/viewYoutube_1');
const viewYoutube_2 = require('./ViewYoutube_2/viewYoutube_2');
const viewYoutube_3 = require('./ViewYoutube_3/viewYoutube_3');
const viewYoutube_4 = require('./ViewYoutube_4/viewYoutube_4');
const createChannel = require('./CreateChannel/createChannel');

const helper = require('../../Action/Helper/helper');

async function buffViewYoutube({ browser, profileData, filePath, config }) {
    try {
        let { viewPercent } = config;
        let youtubeSearchPercent = viewPercent?.youtubeSearch;
        let browseFeaturePercent = viewPercent?.browseFeature;
        let channelPagePercent = viewPercent?.channelPage;
        let externalPercent = viewPercent?.external;
        let directOrUnknownPercent = viewPercent?.directOrUnknown;
        let playlistPercent = viewPercent?.playlist;
        let notificationPercent = viewPercent?.notification;

        console.log('youtubeSearch', youtubeSearchPercent);
        console.log('browseFeature', browseFeaturePercent);
        console.log('channelPage', channelPagePercent);
        console.log('externalView', externalPercent);
        console.log('directOrUnknown', directOrUnknownPercent);
        console.log('playlist', playlistPercent);
        console.log('notification', notificationPercent);

        // let randStr = "";
        // if (youtubeSearchPercent) randStr += "1|";
        // if (browseFeaturePercent) randStr += "2|";
        // if (channelPagePercent) randStr += "3|";
        // if (externalPercent) randStr += "4|";
        // if (directOrUnknownPercent) randStr += "5|";
        // if (notificationPercent) randStr += "7|";
        // if (randStr.endsWith("|")) {
        //     randStr = randStr.slice(0, -1);
        // }
        // console.log("randStr", randStr)


        // for (let i = 1; i <= helper.randomInt(2, 3); i++) {
        //     const rand = helper.getRandomPhrase(randStr);
        //     if (rand == "1") await youtubeSearch({ browser, profileData, filePath, config });
        //     else if (rand == "2") await browseFeature({ browser, profileData, filePath, config });
        //     else if (rand == "3") await channelPage({ browser, profileData, filePath, config });
        //     else if (rand == "4") await externalView({ browser, profileData, filePath, config });
        //     else if (rand == "5") await directOrUnknown({ browser, profileData, filePath, config });
        //     // else if (rand == "6") await playlist({ browser, profileData, filePath, config });
        //     else if (rand == "7") await notification({ browser, profileData, filePath, config });
        // }

        // let randomScript = helper.randomFloat(0, 100);
        // if (randomScript < youtubeSearchPercent) await youtubeSearch({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent)) await browseFeature({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent + channelPagePercent)) await channelPage({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent + channelPagePercent + externalPercent)) await externalView({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent + channelPagePercent + externalPercent + directOrUnknownPercent)) await directOrUnknown({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent + channelPagePercent + externalPercent + directOrUnknownPercent + playlistPercent)) await playlist({ browser, profileData, filePath, config });
        // else if (randomScript < (youtubeSearchPercent + browseFeaturePercent + channelPagePercent + externalPercent + directOrUnknownPercent + playlistPercent + notificationPercent)) await notification({ browser, profileData, filePath, config });

        if (helper.randomFloat(0, 100) < youtubeSearchPercent) await youtubeSearch({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < browseFeaturePercent) await browseFeature({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < channelPagePercent) await channelPage({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < externalPercent) await externalView({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < directOrUnknownPercent) await directOrUnknown({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < playlistPercent) await playlist({ browser, profileData, filePath, config });
        if (helper.randomFloat(0, 100) < notificationPercent) await notification({ browser, profileData, filePath, config });
        
    }
    catch (e) {
        console.error(e);
    }
}
const youtube = {
    buffViewYoutube,
    reportVideo,
    viewYoutube_1,
    viewYoutube_2,
    viewYoutube_3,
    viewYoutube_4,
    createChannel
}
module.exports = youtube;