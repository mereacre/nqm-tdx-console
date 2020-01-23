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

  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
