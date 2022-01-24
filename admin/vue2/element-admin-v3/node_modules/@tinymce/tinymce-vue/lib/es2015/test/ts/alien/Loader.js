var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Chain } from '@ephox/agar';
import { Fun } from '@ephox/katamari';
import { Attr, Body, Element, Insert, Remove, SelectorFind } from '@ephox/sugar';
import Editor from 'src/main/ts/index';
// @ts-ignore
import Vue from 'vue/dist/vue.esm.js'; // Use runtime compiler
var getRoot = function () {
    return SelectorFind.descendant(Body.body(), '#root').getOrThunk(function () {
        var root = Element.fromTag('div');
        Attr.set(root, 'id', 'root');
        Insert.append(Body.body(), root);
        return root;
    });
};
var cRender = function (data, template) {
    if (data === void 0) { data = {}; }
    if (template === void 0) { template = "<editor :init=\"init\" ></editor>"; }
    return Chain.async(function (_, next, die) {
        var root = getRoot();
        var mountPoint = Element.fromTag('div');
        Insert.append(root, mountPoint);
        var originalInit = data.init || {};
        var originalSetup = originalInit.setup || Fun.noop;
        var vm = new Vue({
            data: __assign(__assign({}, data), { outputFormat: 'text', init: __assign(__assign({}, originalInit), { setup: function (editor) {
                        originalSetup(editor);
                        editor.on('SkinLoaded', function () {
                            setTimeout(function () {
                                next({
                                    editor: editor,
                                    vm: vm
                                });
                            }, 0);
                        });
                    } }) }),
            render: Vue.compile(template).render,
            components: {
                editor: Editor
            }
        });
        vm.$mount(mountPoint.dom());
    });
};
var cRemove = Chain.op(function (context) {
    context.vm.$destroy();
    Remove.remove(getRoot());
});
export { cRender, cRemove };
