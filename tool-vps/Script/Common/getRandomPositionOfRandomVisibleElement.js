//scroll tới random 1 trong các phần tử hiển thị trên trang web, return ra tọa độ của vị trí đó để mouse có thể click
async function getRandomPositionOfRandomVisibleElement(page, selector) {
    try {
        return await page.evaluate((selector) => {
            function isElementInViewport(element) {
                var rect = element.getBoundingClientRect();
                return (
                    rect.height * rect.width > 0 &&
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
            function queryVisibleSelectorAll(selector){
                let links = document.querySelectorAll(selector);
                links = Array.from(links).filter(o => isElementInViewport(o));
                return links;
            }
            function getRandomPositionWithinElement(element){
                const { x, y, width, height } = element.getBoundingClientRect();
                console.log(x, y, width, height);
                const randomX = Math.random() * width + x;
                const randomY = Math.random() * height + y;
                return {x: randomX, y: randomY};
            }
            try {
                const visibleLinks = queryVisibleSelectorAll(selector);
                const randomLink = Math.floor(Math.random() * visibleLinks.length);
                const position = getRandomPositionWithinElement(visibleLinks[randomLink]);
                return position;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        }, selector)
    } catch (e) {
        console.error(e);
    }
}

module.exports = getRandomPositionOfRandomVisibleElement;