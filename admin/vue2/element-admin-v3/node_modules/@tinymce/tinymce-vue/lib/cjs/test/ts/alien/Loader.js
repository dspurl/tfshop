"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var agar_1 = require("@ephox/agar");
var katamari_1 = require("@ephox/katamari");
var sugar_1 = require("@ephox/sugar");
var index_1 = require("src/main/ts/index");
// @ts-ignore
var vue_esm_js_1 = require("vue/dist/vue.esm.js"); // Use runtime compiler
var getRoot = function () {
    return sugar_1.SelectorFind.descendant(sugar_1.Body.body(), '#root').getOrThunk(function () {
        var root = sugar_1.Element.fromTag('div');
        sugar_1.Attr.set(root, 'id', 'root');
        sugar_1.Insert.append(sugar_1.Body.body(), root);
        return root;
    });
};
var cRender = function (data, template) {
    if (data === void 0) { data = {}; }
    if (template === void 0) { template = "<editor :init=\"init\" ></editor>"; }
    return agar_1.Chain.async(function (_, next, die) {
        var root = getRoot();
        var mountPoint = sugar_1.Element.fromTag('div');
        sugar_1.Insert.append(root, mountPoint);
        var originalInit = data.init || {};
        var originalSetup = originalInit.setup || katamari_1.Fun.noop;
        var vm = new vue_esm_js_1.default({
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
            render: vue_esm_js_1.default.compile(template).render,
            components: {
                editor: index_1.default
            }
        });
        vm.$mount(mountPoint.dom());
    });
};
exports.cRender = cRender;
var cRemove = agar_1.Chain.op(function (context) {
    context.vm.$destroy();
    sugar_1.Remove.remove(getRoot());
});
exports.cRemove = cRemove;
