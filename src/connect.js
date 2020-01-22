module.exports = function() {
  "use strict";
  const utils = require("./utils");

  function connect(envConfig) {
    const tdxKeys = utils.getTdxKeys(envConfig);

    const tdxTokens = utils.getTdxTokens(tdxKeys);
    const tdxSecrets = utils.getTdxSecrets(tdxKeys);
  }

  return {
    connect,
  };
};
