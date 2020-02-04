const nqmUtils = require("@nqminds/nqm-core-utils");

async function stopDatabot(api, id) {
  return api.stopDatabotInstance(id, nqmUtils.constants.stopDatabotInstance);
}

async function startDatabot({api, id, functionPayload}) {
  return api.startDatabotInstance(id, functionPayload);
}

module.exports = {
  stopDatabot,
  startDatabot,
};
