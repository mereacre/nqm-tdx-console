const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

function getEnvPath(envFile = ".env") {
  return path.resolve(process.cwd(), envFile);
}

function toEnvString(envConfig) {
  let envString = "";

  Object.keys(envConfig).forEach((key) => {
    envString = `${key}=${envConfig[key]}\n`;
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
};
