import { Chain, Log, Pipeline, Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Strings, Global } from '@ephox/katamari';
import { SelectorFilter, Attr, Remove } from '@ephox/sugar';
import { cRender, cRemove } from '../alien/Loader';
import { ScriptLoader } from '../../../main/ts/ScriptLoader';
UnitTest.asynctest('LoadTinyTest', function (success, failure) {
    var cDeleteTinymce = Chain.op(function () {
        ScriptLoader.reinitialize();
        delete Global.tinymce;
        delete Global.tinyMCE;
        var hasTinymceUri = function (attrName) { return function (elm) {
            return Attr.getOpt(elm, attrName).exists(function (src) { return Strings.contains(src, 'tinymce'); });
        }; };
        var elements = Arr.flatten([
            Arr.filter(SelectorFilter.all('script'), hasTinymceUri('src')),
            Arr.filter(SelectorFilter.all('link'), hasTinymceUri('href')),
        ]);
        Arr.each(elements, Remove.remove);
    });
    var cAssertTinymceVersion = function (version) { return Chain.op(function () {
        Assertions.assertEq("Loaded version of TinyMCE should be " + version, version, Global.tinymce.majorVersion);
    }); };
    Pipeline.async({}, [
        Log.chainsAsStep('Should be able to load local version of TinyMCE using the tinymceScriptSrc prop', '', [
            cDeleteTinymce,
            cRender({}, "\n        <editor\n          :init=\"init\"\n          tinymce-script-src=\"/project/node_modules/tinymce-5/tinymce.min.js\"\n        ></editor>\n      "),
            cAssertTinymceVersion('5'),
            cRemove,
            cDeleteTinymce,
            cRender({}, "\n        <editor\n          :init=\"init\"\n          tinymce-script-src=\"/project/node_modules/tinymce-4/tinymce.min.js\"\n        ></editor>\n      "),
            cAssertTinymceVersion('4'),
            cRemove,
            cDeleteTinymce,
        ]),
        Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '', [
            cRender({}, "\n        <editor\n          :init=\"init\"\n          api-key=\"a-fake-api-key\"\n          cloud-channel=\"5-dev\"\n        ></editor>\n      "),
            cAssertTinymceVersion('5'),
            Chain.op(function () {
                Assertions.assertEq('TinyMCE should have been loaded from Cloud', 'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/5-dev', Global.tinymce.baseURI.source);
            }),
            cRemove,
            cDeleteTinymce
        ]),
    ], success, failure);
});
