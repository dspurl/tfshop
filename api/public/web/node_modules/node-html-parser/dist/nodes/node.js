"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
var Node = /** @class */ (function () {
    function Node(parentNode) {
        if (parentNode === void 0) { parentNode = null; }
        this.parentNode = parentNode;
        this.childNodes = [];
    }
    Object.defineProperty(Node.prototype, "innerText", {
        get: function () {
            return this.rawText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "textContent", {
        get: function () {
            return this.rawText;
        },
        set: function (val) {
            this.rawText = val;
        },
        enumerable: false,
        configurable: true
    });
    return Node;
}());
exports.default = Node;
