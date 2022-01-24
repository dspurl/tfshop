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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
define("back", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function arr_back(arr) {
        return arr[arr.length - 1];
    }
    exports.default = arr_back;
});
define("nodes/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
        NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
        NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    })(NodeType || (NodeType = {}));
    exports.default = NodeType;
});
define("nodes/text", ["require", "exports", "nodes/type", "nodes/node"], function (require, exports, type_1, node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    type_1 = __importDefault(type_1);
    node_1 = __importDefault(node_1);
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
});
define("matcher", ["require", "exports", "nodes/type"], function (require, exports, type_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    type_2 = __importDefault(type_2);
    function isTag(node) {
        return node && node.nodeType === type_2.default.ELEMENT_NODE;
    }
    function getAttributeValue(elem, name) {
        return isTag(elem) ? elem.getAttribute(name) : undefined;
    }
    function getName(elem) {
        return ((elem && elem.rawTagName) || '').toLowerCase();
    }
    function getChildren(node) {
        return node && node.childNodes;
    }
    function getParent(node) {
        return node ? node.parentNode : null;
    }
    function getText(node) {
        return node.text;
    }
    function removeSubsets(nodes) {
        var idx = nodes.length;
        var node;
        var ancestor;
        var replace;
        // Check if each node (or one of its ancestors) is already contained in the
        // array.
        while (--idx > -1) {
            node = ancestor = nodes[idx];
            // Temporarily remove the node under consideration
            nodes[idx] = null;
            replace = true;
            while (ancestor) {
                if (nodes.indexOf(ancestor) > -1) {
                    replace = false;
                    nodes.splice(idx, 1);
                    break;
                }
                ancestor = getParent(ancestor);
            }
            // If the node has been found to be unique, re-insert it.
            if (replace) {
                nodes[idx] = node;
            }
        }
        return nodes;
    }
    function existsOne(test, elems) {
        return elems.some(function (elem) {
            return isTag(elem) ? test(elem) || existsOne(test, getChildren(elem)) : false;
        });
    }
    function getSiblings(node) {
        var parent = getParent(node);
        return parent && getChildren(parent);
    }
    function hasAttrib(elem, name) {
        return getAttributeValue(elem, name) !== undefined;
    }
    function findOne(test, elems) {
        var elem = null;
        for (var i = 0, l = elems.length; i < l && !elem; i++) {
            var el = elems[i];
            if (test(el)) {
                elem = el;
            }
            else {
                var childs = getChildren(el);
                if (childs && childs.length > 0) {
                    elem = findOne(test, childs);
                }
            }
        }
        return elem;
    }
    function findAll(test, nodes) {
        var result = [];
        for (var i = 0, j = nodes.length; i < j; i++) {
            if (!isTag(nodes[i]))
                continue;
            if (test(nodes[i]))
                result.push(nodes[i]);
            var childs = getChildren(nodes[i]);
            if (childs)
                result = result.concat(findAll(test, childs));
        }
        return result;
    }
    exports.default = {
        isTag: isTag,
        getAttributeValue: getAttributeValue,
        getName: getName,
        getChildren: getChildren,
        getParent: getParent,
        getText: getText,
        removeSubsets: removeSubsets,
        existsOne: existsOne,
        getSiblings: getSiblings,
        hasAttrib: hasAttrib,
        findOne: findOne,
        findAll: findAll
    };
});
define("nodes/html", ["require", "exports", "he", "css-select", "nodes/node", "nodes/type", "nodes/text", "matcher", "back", "nodes/comment"], function (require, exports, he_1, css_select_1, node_2, type_3, text_1, matcher_1, back_1, comment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = exports.base_parse = void 0;
    he_1 = __importDefault(he_1);
    node_2 = __importDefault(node_2);
    type_3 = __importDefault(type_3);
    text_1 = __importDefault(text_1);
    matcher_1 = __importDefault(matcher_1);
    back_1 = __importDefault(back_1);
    comment_1 = __importDefault(comment_1);
    // const { decode } = he;
    function decode(val) {
        // clone string
        return JSON.parse(JSON.stringify(he_1.default.decode(val)));
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
    var kBlockElements = new Set();
    kBlockElements.add('address');
    kBlockElements.add('ADDRESS');
    kBlockElements.add('article');
    kBlockElements.add('ARTICLE');
    kBlockElements.add('aside');
    kBlockElements.add('ASIDE');
    kBlockElements.add('blockquote');
    kBlockElements.add('BLOCKQUOTE');
    kBlockElements.add('br');
    kBlockElements.add('BR');
    kBlockElements.add('details');
    kBlockElements.add('DETAILS');
    kBlockElements.add('dialog');
    kBlockElements.add('DIALOG');
    kBlockElements.add('dd');
    kBlockElements.add('DD');
    kBlockElements.add('div');
    kBlockElements.add('DIV');
    kBlockElements.add('dl');
    kBlockElements.add('DL');
    kBlockElements.add('dt');
    kBlockElements.add('DT');
    kBlockElements.add('fieldset');
    kBlockElements.add('FIELDSET');
    kBlockElements.add('figcaption');
    kBlockElements.add('FIGCAPTION');
    kBlockElements.add('figure');
    kBlockElements.add('FIGURE');
    kBlockElements.add('footer');
    kBlockElements.add('FOOTER');
    kBlockElements.add('form');
    kBlockElements.add('FORM');
    kBlockElements.add('h1');
    kBlockElements.add('H1');
    kBlockElements.add('h2');
    kBlockElements.add('H2');
    kBlockElements.add('h3');
    kBlockElements.add('H3');
    kBlockElements.add('h4');
    kBlockElements.add('H4');
    kBlockElements.add('h5');
    kBlockElements.add('H5');
    kBlockElements.add('h6');
    kBlockElements.add('H6');
    kBlockElements.add('header');
    kBlockElements.add('HEADER');
    kBlockElements.add('hgroup');
    kBlockElements.add('HGROUP');
    kBlockElements.add('hr');
    kBlockElements.add('HR');
    kBlockElements.add('li');
    kBlockElements.add('LI');
    kBlockElements.add('main');
    kBlockElements.add('MAIN');
    kBlockElements.add('nav');
    kBlockElements.add('NAV');
    kBlockElements.add('ol');
    kBlockElements.add('OL');
    kBlockElements.add('p');
    kBlockElements.add('P');
    kBlockElements.add('pre');
    kBlockElements.add('PRE');
    kBlockElements.add('section');
    kBlockElements.add('SECTION');
    kBlockElements.add('table');
    kBlockElements.add('TABLE');
    kBlockElements.add('td');
    kBlockElements.add('TD');
    kBlockElements.add('tr');
    kBlockElements.add('TR');
    kBlockElements.add('ul');
    kBlockElements.add('UL');
    var DOMTokenList = /** @class */ (function () {
        function DOMTokenList(valuesInit, afterUpdate) {
            if (valuesInit === void 0) { valuesInit = []; }
            if (afterUpdate === void 0) { afterUpdate = (function () { return null; }); }
            this._set = new Set(valuesInit);
            this._afterUpdate = afterUpdate;
        }
        DOMTokenList.prototype._validate = function (c) {
            if (/\s/.test(c)) {
                throw new Error("DOMException in DOMTokenList.add: The token '" + c + "' contains HTML space characters, which are not valid in tokens.");
            }
        };
        DOMTokenList.prototype.add = function (c) {
            this._validate(c);
            this._set.add(c);
            this._afterUpdate(this); // eslint-disable-line @typescript-eslint/no-unsafe-call
        };
        DOMTokenList.prototype.replace = function (c1, c2) {
            this._validate(c2);
            this._set.delete(c1);
            this._set.add(c2);
            this._afterUpdate(this); // eslint-disable-line @typescript-eslint/no-unsafe-call
        };
        DOMTokenList.prototype.remove = function (c) {
            this._set.delete(c) &&
                this._afterUpdate(this); // eslint-disable-line @typescript-eslint/no-unsafe-call
        };
        DOMTokenList.prototype.toggle = function (c) {
            this._validate(c);
            if (this._set.has(c))
                this._set.delete(c);
            else
                this._set.add(c);
            this._afterUpdate(this); // eslint-disable-line @typescript-eslint/no-unsafe-call
        };
        DOMTokenList.prototype.contains = function (c) {
            return this._set.has(c);
        };
        Object.defineProperty(DOMTokenList.prototype, "length", {
            get: function () {
                return this._set.size;
            },
            enumerable: false,
            configurable: true
        });
        DOMTokenList.prototype.values = function () {
            return this._set.values();
        };
        Object.defineProperty(DOMTokenList.prototype, "value", {
            get: function () {
                return Array.from(this._set.values());
            },
            enumerable: false,
            configurable: true
        });
        DOMTokenList.prototype.toString = function () {
            return Array.from(this._set.values()).join(' ');
        };
        return DOMTokenList;
    }());
    /**
     * HTMLElement, which contains a set of children.
     *
     * Note: this is a minimalist implementation, no complete tree
     *   structure provided (no parentNode, nextSibling,
     *   previousSibling etc).
     * @class HTMLElement
     * @extends {Node}
     */
    var HTMLElement = /** @class */ (function (_super) {
        __extends(HTMLElement, _super);
        /**
         * Creates an instance of HTMLElement.
         * @param keyAttrs	id and class attribute
         * @param [rawAttrs]	attributes in string
         *
         * @memberof HTMLElement
         */
        function HTMLElement(tagName, keyAttrs, rawAttrs, parentNode) {
            if (rawAttrs === void 0) { rawAttrs = ''; }
            var _this = _super.call(this, parentNode) || this;
            _this.rawAttrs = rawAttrs;
            /**
             * Node Type declaration.
             */
            _this.nodeType = type_3.default.ELEMENT_NODE;
            _this.rawTagName = tagName;
            _this.rawAttrs = rawAttrs || '';
            _this.id = keyAttrs.id || '';
            _this.childNodes = [];
            _this.classList = new DOMTokenList(keyAttrs.class ? keyAttrs.class.split(/\s+/) : [], function (classList) { return (_this.setAttribute('class', classList.toString()) // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            ); });
            if (keyAttrs.id) {
                if (!rawAttrs) {
                    _this.rawAttrs = "id=\"" + keyAttrs.id + "\"";
                }
            }
            if (keyAttrs.class) {
                if (!rawAttrs) {
                    var cls = "class=\"" + _this.classList.toString() + "\"";
                    if (_this.rawAttrs) {
                        _this.rawAttrs += " " + cls;
                    }
                    else {
                        _this.rawAttrs = cls;
                    }
                }
            }
            return _this;
        }
        /**
         * Quote attribute values
         * @param attr attribute value
         * @returns {string} quoted value
         */
        HTMLElement.prototype.quoteAttribute = function (attr) {
            if (attr === null) {
                return "null";
            }
            return JSON.stringify(attr.replace(/"/g, '&quot;'));
        };
        /**
         * Remove current element
         */
        HTMLElement.prototype.remove = function () {
            var _this = this;
            if (this.parentNode) {
                var children = this.parentNode.childNodes;
                this.parentNode.childNodes = children.filter(function (child) {
                    return _this !== child;
                });
            }
        };
        /**
         * Remove Child element from childNodes array
         * @param {HTMLElement} node     node to remove
         */
        HTMLElement.prototype.removeChild = function (node) {
            this.childNodes = this.childNodes.filter(function (child) {
                return (child !== node);
            });
        };
        /**
         * Exchanges given child with new child
         * @param {HTMLElement} oldNode     node to exchange
         * @param {HTMLElement} newNode     new node
         */
        HTMLElement.prototype.exchangeChild = function (oldNode, newNode) {
            var children = this.childNodes;
            this.childNodes = children.map(function (child) {
                if (child === oldNode) {
                    return newNode;
                }
                return child;
            });
        };
        Object.defineProperty(HTMLElement.prototype, "tagName", {
            get: function () {
                return this.rawTagName ? this.rawTagName.toUpperCase() : this.rawTagName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "localName", {
            get: function () {
                return this.rawTagName.toLowerCase();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawText", {
            /**
             * Get escpaed (as-it) text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.childNodes.reduce(function (pre, cur) {
                    return (pre += cur.rawText);
                }, '');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "textContent", {
            get: function () {
                return this.rawText;
            },
            set: function (val) {
                var content = [new text_1.default(val, this)];
                this.childNodes = content;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return decode(this.rawText);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "structuredText", {
            /**
             * Get structured Text (with '\n' etc.)
             * @return {string} structured text
             */
            get: function () {
                var currentBlock = [];
                var blocks = [currentBlock];
                function dfs(node) {
                    if (node.nodeType === type_3.default.ELEMENT_NODE) {
                        if (kBlockElements.has(node.rawTagName)) {
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                            node.childNodes.forEach(dfs);
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                        }
                        else {
                            node.childNodes.forEach(dfs);
                        }
                    }
                    else if (node.nodeType === type_3.default.TEXT_NODE) {
                        if (node.isWhitespace) {
                            // Whitespace node, postponed output
                            currentBlock.prependWhitespace = true;
                        }
                        else {
                            var text = node.trimmedText;
                            if (currentBlock.prependWhitespace) {
                                text = " " + text;
                                currentBlock.prependWhitespace = false;
                            }
                            currentBlock.push(text);
                        }
                    }
                }
                dfs(this);
                return blocks.map(function (block) {
                    // Normalize each line's whitespace
                    return block.join('').replace(/\s{2,}/g, ' ');
                })
                    .join('\n').replace(/\s+$/, ''); // trimRight;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.toString = function () {
            var tag = this.rawTagName;
            if (tag) {
                // const void_tags = new Set('area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr'.split('|'));
                // const is_void = void_tags.has(tag);
                var is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
                var attrs = this.rawAttrs ? " " + this.rawAttrs : '';
                if (is_void) {
                    return "<" + tag + attrs + ">";
                }
                return "<" + tag + attrs + ">" + this.innerHTML + "</" + tag + ">";
            }
            return this.innerHTML;
        };
        Object.defineProperty(HTMLElement.prototype, "innerHTML", {
            get: function () {
                return this.childNodes.map(function (child) {
                    return child.toString();
                }).join('');
            },
            set: function (content) {
                //const r = parse(content, global.options); // TODO global.options ?
                var r = parse(content);
                this.childNodes = r.childNodes.length ? r.childNodes : [new text_1.default(content, this)];
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.set_content = function (content, options) {
            if (options === void 0) { options = {}; }
            if (content instanceof node_2.default) {
                content = [content];
            }
            else if (typeof content == 'string') {
                var r = parse(content, options);
                content = r.childNodes.length ? r.childNodes : [new text_1.default(content, this)];
            }
            this.childNodes = content;
        };
        HTMLElement.prototype.replaceWith = function () {
            var _this = this;
            var nodes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                nodes[_i] = arguments[_i];
            }
            var content = nodes.map(function (node) {
                if (node instanceof node_2.default) {
                    return [node];
                }
                else if (typeof node == 'string') {
                    // const r = parse(content, global.options); // TODO global.options ?
                    var r = parse(node);
                    return r.childNodes.length ? r.childNodes : [new text_1.default(node, _this)];
                }
                return [];
            }).flat();
            var idx = this.parentNode.childNodes.findIndex(function (child) {
                return child === _this;
            });
            this.parentNode.childNodes = __spreadArray(__spreadArray(__spreadArray([], this.parentNode.childNodes.slice(0, idx)), content), this.parentNode.childNodes.slice(idx + 1));
        };
        Object.defineProperty(HTMLElement.prototype, "outerHTML", {
            get: function () {
                return this.toString();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Trim element from right (in block) after seeing pattern in a TextNode.
         * @param  {RegExp} pattern pattern to find
         * @return {HTMLElement}    reference to current node
         */
        HTMLElement.prototype.trimRight = function (pattern) {
            for (var i = 0; i < this.childNodes.length; i++) {
                var childNode = this.childNodes[i];
                if (childNode.nodeType === type_3.default.ELEMENT_NODE) {
                    childNode.trimRight(pattern);
                }
                else {
                    var index = childNode.rawText.search(pattern);
                    if (index > -1) {
                        childNode.rawText = childNode.rawText.substr(0, index);
                        // trim all following nodes.
                        this.childNodes.length = i + 1;
                    }
                }
            }
            return this;
        };
        Object.defineProperty(HTMLElement.prototype, "structure", {
            /**
             * Get DOM structure
             * @return {string} strucutre
             */
            get: function () {
                var res = [];
                var indention = 0;
                function write(str) {
                    res.push('  '.repeat(indention) + str);
                }
                function dfs(node) {
                    var idStr = node.id ? ("#" + node.id) : '';
                    var classStr = node.classList.length ? ("." + node.classList.value.join('.')) : ''; // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call
                    write("" + node.rawTagName + idStr + classStr);
                    indention++;
                    node.childNodes.forEach(function (childNode) {
                        if (childNode.nodeType === type_3.default.ELEMENT_NODE) {
                            dfs(childNode);
                        }
                        else if (childNode.nodeType === type_3.default.TEXT_NODE) {
                            if (!childNode.isWhitespace) {
                                write('#text');
                            }
                        }
                    });
                    indention--;
                }
                dfs(this);
                return res.join('\n');
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Remove whitespaces in this sub tree.
         * @return {HTMLElement} pointer to this
         */
        HTMLElement.prototype.removeWhitespace = function () {
            var _this = this;
            var o = 0;
            this.childNodes.forEach(function (node) {
                if (node.nodeType === type_3.default.TEXT_NODE) {
                    if (node.isWhitespace) {
                        return;
                    }
                    node.rawText = node.trimmedText;
                }
                else if (node.nodeType === type_3.default.ELEMENT_NODE) {
                    node.removeWhitespace();
                }
                _this.childNodes[o++] = node;
            });
            this.childNodes.length = o;
            return this;
        };
        /**
         * Query CSS selector to find matching nodes.
         * @param  {string}         selector Simplified CSS selector
         * @return {HTMLElement[]}  matching elements
         */
        HTMLElement.prototype.querySelectorAll = function (selector) {
            return css_select_1.selectAll(selector, this, {
                xmlMode: true,
                adapter: matcher_1.default
            });
            // let matcher: Matcher;
            // if (selector instanceof Matcher) {
            // 	matcher = selector;
            // 	matcher.reset();
            // } else {
            // 	if (selector.includes(',')) {
            // 		const selectors = selector.split(',');
            // 		return Array.from(selectors.reduce((pre, cur) => {
            // 			const result = this.querySelectorAll(cur.trim());
            // 			return result.reduce((p, c) => {
            // 				return p.add(c);
            // 			}, pre);
            // 		}, new Set<HTMLElement>()));
            // 	}
            // 	matcher = new Matcher(selector);
            // }
            // interface IStack {
            // 	0: Node;	// node
            // 	1: number;	// children
            // 	2: boolean;	// found flag
            // }
            // const stack = [] as IStack[];
            // return this.childNodes.reduce((res, cur) => {
            // 	stack.push([cur, 0, false]);
            // 	while (stack.length) {
            // 		const state = arr_back(stack);	// get last element
            // 		const el = state[0];
            // 		if (state[1] === 0) {
            // 			// Seen for first time.
            // 			if (el.nodeType !== NodeType.ELEMENT_NODE) {
            // 				stack.pop();
            // 				continue;
            // 			}
            // 			const html_el = el as HTMLElement;
            // 			state[2] = matcher.advance(html_el);
            // 			if (state[2]) {
            // 				if (matcher.matched) {
            // 					res.push(html_el);
            // 					res.push(...(html_el.querySelectorAll(selector)));
            // 					// no need to go further.
            // 					matcher.rewind();
            // 					stack.pop();
            // 					continue;
            // 				}
            // 			}
            // 		}
            // 		if (state[1] < el.childNodes.length) {
            // 			stack.push([el.childNodes[state[1]++], 0, false]);
            // 		} else {
            // 			if (state[2]) {
            // 				matcher.rewind();
            // 			}
            // 			stack.pop();
            // 		}
            // 	}
            // 	return res;
            // }, [] as HTMLElement[]);
        };
        /**
         * Query CSS Selector to find matching node.
         * @param  {string}         selector Simplified CSS selector
         * @return {HTMLElement}    matching node
         */
        HTMLElement.prototype.querySelector = function (selector) {
            return css_select_1.selectOne(selector, this, {
                xmlMode: true,
                adapter: matcher_1.default
            });
            // let matcher: Matcher;
            // if (selector instanceof Matcher) {
            // 	matcher = selector;
            // 	matcher.reset();
            // } else {
            // 	matcher = new Matcher(selector);
            // }
            // const stack = [] as { 0: Node; 1: 0 | 1; 2: boolean }[];
            // for (const node of this.childNodes) {
            // 	stack.push([node, 0, false]);
            // 	while (stack.length) {
            // 		const state = arr_back(stack);
            // 		const el = state[0];
            // 		if (state[1] === 0) {
            // 			// Seen for first time.
            // 			if (el.nodeType !== NodeType.ELEMENT_NODE) {
            // 				stack.pop();
            // 				continue;
            // 			}
            // 			state[2] = matcher.advance(el as HTMLElement);
            // 			if (state[2]) {
            // 				if (matcher.matched) {
            // 					return el as HTMLElement;
            // 				}
            // 			}
            // 		}
            // 		if (state[1] < el.childNodes.length) {
            // 			stack.push([el.childNodes[state[1]++], 0, false]);
            // 		} else {
            // 			if (state[2]) {
            // 				matcher.rewind();
            // 			}
            // 			stack.pop();
            // 		}
            // 	}
            // }
            // return null;
        };
        /**
         * traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string. Will return itself or the matching ancestor. If no such element exists, it returns null.
         * @param selector a DOMString containing a selector list
         */
        HTMLElement.prototype.closest = function (selector) {
            var mapChild = new Map();
            var el = this;
            var old = null;
            function findOne(test, elems) {
                var elem = null;
                for (var i = 0, l = elems.length; i < l && !elem; i++) {
                    var el_1 = elems[i];
                    if (test(el_1)) {
                        elem = el_1;
                    }
                    else {
                        var child = mapChild.get(el_1);
                        if (child) {
                            elem = findOne(test, [child]);
                        }
                    }
                }
                return elem;
            }
            while (el) {
                mapChild.set(el, old);
                old = el;
                el = el.parentNode;
            }
            el = this;
            while (el) {
                var e = css_select_1.selectOne(selector, el, {
                    xmlMode: true,
                    adapter: __assign(__assign({}, matcher_1.default), { getChildren: function (node) {
                            var child = mapChild.get(node);
                            return child && [child];
                        },
                        getSiblings: function (node) {
                            return [node];
                        },
                        findOne: findOne,
                        findAll: function () {
                            return [];
                        } })
                });
                if (e) {
                    return e;
                }
                el = el.parentNode;
            }
            return null;
        };
        /**
         * Append a child node to childNodes
         * @param  {Node} node node to append
         * @return {Node}      node appended
         */
        HTMLElement.prototype.appendChild = function (node) {
            // node.parentNode = this;
            this.childNodes.push(node);
            node.parentNode = this;
            return node;
        };
        Object.defineProperty(HTMLElement.prototype, "firstChild", {
            /**
             * Get first child node
             * @return {Node} first child node
             */
            get: function () {
                return this.childNodes[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "lastChild", {
            /**
             * Get last child node
             * @return {Node} last child node
             */
            get: function () {
                return back_1.default(this.childNodes);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "attrs", {
            /**
             * Get attributes
             * @access private
             * @return {Object} parsed and unescaped attributes
             */
            get: function () {
                if (this._attrs) {
                    return this._attrs;
                }
                this._attrs = {};
                var attrs = this.rawAttributes;
                for (var key in attrs) {
                    var val = attrs[key] || '';
                    this._attrs[key.toLowerCase()] = decode(val);
                }
                return this._attrs;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "attributes", {
            get: function () {
                var ret_attrs = {};
                var attrs = this.rawAttributes;
                for (var key in attrs) {
                    var val = attrs[key] || '';
                    ret_attrs[key] = decode(val);
                }
                return ret_attrs;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawAttributes", {
            /**
             * Get escaped (as-it) attributes
             * @return {Object} parsed attributes
             */
            get: function () {
                if (this._rawAttrs) {
                    return this._rawAttrs;
                }
                var attrs = {};
                if (this.rawAttrs) {
                    var re = /\b([a-z][a-z0-9-_:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
                    var match = void 0;
                    while ((match = re.exec(this.rawAttrs))) {
                        attrs[match[1]] = match[2] || match[3] || match[4] || null;
                    }
                }
                this._rawAttrs = attrs;
                return attrs;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.removeAttribute = function (key) {
            var attrs = this.rawAttributes;
            delete attrs[key];
            // Update this.attribute
            if (this._attrs) {
                delete this._attrs[key];
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = JSON.stringify(attrs[name]);
                if (val === undefined || val === 'null') {
                    return name;
                }
                return name + "=" + val;
            }).join(' ');
            // Update this.id
            if (key === 'id') {
                this.id = '';
            }
        };
        HTMLElement.prototype.hasAttribute = function (key) {
            return key.toLowerCase() in this.attrs;
        };
        /**
         * Get an attribute
         * @return {string} value of the attribute
         */
        HTMLElement.prototype.getAttribute = function (key) {
            return this.attrs[key.toLowerCase()];
        };
        /**
         * Set an attribute value to the HTMLElement
         * @param {string} key The attribute name
         * @param {string} value The value to set, or null / undefined to remove an attribute
         */
        HTMLElement.prototype.setAttribute = function (key, value) {
            var _this = this;
            if (arguments.length < 2) {
                throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
            }
            var k2 = key.toLowerCase();
            var attrs = this.rawAttributes;
            for (var k in attrs) {
                if (k.toLowerCase() === k2) {
                    key = k;
                    break;
                }
            }
            attrs[key] = String(value);
            // update this.attrs
            if (this._attrs) {
                this._attrs[k2] = decode(attrs[key]);
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = _this.quoteAttribute(attrs[name]);
                if (val === 'null' || val === '""') {
                    return name;
                }
                return name + "=" + val;
            }).join(' ');
            // Update this.id
            if (key === 'id') {
                this.id = value;
            }
        };
        /**
         * Replace all the attributes of the HTMLElement by the provided attributes
         * @param {Attributes} attributes the new attribute set
         */
        HTMLElement.prototype.setAttributes = function (attributes) {
            var _this = this;
            // Invalidate current this.attributes
            if (this._attrs) {
                delete this._attrs;
            }
            // Invalidate current this.rawAttributes
            if (this._rawAttrs) {
                delete this._rawAttrs;
            }
            // Update rawString
            this.rawAttrs = Object.keys(attributes).map(function (name) {
                var val = attributes[name];
                if (val === 'null' || val === '""') {
                    return name;
                }
                return name + "=" + _this.quoteAttribute(String(val));
            }).join(' ');
        };
        HTMLElement.prototype.insertAdjacentHTML = function (where, html) {
            var _a, _b, _c;
            var _this = this;
            if (arguments.length < 2) {
                throw new Error('2 arguments required');
            }
            var p = parse(html);
            if (where === 'afterend') {
                var idx = this.parentNode.childNodes.findIndex(function (child) {
                    return child === _this;
                });
                (_a = this.parentNode.childNodes).splice.apply(_a, __spreadArray([idx + 1, 0], p.childNodes));
                p.childNodes.forEach(function (n) {
                    if (n instanceof HTMLElement) {
                        n.parentNode = _this.parentNode;
                    }
                });
            }
            else if (where === 'afterbegin') {
                (_b = this.childNodes).unshift.apply(_b, p.childNodes);
            }
            else if (where === 'beforeend') {
                p.childNodes.forEach(function (n) {
                    _this.appendChild(n);
                });
            }
            else if (where === 'beforebegin') {
                var idx = this.parentNode.childNodes.findIndex(function (child) {
                    return child === _this;
                });
                (_c = this.parentNode.childNodes).splice.apply(_c, __spreadArray([idx, 0], p.childNodes));
                p.childNodes.forEach(function (n) {
                    if (n instanceof HTMLElement) {
                        n.parentNode = _this.parentNode;
                    }
                });
            }
            else {
                throw new Error("The value provided ('" + where + "') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'");
            }
            // if (!where || html === undefined || html === null) {
            // 	return;
            // }
        };
        Object.defineProperty(HTMLElement.prototype, "nextSibling", {
            get: function () {
                if (this.parentNode) {
                    var children = this.parentNode.childNodes;
                    var i = 0;
                    while (i < children.length) {
                        var child = children[i++];
                        if (this === child) {
                            return children[i] || null;
                        }
                    }
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "nextElementSibling", {
            get: function () {
                if (this.parentNode) {
                    var children = this.parentNode.childNodes;
                    var i = 0;
                    var find = false;
                    while (i < children.length) {
                        var child = children[i++];
                        if (find) {
                            if (child instanceof HTMLElement) {
                                return child || null;
                            }
                        }
                        else if (this === child) {
                            find = true;
                        }
                    }
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "classNames", {
            get: function () {
                return this.classList.toString();
            },
            enumerable: false,
            configurable: true
        });
        return HTMLElement;
    }(node_2.default));
    exports.default = HTMLElement;
    // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
    var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
    // <(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
    // <([a-z][-.:0-9_a-z]*)\s*\/>
    // <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>
    // <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>|<(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
    var kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]*)"|'([^']*)'|(\S+))/ig;
    var kSelfClosingElements = {
        area: true,
        AREA: true,
        base: true,
        BASE: true,
        br: true,
        BR: true,
        col: true,
        COL: true,
        hr: true,
        HR: true,
        img: true,
        IMG: true,
        input: true,
        INPUT: true,
        link: true,
        LINK: true,
        meta: true,
        META: true,
        source: true,
        SOURCE: true,
        embed: true,
        EMBED: true,
        param: true,
        PARAM: true,
        track: true,
        TRACK: true,
        wbr: true,
        WBR: true
    };
    var kElementsClosedByOpening = {
        li: { li: true, LI: true },
        LI: { li: true, LI: true },
        p: { p: true, div: true, P: true, DIV: true },
        P: { p: true, div: true, P: true, DIV: true },
        b: { div: true, DIV: true },
        B: { div: true, DIV: true },
        td: { td: true, th: true, TD: true, TH: true },
        TD: { td: true, th: true, TD: true, TH: true },
        th: { td: true, th: true, TD: true, TH: true },
        TH: { td: true, th: true, TD: true, TH: true },
        h1: { h1: true, H1: true },
        H1: { h1: true, H1: true },
        h2: { h2: true, H2: true },
        H2: { h2: true, H2: true },
        h3: { h3: true, H3: true },
        H3: { h3: true, H3: true },
        h4: { h4: true, H4: true },
        H4: { h4: true, H4: true },
        h5: { h5: true, H5: true },
        H5: { h5: true, H5: true },
        h6: { h6: true, H6: true },
        H6: { h6: true, H6: true }
    };
    var kElementsClosedByClosing = {
        li: { ul: true, ol: true, UL: true, OL: true },
        LI: { ul: true, ol: true, UL: true, OL: true },
        a: { div: true, DIV: true },
        A: { div: true, DIV: true },
        b: { div: true, DIV: true },
        B: { div: true, DIV: true },
        i: { div: true, DIV: true },
        I: { div: true, DIV: true },
        p: { div: true, DIV: true },
        P: { div: true, DIV: true },
        td: { tr: true, table: true, TR: true, TABLE: true },
        TD: { tr: true, table: true, TR: true, TABLE: true },
        th: { tr: true, table: true, TR: true, TABLE: true },
        TH: { tr: true, table: true, TR: true, TABLE: true }
    };
    var frameflag = 'documentfragmentcontainer';
    /**
     * Parses HTML and returns a root element
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    function base_parse(data, options) {
        if (options === void 0) { options = { lowerCaseTagName: false, comment: false }; }
        var elements = options.blockTextElements || {
            script: true,
            noscript: true,
            style: true,
            pre: true
        };
        var element_names = Object.keys(elements);
        var kBlockTextElements = element_names.map(function (it) {
            return new RegExp(it, 'i');
        });
        var kIgnoreElements = element_names.filter(function (it) {
            return elements[it];
        }).map(function (it) {
            return new RegExp(it, 'i');
        });
        function element_should_be_ignore(tag) {
            return kIgnoreElements.some(function (it) {
                return it.test(tag);
            });
        }
        function is_block_text_element(tag) {
            return kBlockTextElements.some(function (it) {
                return it.test(tag);
            });
        }
        var root = new HTMLElement(null, {}, '', null);
        var currentParent = root;
        var stack = [root];
        var lastTextPos = -1;
        var match;
        // https://github.com/taoqf/node-html-parser/issues/38
        data = "<" + frameflag + ">" + data + "</" + frameflag + ">";
        var _loop_1 = function () {
            if (lastTextPos > -1) {
                if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                    // if has content
                    var text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                    currentParent.appendChild(new text_1.default(text, currentParent));
                }
            }
            lastTextPos = kMarkupPattern.lastIndex;
            if (match[2] === frameflag) {
                return "continue";
            }
            if (match[0][1] === '!') {
                // this is a comment
                if (options.comment) {
                    // Only keep what is in between <!-- and -->
                    var text = data.substring(lastTextPos - 3, lastTextPos - match[0].length + 4);
                    currentParent.appendChild(new comment_1.default(text, currentParent));
                }
                return "continue";
            }
            if (options.lowerCaseTagName) {
                match[2] = match[2].toLowerCase();
            }
            if (!match[1]) {
                // not </ tags
                var attrs = {};
                for (var attMatch = void 0; (attMatch = kAttributePattern.exec(match[3]));) {
                    attrs[attMatch[2].toLowerCase()] = attMatch[4] || attMatch[5] || attMatch[6];
                }
                var tagName = currentParent.rawTagName;
                if (!match[4] && kElementsClosedByOpening[tagName]) {
                    if (kElementsClosedByOpening[tagName][match[2]]) {
                        stack.pop();
                        currentParent = back_1.default(stack);
                    }
                }
                // ignore container tag we add above
                // https://github.com/taoqf/node-html-parser/issues/38
                currentParent = currentParent.appendChild(new HTMLElement(match[2], attrs, match[3], null));
                stack.push(currentParent);
                if (is_block_text_element(match[2])) {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup_1 = "</" + match[2] + ">";
                    var index = (function () {
                        if (options.lowerCaseTagName) {
                            return data.toLocaleLowerCase().indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                        }
                        return data.indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                    })();
                    if (element_should_be_ignore(match[2])) {
                        var text = void 0;
                        if (index === -1) {
                            // there is no matching ending for the text element.
                            text = data.substr(kMarkupPattern.lastIndex);
                        }
                        else {
                            text = data.substring(kMarkupPattern.lastIndex, index);
                        }
                        if (text.length > 0) {
                            currentParent.appendChild(new text_1.default(text, currentParent));
                        }
                    }
                    if (index === -1) {
                        lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
                    }
                    else {
                        lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup_1.length;
                        match[1] = 'true';
                    }
                }
            }
            if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.rawTagName === match[2]) {
                        stack.pop();
                        currentParent = back_1.default(stack);
                        break;
                    }
                    else {
                        var tagName = currentParent.tagName;
                        // Trying to close current tag, and move on
                        if (kElementsClosedByClosing[tagName]) {
                            if (kElementsClosedByClosing[tagName][match[2]]) {
                                stack.pop();
                                currentParent = back_1.default(stack);
                                continue;
                            }
                        }
                        // Use aggressive strategy to handle unmatching markups.
                        break;
                    }
                }
            }
        };
        while ((match = kMarkupPattern.exec(data))) {
            _loop_1();
        }
        return stack;
    }
    exports.base_parse = base_parse;
    /**
     * Parses HTML and returns a root element
     * Parse a chuck of HTML source.
     */
    function parse(data, options) {
        if (options === void 0) { options = { lowerCaseTagName: false, comment: false }; }
        var stack = base_parse(data, options);
        var root = stack[0];
        var _loop_2 = function () {
            // Handle each error elements.
            var last = stack.pop();
            var oneBefore = back_1.default(stack);
            if (last.parentNode && last.parentNode.parentNode) {
                if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
                    // Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach(function (child) {
                        oneBefore.parentNode.appendChild(child);
                    });
                    stack.pop();
                }
                else {
                    // Single error  <div> <h3> </div> handle: Just removes <h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach(function (child) {
                        oneBefore.appendChild(child);
                    });
                }
            }
            else {
                // If it's final element just skip.
            }
        };
        while (stack.length > 1) {
            _loop_2();
        }
        // response.childNodes.forEach((node) => {
        // 	if (node instanceof HTMLElement) {
        // 		node.parentNode = null;
        // 	}
        // });
        return root;
    }
    exports.parse = parse;
});
define("nodes/node", ["require", "exports"], function (require, exports) {
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
});
define("nodes/comment", ["require", "exports", "nodes/node", "nodes/type"], function (require, exports, node_3, type_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    node_3 = __importDefault(node_3);
    type_4 = __importDefault(type_4);
    var CommentNode = /** @class */ (function (_super) {
        __extends(CommentNode, _super);
        function CommentNode(rawText, parentNode) {
            var _this = _super.call(this, parentNode) || this;
            _this.rawText = rawText;
            /**
             * Node Type declaration.
             * @type {Number}
             */
            _this.nodeType = type_4.default.COMMENT_NODE;
            return _this;
        }
        Object.defineProperty(CommentNode.prototype, "text", {
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
        CommentNode.prototype.toString = function () {
            return "<!--" + this.rawText + "-->";
        };
        return CommentNode;
    }(node_3.default));
    exports.default = CommentNode;
});
define("parse", ["require", "exports", "nodes/html"], function (require, exports, html_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = void 0;
    Object.defineProperty(exports, "default", { enumerable: true, get: function () { return html_1.parse; } });
});
define("valid", ["require", "exports", "nodes/html"], function (require, exports, html_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Parses HTML and returns a root element
     * Parse a chuck of HTML source.
     */
    function valid(data, options) {
        if (options === void 0) { options = { lowerCaseTagName: false, comment: false }; }
        var stack = html_2.base_parse(data, options);
        return Boolean(stack.length === 1);
    }
    exports.default = valid;
});
define("index", ["require", "exports", "nodes/comment", "nodes/html", "parse", "valid", "nodes/node", "nodes/text", "nodes/type"], function (require, exports, comment_2, html_3, parse_1, valid_1, node_4, text_2, type_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeType = exports.TextNode = exports.Node = exports.valid = exports.default = exports.parse = exports.HTMLElement = exports.CommentNode = void 0;
    Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function () { return __importDefault(comment_2).default; } });
    Object.defineProperty(exports, "HTMLElement", { enumerable: true, get: function () { return __importDefault(html_3).default; } });
    Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return __importDefault(parse_1).default; } });
    Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(parse_1).default; } });
    Object.defineProperty(exports, "valid", { enumerable: true, get: function () { return __importDefault(valid_1).default; } });
    Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return __importDefault(node_4).default; } });
    Object.defineProperty(exports, "TextNode", { enumerable: true, get: function () { return __importDefault(text_2).default; } });
    Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return __importDefault(type_5).default; } });
});
