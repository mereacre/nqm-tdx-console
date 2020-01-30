"use strict";

const puppeteer = require("puppeteer");
const url = require("url");
const querystring = require("querystring");

async function startScraper(tokenHref, headless = false) {
  const originHost = url.parse(tokenHref).host;
  const browser = await puppeteer.launch({headless});
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  return {
    originHost,
    browser,
    page,
  };
}

async function submitSecret({page, secret, timeout}) {
  try {
    await page.click('[title="log in with e-mail"]');
    await page.waitForSelector('[action="/auth/email"]', {timeout});
    await page.type('[type="text"]', secret.id);
    await page.type('[type="password"]', secret.secret);
    await page.click('[type="submit"]');
    await page.waitForSelector('[action="/application/connection"]', {timeout});
    await page.click('[type="submit"]');
  } catch (error) {
    throw Error("Invalid credentials or page load error");
  }
}

function handleTokenRequest({request, originHost, browser, cb}) {
  const reqUrl = request.url();
  const reqObject = url.parse(reqUrl);
  const reqHost = reqObject.host;

  if (reqHost === originHost && reqObject.query) {
    const queryObject = querystring.parse(reqObject.query);
    if ("access_token" in queryObject)
      cb({browser, token: queryObject["access_token"] || ""});
  }

  request.continue();
}

async function registerRequest({tokenHref, page, browser, originHost, cb}) {
  page.on("request", (request) => handleTokenRequest({request, originHost, browser, cb}));

  await page.goto(tokenHref);
}

async function getPromiseRequestHandler({resolve, reject, tokenHref, page, browser, originHost}) {
  try {
    await registerRequest({tokenHref, page, browser, originHost, cb: resolve});
  } catch (error) {
    await browser.close();
    reject(error);
  }
}

async function getBrowserToken(tokenHref) {
  const {originHost, browser, page} = await startScraper(tokenHref, false);
  return new Promise(async(resolve, reject) => getPromiseRequestHandler({
    resolve, reject, tokenHref, page, browser, originHost,
  }));
}

async function getUserToken({tokenHref, secret, timeout}) {
  const {originHost, browser, page} = await startScraper(tokenHref, true);

  return new Promise(async(resolve, reject) => {
    await getPromiseRequestHandler({resolve, reject, tokenHref, page, browser, originHost});
    await submitSecret({page, secret, timeout});
  });
}

module.exports = {
  getUserToken,
  getBrowserToken,
};
