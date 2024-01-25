const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');
async function findActiveTab(browser) {
  try {
    const pages = await browser.pages();
    let arr = [];
    // let tmp = false;
    for (let page of pages) {
      const isActive = await page.evaluate(() => {
        console.log('visible', document.visibilityState === 'visible');
        return document.visibilityState === 'visible';
      });
      // tmp = tmp || isActive;
      arr.push(isActive);
      // if (isActive) {
      //   return page;
      // }
    }
    console.log(arr);
    await delay(300)
    return null;
  }
  catch (e) {
    console.log('Error: ', e)
    return null;
  }
}
// kiểm tra xem element có hiển thị trên màn hình không
async function checkVisibleElement(element) {
  try {
    const boundingBox = await element.boundingBox();
    if (boundingBox) {
      const { x, y, width, height } = boundingBox;
      if (width * height === 0) return false;
    }
    const checkVisibleElement = await element.evaluate((node) => {
      let parentElement = node.parentElement;
      while (parentElement) {
        const styles = window.getComputedStyle(parentElement);
        if (styles && styles.display === 'none') {
          return false;
        }
        parentElement = parentElement.parentElement;
      }
      return true;
    });
    return checkVisibleElement;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}
async function getCurrentPageIndexByUrl(browser, domain) {
  try {
    const pages = await browser.pages();
    for (const index in pages) {
      const url = await pages[index].url();
      if (url.includes(domain)) {
        return +index + 1;
      }
    }
  }
  catch (e) {
    console.error(e);
  }
}
async function getCurrentPageByUrl(browser, domain) {
  try {
    const pages = await browser.pages();
    for (const index in pages) {
      const url = await pages[index].url();
      if (url.includes(domain)) {
        return pages[index];
      }
    }
  }
  catch (e) {
    console.error(e);
  }
}
// lấy element trong list element đang hiển thị trên màn hình
async function getVisibleElement(elements) {
  try {
    for (let i = 0; i < elements.length; i++) {
      if (await checkVisibleElement(elements[i])) {
        return elements[i];
      }
    }
    return null;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}
// hàm kiểm tra element có nằm trong viewport hay không
async function isElementInViewport(element) {
  try {
    // check hiển thị và hiển thị trong viewport
    return (await element.isIntersectingViewport() && await checkVisibleElement(element));
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
    return false; // Hoặc giá trị khác tùy ý để chỉ ra rằng có lỗi xảy ra
  }
}
async function getListVisibleElement(elements) {
  try {
    let data = [];
    for (let i = 0; i < elements.length; i++) {
      if (await checkVisibleElement(elements[i])) {
        data.push(elements[i]);
      }
    }
    return data;
  }
  catch (e) {
    console.error(e);
    return [];
  }
}
async function getListVisibleElementInViewPort(elements) {
  try {
    let data = [];
    for (let i = 0; i < elements.length; i++) {
      if (await isElementInViewport(elements[i])) {
        data.push(elements[i]);
      }
    }
    return data;
  }
  catch (e) {
    console.error(e);
    return [];
  }
}
// lấy random vị trí để click vào phần tử
async function getRandomPositionWithinElement(elementHandle) {
  try {
    const boundingBox = await elementHandle.boundingBox();
    if (boundingBox) {
      const { x, y, width, height } = boundingBox;
      const randomX = Math.random() * width + x;
      const randomY = Math.random() * height + y;

      return { x: randomX, y: randomY };
    }
  }
  catch (e) {
    console.error(e);
    return null;
  }
}
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time * 1000)
  });
}
function getDirectoriesRecursively(dirPath) {
  try {
    let directories = [];

    // Lấy danh sách các đối tượng trong thư mục đang xét
    let items = fs.readdirSync(dirPath);

    for (let item of items) {
      let itemPath = path.join(dirPath, item);

      // Kiểm tra xem đối tượng là thư mục hay không
      let isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        directories.push(itemPath);
        // Lấy danh sách thư mục con của thư mục hiện tại và nối vào danh sách thư mục
        directories = directories.concat(getDirectoriesRecursively(itemPath));
      }
    }

    return items;
  }
  catch (e) {
    console.log('Error', e);
    return [];
  }
}
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(filePath, 'utf8')
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        if (err.code === 'ENOENT') { // Kiểm tra lỗi "no such file or directory"
          fs.promises.writeFile(filePath, '')
            .then(() => {
              resolve('');
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(err);
        }
      });
  });
}
function appendToLog(logFilePath, logData) {
  logData = logData + '\n'; // Thêm ký tự xuống dòng
  fs.appendFileSync(logFilePath, logData);
}
function overwriteFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log('Ghi đè thành công vào file.');
}
function createLogFile(logDir, logFile) {
  const logPath = path.join(logDir, logFile);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    // console.log('Đã tạo thư mục: ' + logFile);
  }

  // Kiểm tra xem file log.txt đã tồn tại hay chưa
  if (fs.existsSync(logPath)) {
    // console.log('File đã tồn tại.');
  } else {
    fs.writeFileSync(logPath, '', 'utf-8');
    // console.log('File đã được tạo thành công.');
  }
}
async function checkPageBlock(page) {
  try {
    const process = await page.evaluate(() => {
      const spanElement = document.querySelector('#main-message span[jsselect="heading"]');
      const content = spanElement.innerHTML;
      if (content === 'This site can’t be reached') return true;
      return false;
    });
    return process;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}
function getRandomPhrase(phrasesString, chr = "|") {
  try {
    const phrasesArray = phrasesString.split(chr);
    const randomIndex = Math.floor(Math.random() * phrasesArray.length);
    return phrasesArray[randomIndex];
  }
  catch (e) {
    return null;
  }
}
function randomFloat(x, y) {
  return x + (y - x) * Math.random();
}
function randomInt(x, y) {
  return Math.floor(Math.random() * (y - x + 1)) + x;
}
function convertTimeToSeconds(time) {
  try {
    const timeParts = time.split(':');
    let hours = 0;
    let minutes = parseInt(timeParts[0], 10) || 0;
    let seconds = parseInt(timeParts[1], 10) || 0;
    if (timeParts.length === 3) {
      hours = parseInt(timeParts[0], 10) || 0;
      minutes = parseInt(timeParts[1], 10) || 0;
      seconds = parseInt(timeParts[2], 10) || 0;
    }
    return (hours * 3600) + (minutes * 60) + seconds;
  } catch (error) {
    console.log('Error converting time:', error.message);
    return 0;
  }
}
function getIdVideoFromUrl(url) {
  try {
    return url.split('v=')[1].split('&')[0];
  }
  catch (e) {
    console.error(e);
    return '';
  }
}
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
function parseListVideoYoutubeBuff(strs) {
  try {
    strs = strs.split('\n');
    let data = [];
    for (let str of strs) {
      str = str.split('|');
      let videoId = getIdVideoFromUrl(str[0]);
      let listKeywordTitle = str[1];
      let listLinkChannel = str[2];
      let channelName = str[3];
      let listKeywordChannel = str[4];
      data.push({
        videoId,
        listKeywordTitle,
        listLinkChannel,
        channelName,
        listKeywordChannel
      })
    }
    return data;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}
async function parseLogWatchedVideo(filePath) {
  try {
    createLogFile(filePath + "\\youtube-log", 'watched-video-log.txt');
    return (await helper.readFileAsync(filePath + "\\youtube-log\\watched-video-log.txt"))?.split('\n')?.filter(o => o !== '')?.map(o => o.split("|")[0]);
  }
  catch (e) {
    console.error(e);
    return [];
  }
}
async function parseFileWithDetermine(filePath, determine) {
  try {
    return (await helper.readFileAsync(filePath))?.split(determine)?.filter(o => !!o);
  }
  catch (e) {
    console.error(e);
    return [];
  }
}
function getIdVideoFromEmbedLink(str) {
  try {
    return str.split('embed/')[1].split('?')[0];
  }
  catch (e) {
    console.error(e);
    return "";
  }
}
async function checkElementExist(page, selector, timeout) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true; // Nếu element tồn tại sau timeout, trả về true
  } catch (error) {
    return false; // Nếu element không tồn tại sau timeout, trả về false
  }
}
function getFilesInDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files;
  } catch (err) {
    console.log('Đã xảy ra lỗi khi đọc thư mục:', err);
    return [];
  }
}
function getNowFormatDate() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }

  let formattedDate = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return formattedDate;
}
function checkDateBeforeDays(dateString, dayAgo) {
  try {
    var enteredDate = new Date(dateString);
    var currentDate = new Date();
    // Trừ đi dayAgo ngày từ ngày hiện tại
    currentDate.setDate(currentDate.getDate() - dayAgo);
    if (enteredDate < currentDate) {
      return true;
    } else {
      return false;
    }
  }
  catch (e) {
    return false;
  }
}
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function filterUniqueStrings(arr) {
  try {
    const counts = {}; // Đối tượng để đếm số lần xuất hiện của mỗi chuỗi
    const data = [];
    // Đếm số lần xuất hiện của mỗi chuỗi trong mảng
    for (let i = 0; i < arr.length; i++) {
      const currentString = arr[i];
      counts[currentString] = (counts[currentString] || 0) + 1;
      if (counts[currentString] === 1) data.push(currentString);
    }
    return data;
  } catch (e) {
    return []
  }
}
function createLogFileJson(logDir, logFile, initObj = '') {
  const logPath = path.join(logDir, logFile);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    // console.log('Đã tạo thư mục: ' + logFile);
  }

  // Kiểm tra xem file log.txt đã tồn tại hay chưa
  if (fs.existsSync(logPath)) {
    // fs.writeFileSync(logPath, JSON.stringify(initObj), 'utf-8');
    // console.log('File đã tồn tại.');
  } else {
    fs.writeFileSync(logPath, JSON.stringify(initObj), 'utf-8');
    // console.log('File đã được tạo thành công.');
  }
}
function getPortCmd(query) {
  try {
    let result = cmd.runSync(`netstat -ano | find "${query}"`);
    let portExisted = [];
    if (result.data) {
      const arr = result.data.split('\r\n');
      for (const item of arr) {
        const data = item.split(" ").filter(o => !!o);
        portExisted.push({
          protocol: data?.[0],
          localAddress: data?.[1], 
          foreignAddress: data?.[2],
          localPort: data[1]?.split(":")?.[1],
          foreignPort: data[2]?.split(":")?.[1],
          status: data?.[3],
          pid: data?.[4]
        });
      }
    }
    return portExisted;
  }
  catch (e) {
    console.log(e);
    return []
  }
}
function generateRandomString(minLength, maxLength) {
  // Chọn ngẫu nhiên độ dài của chuỗi từ minLength đến maxLength
  var length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // Tạo chuỗi ngẫu nhiên bao gồm chữ cái và số
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var randomString = '';
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
function shuffleAndSelectWords(sentence, percentage = 70) {
  try {

    // Tách câu thành mảng các từ
    const words = sentence.split(' ');

    // Tính toán số từ cần lấy dựa trên tỉ lệ nhập vào
    const numWordsToSelect = Math.floor(words.length * (percentage / 100));

    // Xáo trộn mảng từ
    const shuffledWords = words.sort(() => Math.random() - 0.5);

    // Lấy ra các từ theo số từ cần lấy
    const selectedWords = shuffledWords.slice(0, numWordsToSelect);

    // Ghép lại các từ để tạo câu mới
    const shuffledSentence = selectedWords.join(' ');

    return shuffledSentence || sentence;

  }
  catch (e) {
    return sentence;
  }
}
const helper = {
  findActiveTab,
  delay,
  getDirectoriesRecursively,
  readFileAsync,
  checkPageBlock,
  getRandomPhrase,
  randomFloat,
  randomInt,
  convertTimeToSeconds,
  createLogFile,
  getIdVideoFromUrl,
  appendToLog,
  overwriteFile,
  checkElementExist,
  parseListVideoYoutubeBuff,
  parseLogWatchedVideo,
  parseFileWithDetermine,
  getNowFormatDate,
  getIdChannelFromUrl,
  deepCopy,
  checkVisibleElement,
  getVisibleElement,
  isElementInViewport,
  getListVisibleElementInViewPort,
  getListVisibleElement,
  getRandomPositionWithinElement,
  getCurrentPageIndexByUrl,
  getCurrentPageByUrl,
  getFilesInDirectory,
  checkDateBeforeDays,
  filterUniqueStrings,
  createLogFileJson,
  getIdVideoFromEmbedLink,
  getPortCmd,
  generateRandomString,
  shuffleAndSelectWords
}
module.exports = helper;