module.exports = function() {
  "use strict";

  function connect(envConfig) {
    const tdxKeys = getTdxKeys(envConfig);

    const tdxTokens = getTdxTokens(tdxKeys);
    const tdxSecrets = getTdxSecrets(tdxKeys);
  }

  return {
    connect,
  };
};
