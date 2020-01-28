const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const {TDX_TOKEN, TDX_SECRET} = require("./constants");

function getTokenAliasName(alias) {
  return `${TDX_TOKEN}_${aliasToEnv(alias)}`;
}

function getSecretAliasName(alias) {
  return `${TDX_SECRET}_${aliasToEnv(alias)}`;
}

function envToAlias(envAlias) {
  return envAlias.toLowerCase();
}

function aliasToEnv(alias) {
  return alias.toUpperCase();
}

function checkValidAlias(alias) {
  const aliasRegex = new RegExp("^[a-zA-z0-9_]+$");
  return aliasRegex.test(alias);
}

function base64ToJson(baseString) {
  return (!baseString) ? {} : JSON.parse(Buffer.from(baseString, "base64").toString());
}

function jsonToBase64(json) {
  return Buffer.from(JSON.stringify(json)).toString("base64");
}

function filterKeyIdentifiers(envKeys, identifier) {
  const filteredKeys = {};

  Object.keys(envKeys).forEach((key) => {
    if (key.indexOf(`${identifier}_`) === 0) {
      const alias = key.slice(identifier.length + 1);
      if (alias !== "")
        filteredKeys[alias] = envKeys[key];
    }
  });

  return filteredKeys;
}

function getTdxKeys(envConfig) {
  const tdxKeys = {};
  Object.keys(envConfig).forEach((key) => {
    if (key.indexOf("TDX_") === 0)
      tdxKeys[key] = envConfig[key];
  });
  return tdxKeys;
}

function getTdxTokens(tdxKeys) {
  return filterKeyIdentifiers(tdxKeys, TDX_TOKEN);
}

function getTdxSecrets(tdxKeys) {
  const tdxSecrets = {};
  const filteredKeys = filterKeyIdentifiers(tdxKeys, TDX_SECRET);

  Object.keys(filteredKeys).forEach((key) => {
    tdxSecrets[key] = base64ToJson(filteredKeys[key]);
  });
  return tdxSecrets;
}

function getEnvPath(envFile = ".env") {
  return path.resolve(process.cwd(), envFile);
}

function toEnvString(envConfig) {
  let envString = "";

  Object.keys(envConfig).forEach((key) => {
    envString = `${envString}${key}=${envConfig[key]}\n`;
  });

  return envString;
}

function readEnv(envPath) {
  return dotenv.parse(fs.readFileSync(envPath));
}

function writeEnv(envConfig, envPath) {
  const envString = toEnvString(envConfig);
  fs.writeFileSync(envPath, envString);
}

function setEnv(key, value) {
  const envPath = getEnvPath();
  const envConfig = readEnv(envPath);

  envConfig[key] = value;

  writeEnv(envConfig, envPath);
}

module.exports = {
  base64ToJson,
  jsonToBase64,
  getTokenAliasName,
  getSecretAliasName,
  envToAlias,
  aliasToEnv,
  checkValidAlias,
  setEnv,
  toEnvString,
  getTdxKeys,
  getTdxTokens,
  getTdxSecrets,
  filterKeyIdentifiers,
};
