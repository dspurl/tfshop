"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agar_1 = require("@ephox/agar");
var bedrock_client_1 = require("@ephox/bedrock-client");
var miniature_1 = require("@tinymce/miniature");
var Loader_1 = require("../alien/Loader");
var sugar_1 = require("@ephox/sugar");
bedrock_client_1.UnitTest.asynctest('InitTest', function (success, failure) {
    var cFakeType = function (str) {
        return agar_1.Chain.op(function (context) {
            context.editor.getBody().innerHTML = '<p>' + str + '</p>';
            agar_1.Keyboard.keystroke(agar_1.Keys.space(), {}, sugar_1.Element.fromDom(context.editor.getBody()));
        });
    };
    var cChangeVar = function (varName, value) {
        return agar_1.Chain.op(function (context) {
            context.vm[varName] = value;
        });
    };
    var sTestVersion = function (version) { return miniature_1.VersionLoader.sWithVersion(version, agar_1.GeneralSteps.sequence([
        agar_1.Logger.t('Should be able to setup editor', agar_1.Chain.asStep({}, [
            Loader_1.cRender(),
            agar_1.Chain.op(function (context) {
                agar_1.Assertions.assertEq('Editor should not be inline', false, context.editor.inline);
            }),
            Loader_1.cRemove
        ])),
        agar_1.Logger.t('Should be able to setup editor', agar_1.Chain.asStep({}, [
            Loader_1.cRender({}, "<editor :init=\"init\" :inline=true ></editor>"),
            agar_1.Chain.op(function (context) {
                agar_1.Assertions.assertEq('Editor should be inline', true, context.editor.inline);
            }),
            Loader_1.cRemove
        ])),
        agar_1.Logger.t('Should be able to setup editor', agar_1.Chain.asStep({}, [
            Loader_1.cRender({ init: { inline: true } }),
            agar_1.Chain.op(function (context) {
                agar_1.Assertions.assertEq('Editor should be inline', true, context.editor.inline);
            }),
            Loader_1.cRemove
        ])),
        agar_1.Logger.t('Test one way binding tinymce-vue -> variable', agar_1.GeneralSteps.sequence([
            agar_1.Logger.t('Test outputFormat="text"', agar_1.Chain.asStep({}, [
                Loader_1.cRender({
                    content: undefined
                }, "\n            <editor\n              :init=\"init\"\n              v-on:input=\"content = $event\"\n              output-format=\"text\"\n            ></editor>\n          "),
                cFakeType('A'),
                agar_1.Chain.op(function (context) {
                    agar_1.Assertions.assertEq('Content emitted should be of format="text"', 'A', context.vm.content);
                }),
                Loader_1.cRemove
            ])),
            agar_1.Logger.t('Test outputFormat="html"', agar_1.Chain.asStep({}, [
                Loader_1.cRender({
                    content: undefined
                }, "\n            <editor\n              :init=\"init\"\n              v-on:input=\"content = $event\"\n              output-format=\"html\"\n            ></editor>\n          "),
                cFakeType('A'),
                agar_1.Chain.op(function (context) {
                    agar_1.Assertions.assertEq('Content emitted should be of format="html"', '<p>A</p>', context.vm.content);
                }),
                Loader_1.cRemove
            ])),
            agar_1.Logger.t('Test :value binding without :input', agar_1.Chain.asStep({}, [
                Loader_1.cRender({
                    content: 'initial content'
                }, "\n            <editor\n              :init=\"init\"\n              :value=\"content\"\n            ></editor>\n          "),
                cChangeVar('content', 'changed'),
                agar_1.Chain.op(function (context) {
                    agar_1.Assertions.assertEq('Editor content should match variable changes', '<p>changed</p>', context.editor.getContent());
                }),
                Loader_1.cRemove
            ])),
        ])),
    ])); };
    agar_1.Pipeline.async({}, [
        sTestVersion('4'),
        sTestVersion('5')
    ], success, failure);
});
