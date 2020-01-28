"use strict";

const {connect} = require("./connect");
const {signin} = require("./signin");
const jwt = require("jsonwebtoken");

class CommandHandler {
  constructor({tdxConfig, secret, token}) {
    this.tokenHref = tdxConfig.tokenHref || "";
    this.config = tdxConfig.config || {};
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
    const api = await signin({
      config: this.config,
      tokenHref: this.tokenHref,
      type: "web",
    });
    return api;
  }

  async handleSecretSignin(secret) {
    const api = await signin({
      config: this.config,
      secret,
      type: "secret",
    });
    return api;
  }

  handleSignout() {
    this.accessToken = "";
    this.secret = {};
  }

  async handleRun(command, args) {
    return {};
  }

  async handleInfo() {
    const api = await this.handleConnect();
    const decoded = jwt.decode(this.accessToken);
    const output = await api.getAccount(decoded.sub);

    return output;
  }
}

module.exports = CommandHandler;
