// const CommandHandler = require("../src/command-handler");
// const {TDX_TOKEN, TDX_SECRET, TDX_CURRENT_ALIAS} = require("../src/constants");
// const connect = require("../src/connect");
// const signin = require("../src/signin");
// const utils = require("../src/utils");

// jest.mock("../src/signin");
// jest.mock("../src/connect");
// jest.mock("../src/utils");

// const {
//   base64ToJson,
//   getTokenAliasName,
//   getSecretAliasName,
//   jsonToBase64,
//   aliasToEnv,
// } = jest.requireActual("../src/utils");

// beforeEach(() => {
//   // Clear all instances and calls to constructor and all methods:
//   connect.connect.mockClear();
//   signin.signin.mockClear();
//   utils.setEnv.mockClear();
// });


// test("handleConnect should call connect with secret={id: '1', secret: '2'} and token='12345'", async() => {
//   const alias = "nqminds";
//   const tdxConfigs = {[alias]: {config: {"a": "b"}, tokenHref: "nqminds.com"}};
//   const secret = {id: "1", secret: "2"};
//   const token = "12345";
//   utils.base64ToJson.mockImplementation(base64ToJson);
//   connect.connect.mockResolvedValue({});
//   const commandHandler = new CommandHandler({tdxConfigs, alias, secret, token});

//   await commandHandler.handleConnect(secret, token);

//   expect(connect.connect.mock.calls[0][0]).toEqual({config: tdxConfigs[alias].config, secret: {id: "1", secret: "2"}, token});
// });

// test(`handleConnect should call setEnv('${TDX_TOKEN}_NQMINDS', '12345')`, async() => {
//   const config = {"a": "b"};
//   const alias = "nqminds";
//   const tokenHref = "nqminds.com";
//   const secret = "eyJpZCI6IjEiLCJzZWNyZXQiOiIyIn0=";
//   const token = "12345";
//   utils.getTokenAliasName.mockImplementation(getTokenAliasName);
//   utils.setEnv.mockReturnValue({});
//   connect.connect.mockResolvedValue({accessToken: token});
//   const commandHandler = new CommandHandler({config, alias, tokenHref});

//   await commandHandler.handleConnect(secret, token);

//   expect(utils.setEnv.mock.calls[0][0]).toBe(`${TDX_TOKEN}_NQMINDS`);
//   expect(utils.setEnv.mock.calls[0][1]).toBe("12345");
// });

// test(`handleWebSignin should call setEnv('${TDX_TOKEN}_NQMINDS', '12345')`, async() => {
//   const config = {"a": "b"};
//   const alias = "nqminds";
//   const tokenHref = "nqminds.com";
//   const token = "12345";
//   utils.getTokenAliasName.mockImplementation(getTokenAliasName);
//   utils.setEnv.mockReturnValue({});
//   signin.signin.mockResolvedValue({accessToken: token});
//   const commandHandler = new CommandHandler({config, alias, tokenHref});

//   await commandHandler.handleWebSignin();

//   expect(utils.setEnv.mock.calls[0][0]).toBe(`${TDX_TOKEN}_NQMINDS`);
//   expect(utils.setEnv.mock.calls[0][1]).toBe("12345");
// });

// test(`handleSecretSignin should call setEnv('${TDX_TOKEN}_NQMINDS', '12345') and setEnv('${TDX_SECRET}_NQMINDS', 'eyJpZCI6IjEiLCJzZWNyZXQiOiIyIn0=')`, async() => {
//   const config = {"a": "b"};
//   const alias = "nqminds";
//   const tokenHref = "nqminds.com";
//   const token = "12345";
//   const secret = {id: "1", secret: "2"};
//   utils.getTokenAliasName.mockImplementation(getTokenAliasName);
//   utils.getSecretAliasName.mockImplementation(getSecretAliasName);
//   utils.jsonToBase64.mockImplementation(jsonToBase64);
//   utils.setEnv.mockReturnValue({});
//   signin.signin.mockResolvedValue({accessToken: token});
//   const commandHandler = new CommandHandler({config, alias, tokenHref});

//   await commandHandler.handleSecretSignin(secret);

//   expect(utils.setEnv.mock.calls[0][0]).toBe(`${TDX_TOKEN}_NQMINDS`);
//   expect(utils.setEnv.mock.calls[0][1]).toBe("12345");
//   expect(utils.setEnv.mock.calls[1][0]).toBe(`${TDX_SECRET}_NQMINDS`);
//   expect(utils.setEnv.mock.calls[1][1]).toBe("eyJpZCI6IjEiLCJzZWNyZXQiOiIyIn0=");
// });

// test(`handleSignin should call setEnv('${TDX_CURRENT_ALIAS}', 'NQMINDS')`, async() => {
//   const config = {"a": "b"};
//   const alias = "nqminds";
//   const tokenHref = "nqminds.com";
//   const secret = {id: "1", secret: "2"};
//   utils.aliasToEnv.mockImplementation(aliasToEnv);
//   utils.setEnv.mockReturnValue({});

//   const commandHandler = new CommandHandler({config, alias, tokenHref});
//   commandHandler.handleWebSignin = jest.fn();
//   commandHandler.handleSecretSignin = jest.fn();
//   await commandHandler.handleSignin(secret);

//   expect(utils.setEnv.mock.calls[0][0]).toBe(TDX_CURRENT_ALIAS);
//   expect(utils.setEnv.mock.calls[0][1]).toBe("NQMINDS");
// });

// test(`handleSignout should call setEnv('${TDX_TOKEN}_NQMINDS', '')`, async() => {
//   const config = {"a": "b"};
//   const alias = "nqminds";
//   const tokenHref = "nqminds.com";
//   utils.getTokenAliasName.mockImplementation(getTokenAliasName);
//   utils.setEnv.mockReturnValue({});

//   const commandHandler = new CommandHandler({config, alias, tokenHref});
//   await commandHandler.handleSignout();

//   expect(utils.setEnv.mock.calls[0][0]).toBe(`${TDX_TOKEN}_NQMINDS`);
//   expect(utils.setEnv.mock.calls[0][1]).toBe("");
// });
