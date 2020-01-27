"use strict";
const {connectWithToken, connectWithSecret} = require("./connect");
const {getUserToken} = require("./scraper");

async function webSignin(config, tokenHref) {
  const token = await getUserToken(tokenHref);
  return connectWithToken(config, token);
}

async function secretSignin(config, secret) {
  return connectWithSecret(config, secret);
}

async function signin({config, tokenHref, secret, type}) {
  const tdxSecret = secret || {};
  return (type === "web") ? await this.webSignin(config, tokenHref) : await this.secretSignin(config, tdxSecret);
}

module.exports = {
  webSignin,
  secretSignin,
  signin,
};
