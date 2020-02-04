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
  filterObjectByIdentifier,
  filterListByIdentifier,
  readJsonFromFile,
} = require("./src/utils");
const {
  listAliases,
  copyAliasConfig,
  modifyAliasConfig,
  removeAliasConfig,
} = require("./src/alias");
const CommandHandler = require("./src/command-handler");

async function argumentHandler(argv) {
  console.log(argv);
  const command = argv._[0];
  const commandProps = {
    alias: argv.alias || "",
    id: argv.id || "",
    secret: argv.secret || "",
    name: argv.name || "",
    payload: argv.payload || "",
    apiArgs: filterObjectByIdentifier(argv, "@"),
    apiArgsStringify: filterListByIdentifier(argv._.slice(1), "@"),
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
    const id = commandProps.id;
    const secret = commandProps.secret;
    const name = commandProps.name;
    const payload = commandProps.payload;
    const argumentSecret = {id, secret};
    const storedSecret = base64ToJson(process.env[getSecretAliasName(alias)] || "");
    const storedToken = process.env[getTokenAliasName(alias)];
    const tdxConfig = appConfig.tdxConfigs[alias] || {};

    const commandHandler = new CommandHandler({
      tdxConfig,
      secret: storedSecret,
      token: storedToken,
      timeout: appConfig.scraperTimeout,
    });

    let output;
    switch (commandName) {
      case "signin":
        await commandHandler.handleSignin(argumentSecret);

        setEnv(TDX_CURRENT_ALIAS, aliasToEnv(alias));
        // Store the argument secret
        if (argumentSecret.id) setEnv(getSecretAliasName(alias), jsonToBase64(argumentSecret));
        setEnv(getTokenAliasName(alias), commandHandler.getToken());
        console.log("OK");
        break;
      case "signout":
        commandHandler.handleSignout();
        setEnv(getTokenAliasName(alias), "");
        setEnv(getSecretAliasName(alias), "");
        break;
      case "info":
        output = await commandHandler.handleInfo({id, type: name});
        console.log(output);
        break;
      case "config":
        console.log(tdxConfig);
        break;
      case "list":
        output = {
          default: alias,
          aliases: listAliases(appConfig.tdxConfigs),
        };
        console.log(output);
        break;
      case "runapi":
        output = await commandHandler.handleRunApi({
          name,
          apiArgs: commandProps.apiArgs,
          apiArgsStringify: commandProps.apiArgsStringify,
        });
        console.log(JSON.stringify(output, null, 2));
        break;
      case "download":
        await commandHandler.handleDownload(id, name);
        break;
      case "upload":
        output = await commandHandler.handleUpload(id, name);
        console.log(output);
        break;
      case "copyalias":
        await copyAliasConfig({
          appConfig,
          sourceAlias: alias,
          destinationAlias: name,
          configFileName: "./config.json",
        });
        console.log("OK");
        break;
      case "modifyalias":
        const aliasConfig = await readJsonFromFile(payload);
        await modifyAliasConfig({
          appConfig,
          modifyAlias: name,
          aliasConfig,
          configFileName: "./config.json",
        });
        console.log("OK");
        break;
      case "removealias":
        if (alias === name) throw Error("Can't remove the running alias.");
        await removeAliasConfig({
          appConfig,
          removeAlias: name,
          configFileName: "./config.json",
        });
        console.log("OK");
        break;
      case "stopdatabot":
        output = await commandHandler.handleStopDatabot(id);
        console.log(output);
        break;
      case "startdatabot":
        const functionPayload = await readJsonFromFile(payload);
        output = await commandHandler.handleStartDatabot(id, functionPayload);
        console.log(output);
        break;
    }
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

const argv = require("yargs")
  .parserConfiguration({
    "parse-numbers": true,
  })
  .usage("Usage: $0 <command> [options]")
  .command("signin [id] [secret]", "Sign in to tdx", {}, argumentHandler)
  .command("signout", "Sign out of tdx", {}, argumentHandler)
  .command("info [type] [id]", "Output current account info", {}, argumentHandler)
  .command("config", "Output tdx config", {}, argumentHandler)
  .command("list", "List all configured aliases", {}, argumentHandler)
  .command("runapi <command>", "Run a tdx api command", {}, argumentHandler)
  .command("download <id> [filename]", "Download resource", {}, argumentHandler)
  .command("upload <id> <filename>", "Upload resource", {}, argumentHandler)
  .command("copyalias <aliasname>", "Makes a copy of an existing alias configuration", {}, argumentHandler)
  .command("modifyalias <aliasname> <configjson>", "Modifies an existing alias configuration", {}, argumentHandler)
  .command("removealias <aliasname>", "Removes an existing alias configuration", {}, argumentHandler)
  .command("stopdatabot <instanceid>", "Stops a databot instance", {}, argumentHandler)
  .command("startdatabot <databotid> <configjson>", "Starts a databot instance", {}, argumentHandler)
  .demandCommand(1, 1, "You need at least one command to run.")
  .option("a", {
    alias: "alias",
    nargs: 1,
    describe: "Alias name",
    type: "string",
    requiresArg: true,
  })
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .epilog("Copyright Nquiringminds Ltd. 2019")
  .wrap(102)
  .argv;

module.exports = argv;
