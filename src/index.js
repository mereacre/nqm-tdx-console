module.exports = function(config) {
  "use strict";

  const scraper = require("./scraper");

  function getUserToken() {
    return scraper.getUserToken(config.tokenPath);
  }

  return {
    getUserToken,
  };
};
