// This injects a box into the page that moves with the mouse;
// Useful for debugging
async function installMouseHelper(page) {
  await page.evaluateOnNewDocument(() => {
    // Install mouse helper only for top-level frame.
    if (window !== window.parent)
      return;
    
    window.addEventListener('DOMContentLoaded', () => {
      const box = document.createElement('puppeteer-mouse-pointer');
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        puppeteer-mouse-pointer {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10000;
          left: 0;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          padding: 0;
          background-image: url('https://img.freepik.com/free-icon/cursor_318-901544.jpg?w=2000');
          background-size: cover;
          background-repeat: no-repeat;
          transition: background .2s;
        }
        puppeteer-mouse-pointer.button-1 {
          background-image: url('https://img.freepik.com/free-icon/cursor_318-901544.jpg?w=2000');
        }
        
        puppeteer-mouse-pointer.button-2 {
          border-color: rgba(0,0,255,0.9);
        }
        
        puppeteer-mouse-pointer.button-3 {
          border-radius: 4px;
        }
        
        puppeteer-mouse-pointer.button-4 {
          border-color: rgba(255,0,0,0.9);
        }
        
        puppeteer-mouse-pointer.button-5 {
          border-color: rgba(0,255,0,0.9);
        }
        `;
      document.head.appendChild(styleElement);
      document.body.appendChild(box);
      document.addEventListener('mousemove', event => {
        box.style.left = event.pageX + 'px';
        box.style.top = event.pageY + 'px';
        updateButtons(event.buttons);
      }, true);
      document.addEventListener('mousedown', event => {
        updateButtons(event.buttons);
        box.classList.add('button-' + event.which);
      }, true);
      document.addEventListener('mouseup', event => {
        updateButtons(event.buttons);
        box.classList.remove('button-' + event.which);
      }, true);
      function updateButtons(buttons) {
        for (let i = 0; i < 5; i++)
          box.classList.toggle('button-' + i, buttons & (1 << i));
      }
    }, false);
  });
};

module.exports = { installMouseHelper };