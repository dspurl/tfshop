"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bedrock_client_1 = require("@ephox/bedrock-client");
var Utils_1 = require("src/main/ts/Utils");
bedrock_client_1.UnitTest.test('UtilsTest', function () {
    var checkValidKey = function (key, expected) {
        var actual = Utils_1.isValidKey(key);
        bedrock_client_1.assert.eq(expected, actual);
    };
    checkValidKey('onKeyUp', true);
    checkValidKey('onkeyup', true);
    checkValidKey('onDisable', false);
});
