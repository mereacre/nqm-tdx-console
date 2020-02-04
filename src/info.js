const nqmUtils = require("@nqminds/nqm-core-utils");
const jwt = require("jsonwebtoken");

function getAccountInfo(api) {
  const decoded = jwt.decode(api.accessToken);
  return api.getAccount(decoded.sub);
}

function getServerFolderId(id) {
  return nqmUtils.shortHash(
    nqmUtils.constants.applicationServerDataFolderPrefix + id
  );
}

function getDatabotsIds(api) {
 return api.getResources({baseType: /*nqmUtils.constants.databotResourceType*/"databot"}, {}, {});
}

async function getInfo({api, id, type}) {
  type = type || "";
  id = id || "";
  switch (type) {
    case "":
    case "account":
      return getAccountInfo(api);
    case "serverfolderid":
      return getServerFolderId(id);
    case "databotsid":
      return getDatabotsIds(api);
  }
}

module.exports = {
  getInfo,
};
