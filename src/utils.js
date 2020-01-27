const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const {TDX_TOKEN, TDX_SECRET} = require("./constants");

function base64ToJson(baseString) {
  return JSON.parse(Buffer.from(baseString, "base64").toString());
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
  setEnv,
  toEnvString,
  getTdxKeys,
  getTdxTokens,
  getTdxSecrets,
  filterKeyIdentifiers,
};
