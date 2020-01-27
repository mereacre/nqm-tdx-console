"use strict";

require("dotenv").config();

const appConfig = require("./config.json");
const {TDX_CURRENT_ALIAS} = require("./src/constants");
const {
  checkValidAlias,
  envToAlias,
  aliasToEnv,
  getSecretAliasName,
  getTokenAliasName,
  setEnv,
  jsonToBase64,
  base64ToJson} = require("./src/utils");
const {signin} = require("./src/signin");
const {connect} = require("./src/connect");

async function argumentHandler(argv) {
  const command = argv._[0];
  const commandProps = {
    alias: argv.alias || "",
    id: argv.id || "",
    secret: argv.secret || "",
  };

  await run(command, commandProps);
}

async function handleWebSignin({config, tokenHref, alias}) {
  const api = await signin({config, tokenHref, type: "web"});
  setEnv(getTokenAliasName(alias), api.accessToken);
}

async function handleSecretSignin({config, secret, alias}) {
  const api = await signin({config, secret, type: "secret"});
  setEnv(getTokenAliasName(alias), api.accessToken);
  setEnv(getSecretAliasName(alias), jsonToBase64(secret));
}

async function handleSignin({config, tokenHref, secret, alias}) {
  if (!secret.id) await handleWebSignin({config, tokenHref, alias});
  else await handleSecretSignin({config, secret, alias});

  setEnv(TDX_CURRENT_ALIAS, aliasToEnv(alias));
}

async function handleConnect({config, secret, token}) {
  secret = base64ToJson(secret || "");
  token = token || "";
  const api = await connect({config, secret, token});

  return api;
}

async function run(commandName, commandProps) {
  const envAlias = envToAlias(process.env[TDX_CURRENT_ALIAS] || "");
  const commandAlias = commandProps.alias;
  const alias = (commandAlias === "") ? envAlias : commandAlias;

  try {
    if (!alias) throw Error("No alias defined.");
    if (!checkValidAlias(alias)) throw Error("Wrong alias name. Only allowed [a-zA-Z0-9_]");

    const tdxConfig = appConfig.tdxConfigs[alias] || {};

    switch (commandName) {
      case "signin":
        await handleSignin({
          config: tdxConfig.config,
          tokenHref: tdxConfig.tokenHref,
          secret: {id: commandProps.id, secret: commandProps.secret},
          alias,
        });
        break;
      case "connect":
        await handleConnect({
          config: tdxConfig.config,
          secret: process.env[getSecretAliasName(alias)],
          token: process.env[getTokenAliasName(alias)],
        });
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
