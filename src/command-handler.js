"use strict";

const {
  aliasToEnv,
  getSecretAliasName,
  getTokenAliasName,
  setEnv,
  jsonToBase64,
  base64ToJson,
} = require("./utils");
const {connect} = require("./connect");
const {signin} = require("./src/signin");
const {TDX_CURRENT_ALIAS} = require("./constants");

class CommandHandler {
  constructor({alias, tokenHref, config}) {
    this.alias = alias;
    this.tokenHref = tokenHref;
    this.config = config;
  }

  async handleConnect(secret, token) {
    secret = base64ToJson(secret || "");
    token = token || "";
    const api = await connect({config: this.config, secret, token});

    return api;
  }

  async handleSignin(secret) {
    if (!secret.id) await this.handleWebSignin();
    else await this.handleSecretSignin(secret);

    setEnv(TDX_CURRENT_ALIAS, aliasToEnv(this.alias));
  }

  async handleWebSignin() {
    const api = await signin({
      config: this.config,
      tokenHref: this.tokenHref,
      type: "web",
    });
    setEnv(getTokenAliasName(this.alias), api.accessToken);
  }

  async handleSecretSignin(secret) {
    const api = await signin({
      config: this.config,
      secret,
      type: "secret",
    });
    setEnv(getTokenAliasName(this.alias), api.accessToken);
    setEnv(getSecretAliasName(this.alias), jsonToBase64(secret));
  }
}

module.exports = CommandHandler;
