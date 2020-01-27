"use strict";
const {connectWithToken, connectWithSecret} = require("./connect");
const {getUserToken} = require("./scraper");

async function webSignin(config, tokenHref) {
  const {token, browser} = await getUserToken(tokenHref);
  await browser.close();
  return connectWithToken(config, token);
}

async function secretSignin(config, secret) {
  return connectWithSecret(config, secret);
}

async function signin({config, tokenHref, secret, type}) {
  const tdxSecret = secret || {};
  return (type === "web") ? await webSignin(config, tokenHref) : await secretSignin(config, tdxSecret);
}

module.exports = {
  webSignin,
  secretSignin,
  signin,
};
