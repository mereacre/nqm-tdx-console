"use strict";

require("dotenv").config();

const appConfig = require("./config.json");
const {TDX_CURRENT_ALIAS} = require("./src/constants");
const {
  checkValidAlias,
  envToAlias,
  getSecretAliasName,
  getTokenAliasName,
  base64ToJson,
  setEnv,
  aliasToEnv,
  jsonToBase64,
} = require("./src/utils");

const CommandHandler = require("./src/command-handler");

async function argumentHandler(argv) {
  console.log(argv);
  const command = argv._[0];
  const commandProps = {
    alias: argv.alias || "",
    id: argv.id || "",
    secret: argv.secret || "",
    command: argv.command || "",
    args: argv.args || "",
  };

  await run(command, commandProps);
}

function getAllAliases(configs) {
  return Object.keys(configs);
}

async function run(commandName, commandProps) {
  const envAlias = envToAlias(process.env[TDX_CURRENT_ALIAS] || "");
  const commandAlias = commandProps.alias;
  const alias = (commandAlias === "") ? envAlias : commandAlias;

  try {
    if (!alias) throw Error("No alias defined.");
    if (!checkValidAlias(alias)) throw Error("Wrong alias name. Only allowed [a-zA-Z0-9_]");

    const argumentSecret = {id: commandProps.id, secret: commandProps.secret};
    const storedSecret = base64ToJson(process.env[getSecretAliasName(alias)] || "");
    const storedToken = process.env[getTokenAliasName(alias)];
    const tdxConfig = appConfig.tdxConfigs[alias] || {};

    const commandHandler = new CommandHandler({
      tdxConfig,
      secret: storedSecret,
      token: storedToken,
    });

    switch (commandName) {
      case "signin":
        await commandHandler.handleSignin(argumentSecret);

        setEnv(TDX_CURRENT_ALIAS, aliasToEnv(alias));
        // Store the argument secret
        if (argumentSecret.id) setEnv(getSecretAliasName(alias), jsonToBase64(argumentSecret));
        setEnv(getTokenAliasName(alias), commandHandler.getToken());
        break;
      case "signout":
        commandHandler.handleSignout();
        setEnv(getTokenAliasName(alias), "");
        setEnv(getSecretAliasName(alias), "");
        break;
      case "info":
        const info = await commandHandler.handleInfo();
        console.log(info);
        break;
      case "config":
        console.log(tdxConfig);
        break;
      case "all":
        console.log(getAllAliases(appConfig.tdxConfigs));
        break;
      case "run":
        const output = await commandHandler.handleRun(
          commandProps.command, commandProps.args,
        );
        console.log(output);
        break;
    }
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("signin", "Sign in to tdx", {}, argumentHandler)
  .command("signout", "Sign out of tdx", {}, argumentHandler)
  .command("info", "Output current account info", {}, argumentHandler)
  .command("config", "Output tdx config", {}, argumentHandler)
  .command("all", "Output all aliases names", {}, argumentHandler)
  .command("run", "Run a tdx api command", {}, argumentHandler)
  .demandCommand(1, 1, "You need at least one command to run.")
  .option("a", {
    alias: "alias",
    nargs: 1,
    describe: "Alias",
    type: "string",
    requiresArg: true,
  })
  .option("t", {
    alias: "auto",
    describe: "Auto sign in",
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
  .option("c", {
    alias: "command",
    nargs: 1,
    describe: "TDX api command name",
    type: "string",
    requiresArg: true,
  })
  .option("g", {
    alias: "args",
    nargs: 1,
    describe: "TDX api command arguments",
    type: "string",
    requiresArg: true,
  })
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .epilog("Copyright Nquiringminds Ltd. 2019")
  .argv;
