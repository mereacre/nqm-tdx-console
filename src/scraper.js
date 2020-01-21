"use strict";

const puppeteer = require("puppeteer");

const getUserToken = async(path) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    console.log("INTERCEPTED: " + request.url());
    request.continue();
  });

  await page.goto(path);
};

module.exports = {
  getUserToken,
};
