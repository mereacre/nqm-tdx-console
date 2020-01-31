/* eslint-disable max-len */
/* eslint-disable no-undef */

const runapi = require("../src/runapi");
const apiCommands = require("../src/tdx-api-commands");

test("runApi should return apiCommands for name === ''", async() => {
  const output = await runapi.runApi({name: ""});
  expect(output).toEqual(apiCommands);
});

test("runApi should throw an exception if name is not in apiCommands", async() => {
  try {
    await runapi.runApi({name: "test"});
  } catch (error) {
    expect(error).toEqual(Error("Unknow API command."));
  }
});

test("objectToListMapper should return [['1', 1], ['2', 2], ['3', 3]] for {'2': {}, '1': {}, '3': {}}", async() => {
  const output = runapi.objectToListMapper({"2": {}, "1": {}, "3": {}});
  expect(output).toEqual([["1", 1], ["2", 2], ["3", 3]]);
});

test("getFunctionArguments should return [{'a': 2}, null, null, 'test'] for {'4': 'test', '1': {'a': 2}}", async() => {
  const output = runapi.getFunctionArguments({"4": "test", "1": {"a": 2}});
  expect(output).toEqual([{"a": 2}, null, null, "test"]);
});

test("getFunctionArguments should return [] for {}", async() => {
  const output = runapi.getFunctionArguments({});
  expect(output).toEqual([]);
});

test("getFunctionArguments should return [null, null, 'test', 2] for {'3': 'test', '4': 2}", async() => {
  const output = runapi.getFunctionArguments({"3": "test", "4": 2});
  expect(output).toEqual([null, null, "test", 2]);
});

test("stringifyArgumentValue should stringify the value of key list ['1','a', 'd'] in {'1': {'a': {'d': 3}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": 3}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["1", "a", "d"]);
  expect(input).toEqual({"1": {"a": {"d": "3"}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list ['1','a', 'd'] in {'1': {'a': {'d': '3'}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": "3"}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["1", "a", "d"]);
  expect(input).toEqual({"1": {"a": {"d": "3"}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list ['1','a', 'd'] in {'1': {'a': {'d': {}}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": {}}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["1", "a", "d"]);
  expect(input).toEqual({"1": {"a": {"d": {}}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list ['1','a', 'd'] in {'1': {'a': {'d': [1,2,3]}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": [1, 2, 3]}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["1", "a", "d"]);
  expect(input).toEqual({"1": {"a": {"d": [1, 2, 3]}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list ['1','a', 'b'] in {'1': {'a': {'d': [1,2,3]}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": 3}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["1", "a", "b"]);
  expect(input).toEqual({"1": {"a": {"d": 3}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list [] in {'1': {'a': {'d': [1,2,3]}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": 3}}, "2": 4};
  runapi.stringifyArgumentValue(input, []);
  expect(input).toEqual({"1": {"a": {"d": 3}}, "2": 4});
});

test("stringifyArgumentValue should stringify the value of key list ['2'] in {'1': {'a': {'d': [1,2,3]}}, '2': 4}", async() => {
  const input = {"1": {"a": {"d": 3}}, "2": 4};
  runapi.stringifyArgumentValue(input, ["2"]);
  expect(input).toEqual({"1": {"a": {"d": 3}}, "2": "4"});
});

test("stringifyArguments should stringify the value of args stringify ['1.a.d', '2', '3.h'] in {'1': {'a': {'d': 67}}, '2': 4, '3': {'h': 1234782}}", async() => {
  const apiArgs = {
    "1": {"a": {"d": 67}},
    "2": 4,
    "3": {"h": 1234782},
  };
  const output = {
    "1": {"a": {"d": "67"}},
    "2": "4",
    "3": {"h": "1234782"},
  };
  runapi.stringifyArguments(apiArgs, ["1.a.d", "2", "3.h"]);
  expect(apiArgs).toEqual(output);
});

test("stringifyArguments should stringify the value of args stringify ['1.a.d', '2', '3.h'] in {}", async() => {
  const apiArgs = {};
  const output = {};
  runapi.stringifyArguments(apiArgs, ["1.a.d", "2", "3.h"]);
  expect(apiArgs).toEqual(output);
});

test("stringifyArguments should stringify the value of args stringify [] in {'1': {'a': {'d': 67}}, '2': 4, '3': {'h': 1234782}}", async() => {
  const apiArgs = {
    "1": {"a": {"d": 67}},
    "2": 4,
    "3": {"h": 1234782},
  };
  const output = {
    "1": {"a": {"d": 67}},
    "2": 4,
    "3": {"h": 1234782},
  };
  runapi.stringifyArguments(apiArgs, []);
  expect(apiArgs).toEqual(output);
});

test("getFullArgs should return [{'a': {'d': '67'}}, '4', {'h': '1234782'}]", async() => {
  const apiArgs = {
    "1": {"a": {"d": 67}},
    "2": 4,
    "3": {"h": 1234782},
  };
  const apiArgsStringify = ["1.a.d", "2", "3.h"];
  const output = runapi.getFullArgs(apiArgs, apiArgsStringify);
  expect(output).toEqual([{"a": {"d": "67"}}, "4", {"h": "1234782"}]);
});

test("getFullArgs should return [{'a': {'d': '67'}}, '4', null, null, {'h': 1234782}]", async() => {
  const apiArgs = {
    "1": {"a": {"d": 67}},
    "2": 4,
    "5": {"h": 1234782},
  };
  const apiArgsStringify = ["1.a.d", "2"];
  const output = runapi.getFullArgs(apiArgs, apiArgsStringify);
  expect(output).toEqual([{"a": {"d": "67"}}, "4", null, null, {"h": 1234782}]);
});

test("getFullArgs should return []", async() => {
  const apiArgs = {};
  const apiArgsStringify = ["1.a.d", "2"];
  const output = runapi.getFullArgs(apiArgs, apiArgsStringify);
  expect(output).toEqual([]);
});

test("getFullArgs should return ['']", async() => {
  const apiArgs = {
    "1": "",
  };
  const apiArgsStringify = [];
  const output = runapi.getFullArgs(apiArgs, apiArgsStringify);
  expect(output).toEqual([""]);
});
