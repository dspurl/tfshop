"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __importDefault(require("./type"));
var node_1 = __importDefault(require("./node"));
/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode(rawText, parentNode) {
        var _this = _super.call(this, parentNode) || this;
        _this.rawText = rawText;
        /**
         * Node Type declaration.
         * @type {Number}
         */
        _this.nodeType = type_1.default.TEXT_NODE;
        return _this;
    }
    Object.defineProperty(TextNode.prototype, "trimmedText", {
        /**
         * Returns text with all whitespace trimmed except single leading/trailing non-breaking space
         */
        get: function () {
            if (this._trimmedText !== undefined)
                return this._trimmedText;
            var text = this.rawText;
            var i = 0;
            var startPos;
            var endPos;
            while (i >= 0 && i < text.length) {
                if (/\S/.test(text[i])) {
                    if (startPos === undefined) {
                        startPos = i;
                        i = text.length;
                    }
                    else {
                        endPos = i;
                        i = void 0;
                    }
                }
                if (startPos === undefined)
                    i++;
                else
                    i--;
            }
            if (startPos === undefined)
                startPos = 0;
            if (endPos === undefined)
                endPos = text.length - 1;
            var hasLeadingSpace = startPos > 0 && /[^\S\r\n]/.test(text[startPos - 1]);
            var hasTrailingSpace = endPos < (text.length - 1) && /[^\S\r\n]/.test(text[endPos + 1]);
            this._trimmedText = (hasLeadingSpace ? ' ' : '') + text.slice(startPos, endPos + 1) + (hasTrailingSpace ? ' ' : '');
            return this._trimmedText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextNode.prototype, "text", {
        /**
         * Get unescaped text value of current node and its children.
         * @return {string} text content
         */
        get: function () {
            return this.rawText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextNode.prototype, "isWhitespace", {
        /**
         * Detect if the node contains only white space.
         * @return {bool}
         */
        get: function () {
            return /^(\s|&nbsp;)*$/.test(this.rawText);
        },
        enumerable: false,
        configurable: true
    });
    TextNode.prototype.toString = function () {
        return this.text;
    };
    return TextNode;
}(node_1.default));
exports.default = TextNode;
