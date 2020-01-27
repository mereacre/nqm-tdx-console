const scraper = require("../src/scraper");
const connect = require("../src/connect");
const signin = require("../src/signin");

jest.mock("../src/scraper");
jest.mock("../src/connect");

test("signin should call webSignin function type=web", async() => {
  const apiMock = {accessToken: "12345"};
  connect.connectWithToken.mockResolvedValue(apiMock);
  scraper.getUserToken.mockResolvedValue({token: "12345", browser: {close: () => {}}});
  const output = await signin.signin({
    config: {},
    tokenHref: "",
    secret: {},
    type: "web",
  });

  expect(output).toEqual(apiMock);
});

test("signin should call secretSignin function type=secret", async() => {
  const apiMock = {accessToken: "54321"};
  connect.connectWithSecret.mockResolvedValue(apiMock);

  const output = await signin.signin({
    config: {},
    tokenHref: "",
    secret: {},
    type: "secret",
  });

  expect(output).toEqual(apiMock);
});
