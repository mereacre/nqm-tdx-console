"use strict";

require("dotenv").config();

const config = require("./config.json");
const utils = require("./src/utils");
const tdxConsole = require("./src")(config);

let userToken = process.env.USER_TOKEN || "";

(async() => {
  try {
    if (userToken === "") {
      const {token, browser} = await tdxConsole.getUserToken();
      userToken = token;
      await browser.close();
      utils.setEnv("USER_TOKEN", userToken);
    }
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
})();
