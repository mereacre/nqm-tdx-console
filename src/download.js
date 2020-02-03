const fs = require("fs");

async function getResourceStream(resourceId, api) {
  const output = await api.downloadResource(resourceId);
  if (output.status === 200) return output.body;
  else throw Error(output.statusText);
}

async function downloadToFile(resourceStream, filename) {
  const file = fs.createWriteStream(filename);
  resourceStream.pipe(file);
}

async function streamToOutput(resourceStream) {
  resourceStream.pipe(process.stdout);
}

async function downloadResource({id, name, api}) {
  const resourceStream = await getResourceStream(id, api);
  if (name) return downloadToFile(resourceStream, name);
  else streamToOutput(resourceStream);
}

module.exports = {
  downloadResource,
};
