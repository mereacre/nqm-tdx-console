"use strict";

const {webWindowSignin, secretSignin, connect} = require("./signin");
const jwt = require("jsonwebtoken");
const {runApi} = require("./runapi");
const {downloadResource} = require("./download");

class CommandHandler {
  constructor({tdxConfig, secret, token, timeout}) {
    this.tokenHref = tdxConfig.tokenHref || "";
    this.config = tdxConfig.config || {};
    this.timeout = timeout || 5000;
    this.secret = secret || {};
    this.accessToken = token || "";
  }

  getToken() {
    return this.accessToken;
  }

  async handleConnect() {
    const api = await connect({
      config: this.config,
      secret: this.secret,
      token: this.accessToken,
    });

    this.accessToken = api.accessToken;

    return api;
  }

  async handleSignin(secret) {
    const api = (secret.id) ? await this.handleSecretSignin(secret) :
      await this.handleWebSignin();

    this.accessToken = api.accessToken;

    return api;
  }

  async handleWebSignin() {
    const api = await webWindowSignin(this.config, this.tokenHref);
    return api;
  }

  async handleSecretSignin(secret) {
    const api = await secretSignin({
      config: this.config,
      tokenHref: this.tokenHref,
      timeout: this.timeout,
      secret,
    });
    return api;
  }

  handleSignout() {
    this.accessToken = "";
    this.secret = {};
  }

  async handleRunApi({name, apiArgs, apiArgsStringify}) {
    const api = await this.handleConnect();
    return runApi({name, apiArgs, apiArgsStringify, api});
  }

  async handleInfo() {
    const api = await this.handleConnect();
    const decoded = jwt.decode(this.accessToken);
    const output = await api.getAccount(decoded.sub);

    return output;
  }

  async handleDownload(id, name) {
    const api = await this.handleConnect();
    const output = await downloadResource({id, name, api});

    return output;
  }
}

module.exports = CommandHandler;
