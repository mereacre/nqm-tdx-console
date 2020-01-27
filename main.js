"use strict";

require("dotenv").config();

const config = require("./config.json");
const {TDX_CURRENT_ALIAS} = require("./src/constants");

async function argumentHandler(argv) {
  const command = argv._[0];
  const commandProps = {
    alias: argv.alias || "",
  };

  await run(command, commandProps);
}

async function run(commandName, commandProps) {
  const envAlias = process.env[TDX_CURRENT_ALIAS] || "";
  const commandAlias = commandProps.alias;

  try {
    if (!envAlias && !commandAlias)
      throw Error("No alias defined.");

    switch (commandName) {
      case "signin": break;
    }
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}
const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("signin", "Signin to tdx", {}, argumentHandler)
  .demandCommand(1, 1, "You need at least one command to run.")
  .option("a", {
    alias: "alias",
    nargs: 1,
    describe: "Alias",
    type: "string",
    requiresArg: true,
  })
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .epilog("Copyright Nquiringminds Ltd. 2019")
  .argv;

// const utils = require("./src/utils");
// const tdxConsole = require("./src")(config);

// let userToken = process.env.USER_TOKEN || "";

// (async() => {
//   try {
//     if (userToken === "") {
//       const {token, browser} = await tdxConsole.getUserToken();
//       userToken = token;
//       await browser.close();
//       utils.setEnv("USER_TOKEN", userToken);
//     }
//   } catch (error) {
//     console.log(error);
//     process.exit(-1);
//   }
// })();
