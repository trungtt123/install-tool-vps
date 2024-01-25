const navigation = require('../../../Action/Navigation/navigation');
const keyboard = require('../../../Action/Keyboard/keyboard');
const helper = require('../../../Action/Helper/helper');
const Mail = require('../../../models/Mail');
const dbLocal = require('../../../Database/database');
const mouse = require('../../../Action/Mouse/mouse');
async function homeInstagram({ browser, profileData }) {
    try {
        let page = await navigation.newTab(browser, 'https://www.instagram.com/');
        await helper.delay(20);
        const randomScroll = helper.randomInt(10, 20);
        let currentArticleTop = 0;
        for (let i = 1; i <= randomScroll; i++) {
            console.log('randomScroll', i);
            currentArticleTop = await page.evaluate(async (currentArticleTop) => {
                function randomInt(x, y) {
                    return Math.floor(Math.random() * (y - x + 1)) + x;
                }
                function delay(time) {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, time * 1000)
                    });
                }
                let articleTop;
                try {
                    const articles = document.querySelectorAll('article');
                    let found = false;
                    for (const article of articles) {
                        articleTop = article.offsetTop;
                        console.log('articleTop', articleTop, 'currentArticleTop', currentArticleTop);
                        if (articleTop > currentArticleTop) {
                            article.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            found = true;
                            const isVideo = article.querySelector('video');
                            // nếu bài viết là video
                            if (isVideo) {
                                // kiểm tra xem video có tắt tiếng k, nếu có -> bật lên
                                const isMuted = article.querySelector('button[aria-label="Toggle audio"] svg[aria-label*="muted"]');
                                if (isMuted) {
                                    article.querySelector('button[aria-label="Toggle audio"]')?.click();
                                }
                                await delay(randomInt(30, 60));
                            }
                            else {
                                // click next or go back button
                                for (let i = 0; i < randomInt(0, 10); i++) {
                                    if (randomInt(0, 1) === 1) article.querySelector('button[aria-label="Next"]')?.click();
                                    else article.querySelector('button[aria-label="Go back"]')?.click();
                                    await delay(2);
                                }
                            }
                            // random like
                            if (randomInt(0, 1) === 1) {
                                article.querySelector('svg[aria-label="Like"]')?.click();
                                await delay(2);
                            }
                            // random follow
                            if (randomInt(0, 2) === 1){
                                const arr = article.querySelectorAll('div');
                                for (const item of arr){
                                    if (item.textContent.trim() === 'Follow'){
                                        item.click();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (!found) window.scrollBy({top: randomInt(800, 100), behavior: "smooth"})

                }
                catch (e) {
                    console.log(e);
                }
                if (!articleTop) return currentArticleTop + 1000;
                return articleTop;
            }, (currentArticleTop));

        }
        await navigation.closeActiveTab(page);
        return true;
    }
    catch (e) {
        console.error(e);
        console.log('Lỗi tại homeInstagram ');
        return false;
    }
}
module.exports = homeInstagram;
