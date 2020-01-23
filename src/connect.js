module.exports = function(envConfig, tdxConfigs) {
  "use strict";

  const utils = require("./utils");
  const TDXApi = require("@nqminds/nqm-api-tdx");

  function connectWithToken(config, token) {
    config.accessToken = token;
    return new TDXApi(config);
  }

  async function connectWithSecret(config, secret) {
    const api = new TDXApi(config);
    await api.authenticate(secret.id, secret.secret);
    return api;
  }

  async function connect(alias) {
    const aliasUpper = alias.toUpperCase();
    const tdxKeys = utils.getTdxKeys(envConfig);
    const tdxTokens = utils.getTdxTokens(tdxKeys);
    const tdxSecrets = utils.getTdxSecrets(tdxKeys);

    const config = tdxConfigs[aliasUpper];

    if (aliasUpper in tdxTokens) {
      return connectWithToken(config, tdxTokens[aliasUpper]);
    } else if (aliasUpper in tdxSecrets) {
      return connectWithSecret(config, tdxSecrets[aliasUpper]);
    } else throw Error("No tdx credentials present!");
  }

  return {
    connect,
    connectWithToken,
    connectWithSecret,
  };
};
