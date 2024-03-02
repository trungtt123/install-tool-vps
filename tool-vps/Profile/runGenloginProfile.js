const puppeteer = require('puppeteer');
const helper = require('../Action/Helper/helper');
const navigation = require('../Action/Navigation/navigation');
const axios = require('axios');

async function runGenloginProfile(profileId) {
  try {
    const result = (await axios.put(`http://localhost:55550/backend/profiles/${profileId}/start`)).data;
    const browser = await puppeteer.connect({ browserWSEndpoint: result.data.wsEndpoint });
    return browser;
  }
  catch (e) {
    console.log('Error', e);
    return null;
  }
}
module.exports = runGenloginProfile;
