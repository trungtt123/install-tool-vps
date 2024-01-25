const express = require('express');
const router = express.Router();
const helper = require('../Action/Helper/helper');
const axios = require('axios');
const moment = require('moment');
const { API_NGROK_URL, CONFIG_ROOT, PROFILES_PATH } = require('../const');
const cmd = require('node-cmd');
const os = require('os');
const cron = require('node-cron');
const Vps = require('../models/Vps');
const dbLocal = require('../Database/database');

async function getVpsInfo() {
    try {
        const hostname = os.hostname();
        const publicUrl = (await axios(API_NGROK_URL + "/api/tunnels")).data.tunnels[0].public_url;
        let database = await dbLocal.getData();
        const vpsId = database?.vpsId;
        let vps = await Vps.findOne({ _id: vpsId });
        if (!vps) {
            vps = await Vps.create({ hostname, publicUrl });
        }
        else {
            vps.hostname = hostname;
            vps.publicUrl = publicUrl;
            await vps.save();
        }
        database["vpsId"] = vps._id.toString();
        await dbLocal.updateData(database);
    }
    catch (e) {
        console.log('NGROK NOT WORKING');
    }
}
async function checkOrResetNgrokActive() {
    try {
        let database = await dbLocal.getData();
        const vpsId = database?.vpsId;
        const vps = await Vps.findOne({ _id: vpsId });
        cmd.runSync(`taskkill /IM ngrok.exe /F`);
        if (vps && vps.ngrokAuth){
            cmd.runSync(`cd ${CONFIG_ROOT + "\\ngrok"} && ngrok config add-authtoken ${vps.ngrokAuth}`);
        }
        cmd.run(`cd ${CONFIG_ROOT + "\\ngrok"} && ngrok http 7070`);
        await helper.delay(5);
    }
    catch (e) {
        // console.log(e);
    }
}
async function reset_ngrok() {
    await checkOrResetNgrokActive();
    await getVpsInfo();
}

reset_ngrok()
// cron.schedule('0 * * * *', async () => {
//     reset_ngrok()
// });
async function stop_chrome_profile(profile_id) {
    try {
        const database = await dbLocal.getData();
        const profiles = database.profiles || [];
        const profile = profiles.find(o => o.id === profile_id);
        let result = helper.getPortCmd(`127.0.0.1:${profile.port}`);
        const pid = result?.find(o => o?.localPort?.toString() == profile?.port?.toString())?.pid;
        cmd.run(`taskkill /F /PID ${pid}`);
        return {
            status: "true",
            profile_id: profile_id
        }
    }
    catch (e){
        return {
            status: "false",
            profile_id: profile_id
        }
    }
}
async function create_chrome_profile(quantity) {
    try {
        for (let i = 1; i <= quantity; i++) {
            let database = await dbLocal.getData();
            let profiles = database.profiles || [];
            let result = helper.getPortCmd(`127.0.0.1`);
            let randomPort, randomCount = 100;
            while (!randomPort && randomCount > 0) {
                randomPort = helper.randomInt(1000, 65535);
                if (result.find(o => o.localPort == randomPort || o.foreignPort == randomPort)) {
                    randomPort = null;
                }
                randomCount--;
            }
            const profileName = `Profile-${moment().valueOf()}`;
            cmd.run(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=${randomPort} --user-data-dir="${PROFILES_PATH}\\${profileName}"`);
            // lấy tiến trình của randomport
            await helper.delay(2);
            profiles.push({
                id: btoa(profileName),
                name: profileName,
                path: `${PROFILES_PATH}\\${profileName}`,
                proxy: '',
                port: randomPort,
                groupId: '',
                vpsId: database?.vpsId,
                vpsName: os.hostname()
            });
            database.profiles = profiles;
            await dbLocal.updateData(database);
            result = helper.getPortCmd(`127.0.0.1:${randomPort}`);
            const pid = result?.[0]?.pid;
            cmd.run(`taskkill /F /PID ${pid}`)
        }
        return {
            code: "1000",
            message: "OK",
        };
    }
    catch (e) {
        console.log('Error', e);
        return {
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        };
    }
};
async function start_chrome_profile(profile_id) {
    try {
        await stop_chrome_profile(profile_id);
        await helper.delay(2);
        const database = await dbLocal.getData();
        const profiles = database.profiles || [];
        const profile = profiles.find(o => o.id === profile_id);
        let result = helper.getPortCmd(`127.0.0.1`);
        let randomPort, randomCount = 100;
        while (!randomPort && randomCount > 0) {
            randomPort = helper.randomInt(1000, 65535);
            if (result.find(o => o.localPort == randomPort || o.foreignPort == randomPort)) {
                randomPort = null;
            }
            randomCount--;
        }
        profile.port = randomPort;
        database.profiles = profiles;
        await dbLocal.updateData(database);
        const proxyArg = !profile.proxy ? `` : `--proxy-server=${profile.proxy.split(":")[0] + ":" + profile.proxy.split(":")[1]}`
        console.log(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=${randomPort} --user-data-dir="${profile.path}" ${proxyArg}`);
        cmd.run(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=${randomPort} --user-data-dir="${profile.path}" ${proxyArg}`);
        
        return {
            status: "true",
            profile_id: profile_id,
            selenium_remote_debug_address: `127.0.0.1:${randomPort}`
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: "false"
        };
    }
}
function update_source_code() {
    try {
        const data = cmd.runSync(`cd ${CONFIG_ROOT} & git pull`);
        console.log('data', data);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
function run_tool_again(){
    try {
        const data = cmd.runSync(`cd ${CONFIG_ROOT} & run-vps.bat`);
        console.log('data', data);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
module.exports = {
    start_chrome_profile,
    stop_chrome_profile,
    create_chrome_profile,
    reset_ngrok,
    update_source_code,
    run_tool_again
};