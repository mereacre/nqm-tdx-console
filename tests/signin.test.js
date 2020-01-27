const signin = require("../src/signin");

test("signin should call webSignin function type=web", async() => {
  signin.webSignin = jest.fn();
  await signin.signin({
    config: {},
    tokenHref: "",
    secret: {},
    type: "web",
  });

  expect(signin.webSignin.mock.calls.length).toBe(1);
});

test("signin should call secretSignin function type=secret", async() => {
  signin.secretSignin = jest.fn();
  await signin.signin({
    config: {},
    tokenHref: "",
    secret: {},
    type: "secret",
  });

  expect(signin.secretSignin.mock.calls.length).toBe(1);
});
