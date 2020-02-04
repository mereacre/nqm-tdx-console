const {
  checkValidAlias,
  writeJsonToFile,
} = require("./utils");

function listAliases(configs) {
  return Object.keys(configs);
}

async function copyAliasConfig({appConfig, sourceAlias, destinationAlias, configFileName}) {
  const aliases = listAliases(appConfig.tdxConfigs);
  if (destinationAlias === "" || !checkValidAlias(destinationAlias)) {
    throw Error("Invalid alias name.");
  }

  if (aliases.includes(destinationAlias)) {
    throw Error("Alias already exists.");
  } else {
    return modifyAliasConfig({
      appConfig,
      modifyAlias: destinationAlias,
      aliasConfig: appConfig.tdxConfigs[sourceAlias],
      configFileName,
    });
  }
}

async function modifyAliasConfig({appConfig, modifyAlias, aliasConfig, configFileName}) {
  appConfig.tdxConfigs[modifyAlias] = aliasConfig;
  return writeJsonToFile(appConfig, configFileName);
}

async function removeAliasConfig({appConfig, removeAlias, configFileName}) {
  if (!(removeAlias in appConfig.tdxConfigs)) throw Error("Alias configuration deosn't exist.");
  delete appConfig.tdxConfigs[removeAlias];
  return writeJsonToFile(appConfig, configFileName);
}

module.exports = {
  listAliases,
  copyAliasConfig,
  modifyAliasConfig,
  removeAliasConfig,
};
