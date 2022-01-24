import { GeneralSteps, Logger, Pipeline, Assertions, Chain, Keyboard, Keys } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';
import { cRender, cRemove } from '../alien/Loader';
import { Element } from '@ephox/sugar';
UnitTest.asynctest('InitTest', function (success, failure) {
    var cFakeType = function (str) {
        return Chain.op(function (context) {
            context.editor.getBody().innerHTML = '<p>' + str + '</p>';
            Keyboard.keystroke(Keys.space(), {}, Element.fromDom(context.editor.getBody()));
        });
    };
    var cChangeVar = function (varName, value) {
        return Chain.op(function (context) {
            context.vm[varName] = value;
        });
    };
    var sTestVersion = function (version) { return VersionLoader.sWithVersion(version, GeneralSteps.sequence([
        Logger.t('Should be able to setup editor', Chain.asStep({}, [
            cRender(),
            Chain.op(function (context) {
                Assertions.assertEq('Editor should not be inline', false, context.editor.inline);
            }),
            cRemove
        ])),
        Logger.t('Should be able to setup editor', Chain.asStep({}, [
            cRender({}, "<editor :init=\"init\" :inline=true ></editor>"),
            Chain.op(function (context) {
                Assertions.assertEq('Editor should be inline', true, context.editor.inline);
            }),
            cRemove
        ])),
        Logger.t('Should be able to setup editor', Chain.asStep({}, [
            cRender({ init: { inline: true } }),
            Chain.op(function (context) {
                Assertions.assertEq('Editor should be inline', true, context.editor.inline);
            }),
            cRemove
        ])),
        Logger.t('Test one way binding tinymce-vue -> variable', GeneralSteps.sequence([
            Logger.t('Test outputFormat="text"', Chain.asStep({}, [
                cRender({
                    content: undefined
                }, "\n            <editor\n              :init=\"init\"\n              v-on:input=\"content = $event\"\n              output-format=\"text\"\n            ></editor>\n          "),
                cFakeType('A'),
                Chain.op(function (context) {
                    Assertions.assertEq('Content emitted should be of format="text"', 'A', context.vm.content);
                }),
                cRemove
            ])),
            Logger.t('Test outputFormat="html"', Chain.asStep({}, [
                cRender({
                    content: undefined
                }, "\n            <editor\n              :init=\"init\"\n              v-on:input=\"content = $event\"\n              output-format=\"html\"\n            ></editor>\n          "),
                cFakeType('A'),
                Chain.op(function (context) {
                    Assertions.assertEq('Content emitted should be of format="html"', '<p>A</p>', context.vm.content);
                }),
                cRemove
            ])),
            Logger.t('Test :value binding without :input', Chain.asStep({}, [
                cRender({
                    content: 'initial content'
                }, "\n            <editor\n              :init=\"init\"\n              :value=\"content\"\n            ></editor>\n          "),
                cChangeVar('content', 'changed'),
                Chain.op(function (context) {
                    Assertions.assertEq('Editor content should match variable changes', '<p>changed</p>', context.editor.getContent());
                }),
                cRemove
            ])),
        ])),
    ])); };
    Pipeline.async({}, [
        sTestVersion('4'),
        sTestVersion('5')
    ], success, failure);
});
