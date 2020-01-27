const connect = require("../src/connect");
const TDXApi = require("@nqminds/nqm-api-tdx");

const mockAuthenticate = jest.fn();
jest.mock("@nqminds/nqm-api-tdx", () => {
  return jest.fn().mockImplementation(() => {
    return {authenticate: mockAuthenticate};
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  TDXApi.mockClear();
  mockAuthenticate.mockClear();
});

test("connectWithToken should return a tdx instace", () => {
  connect.connectWithToken({}, "");
  expect(TDXApi).toHaveBeenCalledTimes(1);
});

test("connectWithSecret should call the authenticate function", async() => {
  expect(TDXApi).not.toHaveBeenCalled();
  await connect.connectWithSecret({}, {id: "", secret: ""});
  expect(TDXApi).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate.mock.calls[0][0]).toEqual("");
});

test("connect should call connectWithToken function for a token env", async() => {
  const spy = jest.spyOn(connect, "connectWithToken");
  connect.connect({
    envConfig: {
      "TDX_TOKEN_ALIAS": "12345",
    },
    tdxConfigs: {
      "ALIAS": {},
    },
    alias: "ALIAS",
  });

  expect(spy).toHaveBeenCalledWith({}, "12345");
  spy.mockRestore();
});

test("connect should call connectWithSecret function for a token env", async() => {
  const secret = {a: "b"};
  const input = {TDX_SECRET_ALIAS: Buffer.from(JSON.stringify(secret)).toString("base64")};
  const spy = jest.spyOn(connect, "connectWithSecret");
  connect.connect({
    envConfig: input,
    tdxConfigs: {
      "ALIAS": {},
    },
    alias: "ALIAS",
  });

  expect(spy).toHaveBeenCalledWith({}, secret);
  spy.mockRestore();
});

test("connect should throw with empty alias", async() => {
  try {
    await connect.connect({
      envConfig: {
        "TDX_TOKEN_ALIAS": "12345",
      },
      tdxConfigs: {
        "ALIAS": {},
      },
      alias: "",
    });
  } catch (error) {
    expect(error).toEqual(Error("No tdx credentials present!"));
  }
});

test("connect should throw with an invalid alias", async() => {
  try {
    await connect.connect({
      envConfig: {
        "TDX_TOKEN_ALIAS1": "12345",
      },
      tdxConfigs: {
        "ALIAS2": {},
      },
      alias: "ALIAS3",
    });
  } catch (error) {
    expect(error).toEqual(Error("No tdx credentials present!"));
  }
});
