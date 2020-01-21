"use strict";

require("dotenv").config();

const config = require("./config.json");
const tdxConsole = require("./src")(config);

(async() => {
  console.log(process.env);
  // const token = await tdxConsole.getUserToken();
  console.log(token);
})();
