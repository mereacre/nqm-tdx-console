const utils = require("../src/utils");
const {TDX_TOKEN, TDX_SECRET} = require("../src/constants");

test("toEnvString should return the string 'key=value\\n' for {key: value}", () => {
  const input = {"key": "value"};
  const output = utils.toEnvString(input);
  expect(output).toEqual("key=value\n");
});

test("toEnvString should return the string '\\n' for {}", () => {
  const input = {};
  const output = utils.toEnvString(input);
  expect(output).toEqual("");
});

test("toEnvString should return the string 'a=1\\nc=2\\n' for {a:1, c:2}", () => {
  const input = {a: 1, c: 2};
  const output = utils.toEnvString(input);
  expect(output).toEqual("a=1\nc=2\n");
});

test("getTdxKeys should return {} for {}", () => {
  const input = {};
  const output = utils.getTdxKeys(input);
  expect(output).toStrictEqual({});
});

test("getTdxKeys should return {TDX_KEY_1: 'TDX_VALUE_1'} for {TDX_KEY_1: 'TDX_VALUE_1'}", () => {
  const input = {"TDX_KEY_1": "TDX_VALUE_1"};
  const output = utils.getTdxKeys(input);
  expect(output).toStrictEqual({"TDX_KEY_1": "TDX_VALUE_1"});
});

test("getTdxKeys should return {TDX_KEY_1: 'TDX_VALUE_1'} for {TDX_KEY_1: 'TDX_VALUE_1', a: 1}", () => {
  const input = {"TDX_KEY_1": "TDX_VALUE_1", a: 1};
  const output = utils.getTdxKeys(input);
  expect(output).toStrictEqual({"TDX_KEY_1": "TDX_VALUE_1"});
});

test("getTdxKeys should return {} for {a: 1}", () => {
  const input = {a: 1};
  const output = utils.getTdxKeys(input);
  expect(output).toStrictEqual({});
});

test("filterKeyIdentifiers should return {} for {} and identifier=TDX_TEST", () => {
  const input = {};
  const output = utils.filterKeyIdentifiers(input, "TEST");
  expect(output).toStrictEqual({});
});

test("filterKeyIdentifiers should return {'1_2': 'value'} for {'TDX_TEST_1_2': 'value'} and identifier=TDX_TEST", () => {
  const input = {"TDX_TEST_1_2": "value"};
  const output = utils.filterKeyIdentifiers(input, "TDX_TEST");
  expect(output).toStrictEqual({"1_2": "value"});
});

test("filterKeyIdentifiers should return {} for {'TDX_TEST_': 'value'} and identifier=TDX_TEST", () => {
  const input = {"TDX_TEST_": "value"};
  const output = utils.filterKeyIdentifiers(input, "TDX_TEST");
  expect(output).toStrictEqual({});
});

test("filterKeyIdentifiers should return {} for {'TDX_TEST': 'value'} and identifier=TDX_TEST", () => {
  const input = {"TDX_TEST": "value"};
  const output = utils.filterKeyIdentifiers(input, "TDX_TEST");
  expect(output).toStrictEqual({});
});

test("getTdxTokens should return {} for {}", () => {
  const input = {};
  const output = utils.getTdxTokens(input);
  expect(output).toStrictEqual({});
});

test(`getTdxTokens should return {ALIAS: 'token_value'} for {${TDX_TOKEN}_ALIAS: 'token_value'}`, () => {
  const input = {[`${TDX_TOKEN}_ALIAS`]: "token_value"};
  const output = utils.getTdxTokens(input);
  expect(output).toStrictEqual({ALIAS: "token_value"});
});

test("getTdxSecrets should return {} for {}", () => {
  const input = {};
  const output = utils.getTdxSecrets(input);
  expect(output).toStrictEqual({});
});

test(`getTdxSecrets should return {ALIAS: {a: 'b'}} for {${TDX_SECRET}_ALIAS: {a: 'b'}}`, () => {
  const input = {[`${TDX_SECRET}_ALIAS`]: Buffer.from(JSON.stringify({a: "b"})).toString("base64")};
  const output = utils.getTdxSecrets(input);
  expect(output).toStrictEqual({ALIAS: {a: "b"}});
});

test(`checkValidAlias should return true on nqminds`, () => {
  const output = utils.checkValidAlias("nqminds");
  expect(output).toBe(true);
});

test(`checkValidAlias should return false on empty input`, () => {
  const output = utils.checkValidAlias("");
  expect(output).toBe(false);
});

test(`checkValidAlias should return false on nq-m`, () => {
  const output = utils.checkValidAlias("nq-m");
  expect(output).toBe(false);
});

test(`checkValidAlias should return true on nq_m`, () => {
  const output = utils.checkValidAlias("nq_m");
  expect(output).toBe(true);
});
