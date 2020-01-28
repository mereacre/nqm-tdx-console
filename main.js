"use strict";

require("dotenv").config();

const appConfig = require("./config.json");
const {TDX_CURRENT_ALIAS} = require("./src/constants");
const {
  checkValidAlias,
  envToAlias,
  getSecretAliasName,
  getTokenAliasName,
} = require("./src/utils");

const CommandHandler = require("./src/command-handler");

async function argumentHandler(argv) {
  const command = argv._[0];
  const commandProps = {
    alias: argv.alias || "",
    id: argv.id || "",
    secret: argv.secret || "",
  };

  await run(command, commandProps);
}

async function run(commandName, commandProps) {
  const envAlias = envToAlias(process.env[TDX_CURRENT_ALIAS] || "");
  const commandAlias = commandProps.alias;
  const alias = (commandAlias === "") ? envAlias : commandAlias;

  try {
    if (!alias) throw Error("No alias defined.");
    if (!checkValidAlias(alias)) throw Error("Wrong alias name. Only allowed [a-zA-Z0-9_]");

    const tdxConfig = appConfig.tdxConfigs[alias] || {};
    const commandHandler = new CommandHandler({
      alias,
      tokenHref: tdxConfig.tokenHref,
      config: tdxConfig.config,
    });
    switch (commandName) {
      case "signin":
        await commandHandler.handleSignin({id: commandProps.id, secret: commandProps.secret});
        break;
      case "connect":
        await commandHandler.handleConnect(
          process.env[getSecretAliasName(alias)],
          process.env[getTokenAliasName(alias)]
        );
        break;
    }
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("signin", "Signin to tdx", {}, argumentHandler)
  .command("connect", "Test tdx connection", {}, argumentHandler)
  .demandCommand(1, 1, "You need at least one command to run.")
  .option("a", {
    alias: "alias",
    nargs: 1,
    describe: "Alias",
    type: "string",
    requiresArg: true,
  })
  .option("i", {
    alias: "id",
    nargs: 1,
    describe: "Secret id",
    type: "string",
    requiresArg: true,
  })
  .option("s", {
    alias: "secret",
    nargs: 1,
    describe: "Secret value",
    type: "string",
    requiresArg: true,
  })
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .epilog("Copyright Nquiringminds Ltd. 2019")
  .argv;
