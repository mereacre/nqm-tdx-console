module.exports = function(config) {
  "use strict";

  const scraper = require("./scraper");

  async function getUserToken() {
    const token = await scraper.getUserToken(config.tokenHref);

    return token || "";
  }

  return {
    getUserToken,
  };
};
