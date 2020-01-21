"use strict";

const puppeteer = require("puppeteer");
const url = require("url");
const querystring = require("querystring");

async function getUserToken(tokenHref) {
  const originHost = url.parse(tokenHref).host;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  return new Promise(async(resolve, reject) => {
    try {
      page.on("request", (request) => {
        const reqUrl = request.url();
        const reqObject = url.parse(reqUrl);
        const reqHost = reqObject.host;

        if (reqHost === originHost && reqObject.query) {
          const queryObject = querystring.parse(reqObject.query);
          if ("access_token" in queryObject)
            resolve({browser, token: queryObject["access_token"] || ""});
        }

        request.continue();
      });

      await page.goto(tokenHref);
    } catch (error) {
      await browser.close();
      reject(error);
    }
  });
}

module.exports = {
  getUserToken,
};
