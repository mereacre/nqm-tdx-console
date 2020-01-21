const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
    console.log('INTERCEPTED: ' + request.url());
    request.continue();
  });
  await page.goto('https://q.nqminds.com/v1/auth-account?filter=&proj=');
  await page.screenshot({path: 'example.png'});

  // await browser.close();
})();