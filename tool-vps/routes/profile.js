const express = require('express');
const router = express.Router();
const helper = require('../Action/Helper/helper');
const mobile_devices = require('../Constant/mobile_devices');

const runLocalProfile = require('../Profile/runLocalProfile');
const amazon = require('../Script/Amazon/index');
const youtube = require('../Script/Youtube/index');
const mail = require('../Script/Mail/index');
const tiktok = require('../Script/Tiktok/index');
const twitter = require('../Script/Twitter/index');
const google = require('../Script/Google');
const facebook = require('../Script/Facebook/index');
const yahoo = require('../Script/Yahoo/index');
const another = require('../Script/Another/index');
const crypto = require('../Script/Crypto/index');
const spotify = require('../Script/Spotify/index');
const instagram = require('../Script/Instagram/index');
const command = require('./command');
const MobileDevice = require('../models/MobileDevice');
const dbLocal = require('../Database/database');
const moment = require('moment');

router.get('/get_list_profiles', async (req, res) => {
    try {
        const database = await dbLocal.getData();
        const profiles = database.profiles || [];
        return res.status(200).send({
            code: "1000",
            message: "OK",
            profiles: profiles
        });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.get('/create_profile', async (req, res) => {
    try {
        const quantity = +req.query.quantity || 1;
        const data = await command.create_chrome_profile(quantity);
        return res.status(200).send(data);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
})
router.get('/start_profile', async (req, res) => {
    try {
        const { profile_id } = req.query;
        const data = await command.start_chrome_profile(profile_id);
        return res.status(200).send(data);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
})
router.get('/stop_profile', async (req, res) => {
    try {
        const { profile_id } = req.query;
        const data = await command.stop_chrome_profile(profile_id);
        return res.status(200).send(data);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/add_mail_profile', async (req, res) => {
    try {
        const { profiles, listMail } = req.body;
        const inputMail = listMail.map(o => {
            try {
                let tmp = o?.split("|") || [];
                return {
                    email: tmp[0] || "",
                    password: tmp[1] || "",
                    recoverEmail: tmp[2] || "",
                    firstName: tmp[3] || "",
                    lastName: tmp[4] || "",
                    phone: tmp[5] || "",
                    birthDay: tmp[6] || "",
                    gender: tmp[7] || "",
                    homeAddress: tmp[8] || "",
                    workAddress: tmp[9] || ""
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        let database = await dbLocal.getData();
        let tmpProfiles = database?.profiles || [];
        for (const index in profiles) {
            const profile = tmpProfiles.find(o => o.id == profiles[index].id);
            if (!profile) continue;
            if (index > listMail.length - 1 && !listMail[index]) continue;
            const mail = {};
            mail.email = inputMail[index].email;
            mail.password = inputMail[index].password;
            mail.recoverEmail = inputMail[index].recoverEmail;
            mail.firstName = inputMail[index].firstName;
            mail.lastName = inputMail[index].lastName;
            mail.phone = inputMail[index].phone;
            mail.birthDay = inputMail[index].birthDay;
            mail.gender = inputMail[index].gender;
            mail.homeAddress = inputMail[index].homeAddress;
            mail.workAddress = inputMail[index].workAddress;
            profile["mail"] = mail;
        }
        database.profiles = tmpProfiles;
        await dbLocal.updateData(database);
        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/add_spotify_profile', async (req, res) => {
    try {
        const { profiles, listSpotify } = req.body;
        const inputSpotify = listSpotify.map(o => {
            try {
                let tmp = o?.split("|") || [];
                return {
                    email: tmp[0] || "",
                    password: tmp[1] || ""
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        // console.log('inputSpotify', inputSpotify);
        let database = await dbLocal.getData();
        let tmpProfiles = database?.profiles || [];
        for (const index in profiles) {
            const profile = tmpProfiles.find(o => o.id == profiles[index].id);
            if (!profile) continue;
            if (index > listSpotify.length - 1 && !listSpotify[index]) continue;
            const spotify = {};
            spotify.email = inputSpotify[index].email;
            spotify.password = inputSpotify[index].password;
            profile["spotify"] = spotify;
        }
        // console.log('database', database);
        database.profiles = tmpProfiles;
        await dbLocal.updateData(database);
        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/update_group', async (req, res) => {
    try {
        const { profileIds, groupId } = req.body;
        let database = await dbLocal.getData();
        let tmpProfiles = database?.profiles || [];
        for (const profileId of profileIds) {
            const profile = tmpProfiles.find(o => o.id.toString() == profileId.toString());
            if (!profile) continue;
            profile["groupId"] = groupId || "";
        }
        database.profiles = tmpProfiles;
        await dbLocal.updateData(database);
        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/add_proxy_profile', async (req, res) => {
    try {
        const { profiles, listProxy } = req.body;
        let database = await dbLocal.getData();
        let tmpProfiles = database?.profiles || [];

        for (const index in profiles) {
            const profile = tmpProfiles.find(o => o.id == profiles[index].id);
            if (!profile) continue;
            if (index > listProxy.length - 1 && !listProxy[index]) continue;
            profile["proxy"] = listProxy[index] === "null" ? null : listProxy[index];
        }

        database.profiles = tmpProfiles;
        await dbLocal.updateData(database);

        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
const runWithScript = async (browser, profileData, filePath, scriptId, config) => {
    try {
        switch (scriptId) {
            case 'loginMail_1':
                await mail.loginMail_1({ browser, profileData, filePath });
                break;
            case 'regGmail_1':
                await mail.regGmail_1({ browser, profileData, filePath, config });
                break;
            case 'regGmail_2':
                await mail.regGmail_2({ browser, profileData, filePath, config });
                break;
            case 'regGmail_3':
                await mail.regGmail_3({ browser, profileData, filePath, config });
                break;
            case 'complaintMail_1':
                await mail.complaintMail_1({ browser, profileData, filePath, config });
                break;
            case 'subMail_1':
                await mail.subMail_1({ browser, profileData, filePath, config });
                break;
            case 'sendMail_1':
                await mail.sendMail_1({ browser, profileData, filePath, config });
                break;
            case 'googleDrive_1':
                await google.googleDrive_1({ browser, profileData, filePath, config });
                break;
            case 'googleMap_1':
                await google.googleMap_1({ browser, profileData, filePath, config });
                break;
            case 'changePassword_1':
                await mail.changePassword_1({ browser, profileData, filePath, config });
                break;
            case 'buffYoutube':
                await youtube.buffViewYoutube({ browser, profileData, filePath, config });
                break;
            case 'createChannel':
                await youtube.createChannel({ browser, profileData, filePath, config });
                break;
            case 'viewYoutube_1':
                await youtube.viewYoutube_1({ browser, profileData, filePath, config });
                break;
            case 'viewYoutube_2':
                await youtube.viewYoutube_2({ browser, profileData, filePath, config });
                break;
            case 'viewYoutube_3':
                await youtube.viewYoutube_3({ browser, profileData, filePath, config });
                break;
            case 'viewYoutube_4':
                await youtube.viewYoutube_4({ browser, profileData, filePath, config });
                break;
            case 'googleSearch_1':
                await google.googleSearch_1({ browser, profileData, filePath, config });
                break;
            case 'googleNews_1':
                await google.googleNews_1({ browser, profileData, filePath, config });
                break;
            case 'googleTranslate_1':
                await google.googleTranslate_1({ browser, profileData, filePath, config });
                break;
            case 'viewAmazon_1':
                await amazon.viewAmazon_1({ browser, profileData, filePath, config });
                break;
            case 'viewTikTok_1':
                await tiktok.viewTikTok_1({ browser, profileData, filePath, config });
                break;
            case 'viewInstagram':
                await instagram.viewInstagram({ browser, profileData, config });
                break;
            case 'viewTwitter_1':
                await twitter.viewTwitter_1({ browser, profileData, filePath });
                break;
            case 'loginFacebook_1':
                await facebook.loginFacebook_1({ browser, profileData, filePath, config });
                break;
            case 'viewFacebook':
                await facebook.viewFacebook({ browser, profileData, config });
                break;
            case 'cosmicwire_1':
                await crypto.cosmicwire_1({ browser, filePath, config });
                break;
            case 'grvt':
                await crypto.grvt({ browser, filePath, config });
                break;
            case 'yahooSearch_1':
                await yahoo.yahooSearch_1({ browser, profileData, filePath, config });
                break;
            case 'spotifySignUp':
                await spotify.spotifySignUp({ browser, profileData, filePath, config });
                break;
            case 'spotifyLogin':
                await spotify.spotifyLogin({ browser, profileData, config });
                break;
            case 'spotifyListen':
                await spotify.listen({ browser, profileData, config });
                break;
            case 'buffMC':
                await another.buffMC({ browser, filePath, config });
                break;

            default:
                break;
        }
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
router.post('/start_profile_with_task', async (req, res) => {
    try {
        const { profiles, listTask, thread } = req.body;
        if (!listTask) {
            return res.status(400).send({
                code: "9999",
                message: "FAILED",
                reason: "Hãy nhập listTask"
            });
        }
        const database = await dbLocal.getData();
        const startProfile = async (i) => {
            let browser;
            try {
                const filePath = `${profiles[i].path}`;
                const profileData = database?.profiles?.find(o => o.id == profiles[i].id);
                let dataRunProfile = await command.start_chrome_profile(profiles[i].id);
                browser = await runLocalProfile(dataRunProfile.selenium_remote_debug_address);
                for await (const item of listTask) {
                    let run = true;
                    const currentTime = moment(item?.time, 'HH:mm');
                    while (run) {
                        try {
                            const today = moment();
                            if (currentTime.isBefore(today)) {
                                console.log('currentTime', currentTime);
                                console.log('listScripts', item?.listScripts);
                                const task = helper.deepCopy(item);
                                if (task.type === 'seq') {
                                    for (const script of task.listScripts) {
                                        const { scriptId, config } = script;
                                        await runWithScript(browser, profileData, filePath, scriptId, config)
                                    }
                                }
                                else if (task.type === 'random') {
                                    const arr = task.listScripts;
                                    while (arr.length > 0) {
                                        const randomIndex = Math.floor(Math.random() * arr.length);
                                        const script = arr[randomIndex];
                                        const { scriptId, config } = script;
                                        await runWithScript(browser, profileData, filePath, scriptId, config)
                                        arr.splice(randomIndex, 1);
                                    }
                                }
                                else if (task.type === 'randomOneIn') {
                                    const arr = task.listScripts;
                                    const randomIndex = Math.floor(Math.random() * arr.length);
                                    const script = arr[randomIndex];
                                    const { scriptId, config } = script;
                                    await runWithScript(browser, profileData, filePath, scriptId, config)
                                }
                                run = false;
                            }
                            helper.delay(2);

                        }
                        catch (e) {
                            run = false;
                        }
                    }

                }

            }
            catch (e) {
                console.log('Error', e);
            }
            await browser?.close();
            await command.stop_chrome_profile(profiles[i].id);
            return i;
        }
        let maxThread = Math.min(profiles.length, thread);
        let queueThread = [];
        let i = 0;
        res.status(200).send({
            code: "1000",
            message: "OK",
        });
        console.log('maxThread', maxThread);
        while (i < profiles.length) {
            if (queueThread.length < maxThread && !queueThread.includes(i)) {
                queueThread.push(i);
                startProfile(i).then((indexProfile) => {
                    const index = queueThread.indexOf(indexProfile);
                    if (index !== -1) {
                        queueThread.splice(index, 1);
                    }
                }).catch((indexProfile) => {
                    const index = queueThread.indexOf(indexProfile);
                    if (index !== -1) {
                        queueThread.splice(index, 1);
                    }
                });
                i++;
            }
            await helper.delay(2);
            console.log(i);
        }
        return;
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.get('/get_log', async (req, res) => {
    try {
        const { social, filePath } = req.query;
        let data;
        if (social === 'youtube') {
            helper.createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
            console.log(filePath + "\\youtube-log\\watched-video-log.txt");
            data = await helper.readFileAsync(filePath + '\\youtube-log\\watched-video-log.txt');
            data = data.split('\n').filter(o => o !== '').map(o => o.replace('\r', ''));
            let result = [];
            for (const log of data) {
                let items = log.split("|");
                let tmp = {};
                for (const index in items) {
                    if (index == 0) tmp['videoId'] = items[index];
                    else {
                        tmp[items[index].split('-')[0]] = items[index].split('-')[1];
                    }
                }
                result.push(tmp);
            }
            return res.status(200).send({
                code: "1000",
                message: "OK",
                data: {
                    videos: result
                }
            });
        }
        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    } catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/delete_log', async (req, res) => {
    try {
        const { social, type, listFilePath, dayAgo } = req.body;
        console.log(req.body);
        if (social === 'youtube') {
            if (type === 'view') {
                for (const filePath of listFilePath) {
                    try {
                        helper.createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
                        console.log(filePath + "\\youtube-log\\watched-video-log.txt");
                        let data = await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt");
                        let lines = data?.trim()?.split('\n');
                        let newLines = '';
                        for (let line of lines) {
                            if (!line) continue;
                            let dateString = line?.split("|")[5]?.split("-")[1];
                            if (!helper.checkDateBeforeDays(dateString, dayAgo)) {
                                newLines += line + "\n";
                            }
                        }
                        helper.overwriteFile(filePath + "\\youtube-log\\watched-video-log.txt", newLines?.trim())
                    }
                    catch (e) {

                    }
                }
                return res.status(200).send({
                    code: "1000",
                    message: "OK",
                });
            }
        }
        return res.status(200).send({
            code: "1000",
            message: "OK",
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/download_log_view_youtube', async (req, res) => {
    try {
        const { GPMGroupName, startDate, endDate } = req.body;
        console.log(startDate, endDate);
        // const data = await YoutubeLogs.find({
        //     GPMGroupName: GPMGroupName,
        //     createdAt: {
        //         $gte: startDate,
        //         $lte: endDate
        //     }
        // })

        return res.status(200).send({
            code: "1000",
            message: "OK",
            data: data
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/set_mobile_device', async (req, res) => {
    try {
        const { profileIds } = req.body;
        const promises = [];
        const data = mobile_devices;//.filter(o => o.system === "Android");
        for (const profileId of profileIds) {
            const promise = async () => {
                let randomIndex = Math.floor(Math.random() * data.length);
                const mobileDevice = data[randomIndex];
                randomIndex = Math.floor(Math.random() * mobileDevice.userAgent.length);
                const userAgent = mobileDevice.userAgent[randomIndex];
                const profile = await MobileDevice.findOne({ GPMProfileId: profileId });
                if (!profile) {
                    await MobileDevice.create({
                        GPMProfileId: profileId,
                        mobileDeviceName: mobileDevice.mobileDeviceName,
                        userAgent: userAgent
                    })
                }
                else {
                    if (!profile.mobileDeviceName) profile.mobileDeviceName = mobileDevice.mobileDeviceName;
                    if (!profile.userAgent) profile.userAgent = userAgent;
                    await profile.save();
                }

            }
            promises.push(promise());
        }
        await Promise.all(promises);
        return res.status(200).send({
            code: "1000",
            message: "OK"
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/delete_mobile_device', async (req, res) => {
    try {
        const { profileIds } = req.body;
        const promises = [];

        for (const profileId of profileIds) {
            const promise = async () => {
                const profile = await MobileDevice.findOne({ GPMProfileId: profileId });
                if (profile) {
                    profile.mobileDeviceName = "";
                    profile.userAgent = "";
                    profile.mobileMode = false;
                    await profile.save();
                }
            }
            promises.push(promise());
        }
        await Promise.all(promises);
        return res.status(200).send({
            code: "1000",
            message: "OK"
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.post('/mode_mobile_device', async (req, res) => {
    try {
        const { profileIds, mobileMode } = req.body;
        const promises = [];
        for (const profileId of profileIds) {
            const promise = async () => {
                const profile = await MobileDevice.findOne({ GPMProfileId: profileId });
                if (profile) {
                    profile.mobileMode = mobileMode;
                    await profile.save();
                }
            }
            promises.push(promise());
        }
        await Promise.all(promises);
        return res.status(200).send({
            code: "1000",
            message: "OK"
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).send({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
})
module.exports = router;