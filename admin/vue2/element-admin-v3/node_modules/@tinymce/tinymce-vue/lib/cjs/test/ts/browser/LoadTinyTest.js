"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agar_1 = require("@ephox/agar");
var bedrock_client_1 = require("@ephox/bedrock-client");
var katamari_1 = require("@ephox/katamari");
var sugar_1 = require("@ephox/sugar");
var Loader_1 = require("../alien/Loader");
var ScriptLoader_1 = require("../../../main/ts/ScriptLoader");
bedrock_client_1.UnitTest.asynctest('LoadTinyTest', function (success, failure) {
    var cDeleteTinymce = agar_1.Chain.op(function () {
        ScriptLoader_1.ScriptLoader.reinitialize();
        delete katamari_1.Global.tinymce;
        delete katamari_1.Global.tinyMCE;
        var hasTinymceUri = function (attrName) { return function (elm) {
            return sugar_1.Attr.getOpt(elm, attrName).exists(function (src) { return katamari_1.Strings.contains(src, 'tinymce'); });
        }; };
        var elements = katamari_1.Arr.flatten([
            katamari_1.Arr.filter(sugar_1.SelectorFilter.all('script'), hasTinymceUri('src')),
            katamari_1.Arr.filter(sugar_1.SelectorFilter.all('link'), hasTinymceUri('href')),
        ]);
        katamari_1.Arr.each(elements, sugar_1.Remove.remove);
    });
    var cAssertTinymceVersion = function (version) { return agar_1.Chain.op(function () {
        agar_1.Assertions.assertEq("Loaded version of TinyMCE should be " + version, version, katamari_1.Global.tinymce.majorVersion);
    }); };
    agar_1.Pipeline.async({}, [
        agar_1.Log.chainsAsStep('Should be able to load local version of TinyMCE using the tinymceScriptSrc prop', '', [
            cDeleteTinymce,
            Loader_1.cRender({}, "\n        <editor\n          :init=\"init\"\n          tinymce-script-src=\"/project/node_modules/tinymce-5/tinymce.min.js\"\n        ></editor>\n      "),
            cAssertTinymceVersion('5'),
            Loader_1.cRemove,
            cDeleteTinymce,
            Loader_1.cRender({}, "\n        <editor\n          :init=\"init\"\n          tinymce-script-src=\"/project/node_modules/tinymce-4/tinymce.min.js\"\n        ></editor>\n      "),
            cAssertTinymceVersion('4'),
            Loader_1.cRemove,
            cDeleteTinymce,
        ]),
        agar_1.Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '', [
            Loader_1.cRender({}, "\n        <editor\n          :init=\"init\"\n          api-key=\"a-fake-api-key\"\n          cloud-channel=\"5-dev\"\n        ></editor>\n      "),
            cAssertTinymceVersion('5'),
            agar_1.Chain.op(function () {
                agar_1.Assertions.assertEq('TinyMCE should have been loaded from Cloud', 'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/5-dev', katamari_1.Global.tinymce.baseURI.source);
            }),
            Loader_1.cRemove,
            cDeleteTinymce
        ]),
    ], success, failure);
});
