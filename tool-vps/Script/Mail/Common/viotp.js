const viotpUrl = 'https://api.viotp.com';
const axios = require('axios');
async function thueSo(token, serviceId = 3, country = 'vn'){
    try {
        const result = await axios.get(`${viotpUrl}/request/getv2?token=${token}&serviceId=${serviceId}&country=${country}`);
        return result;
    }
    catch(e){
        console.error(e);
        return null;
    }
}
async function layCode(token, requestId){
    try {
        const result = await axios.get(`${viotpUrl}/session/getv2?requestId=${requestId}&token=${token}`);
        return result;
    }
    catch(e){
        console.error(e);
        return null;
    }
}
const viotp = {
    thueSo,
    layCode
}
module.exports = viotp;