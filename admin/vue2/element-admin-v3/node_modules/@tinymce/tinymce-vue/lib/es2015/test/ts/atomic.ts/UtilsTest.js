import { UnitTest, assert } from '@ephox/bedrock-client';
import { isValidKey } from 'src/main/ts/Utils';
UnitTest.test('UtilsTest', function () {
    var checkValidKey = function (key, expected) {
        var actual = isValidKey(key);
        assert.eq(expected, actual);
    };
    checkValidKey('onKeyUp', true);
    checkValidKey('onkeyup', true);
    checkValidKey('onDisable', false);
});
