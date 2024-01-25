const helper = require("../../../Action/Helper/helper");
const mouse = require("../../../Action/Mouse/mouse");

async function randomScrollClickLeftRightButton(page, count) {
    for (let i = 1; i <= count; i++) {
        try {
            const option = helper.getRandomPhrase('0|1|2|1|1|1|1', '|');
            // option === 0 random scroll
            if (+option == 0) {
                console.log('option', 0);
                await mouse.scrollRandom(page, helper.randomInt(1, 3), helper.randomFloat(250, 400));
            }
            // option == 1 click vào right button
            else if (+option == 1) {
                console.log('option', 1);
                await page.evaluate(async () => {
                    function delay(time) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, time * 1000)
                        });
                    }
                    function scrollToElement(selector) {
                        const blockValues = ['start', 'center', 'end', 'nearest'];
                        const block = blockValues[Math.floor(Math.random() * blockValues.length)];
                        try {
                            selector.scrollIntoView({ behavior: 'smooth', block });
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    }
                    try {
                        let listRightButton = document.querySelectorAll('#right-arrow button');
                        if (!listRightButton?.length) listRightButton = document.querySelectorAll('.icon-button[aria-label="Show more"]');
                        const randomIndex = Math.floor(Math.random() * listRightButton.length); // lấy chỉ mục ngẫu nhiên
                        console.log('listRightButton[randomIndex]', listRightButton[randomIndex]);
                        scrollToElement(listRightButton[randomIndex]) // truy cập phần tử có chỉ mục ngẫu nhiên
                        await delay(3);
                        listRightButton[randomIndex].click();
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                });

            }
            else {
                console.log('option', 2);
                await page.evaluate(async () => {
                    function delay(time) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, time * 1000)
                        });
                    }
                    function scrollToElement(selector) {
                        const blockValues = ['start', 'center', 'end', 'nearest'];
                        const block = blockValues[Math.floor(Math.random() * blockValues.length)];
                        try {
                            selector.scrollIntoView({ behavior: 'smooth', block });
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    }
                    try {
                        let listLeftButton = document.querySelectorAll('#left-arrow button');
                        if (!listLeftButton?.length) listLeftButton = document.querySelectorAll('.icon-button[aria-label="Show more"]');
                        const randomIndex = Math.floor(Math.random() * listLeftButton.length); // lấy chỉ mục ngẫu nhiên
                        scrollToElement(listLeftButton[randomIndex]); // truy cập phần tử có chỉ mục ngẫu nhiên
                        await delay(3);
                        listLeftButton[randomIndex].click();
                        return true;
                    }
                    catch (e) {
                        return null;
                    }
                })
            }
            await helper.delay(3);
        }
        catch (e) {
            console.error(e);
        }
    }
}
module.exports = randomScrollClickLeftRightButton;