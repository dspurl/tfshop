import NodeType from './type';
import Node from './node';
/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
export default class TextNode extends Node {
    constructor(rawText, parentNode) {
        super(parentNode);
        this.rawText = rawText;
        /**
         * Node Type declaration.
         * @type {Number}
         */
        this.nodeType = NodeType.TEXT_NODE;
    }
    /**
     * Returns text with all whitespace trimmed except single leading/trailing non-breaking space
     */
    get trimmedText() {
        if (this._trimmedText !== undefined)
            return this._trimmedText;
        const text = this.rawText;
        let i = 0;
        let startPos;
        let endPos;
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
        const hasLeadingSpace = startPos > 0 && /[^\S\r\n]/.test(text[startPos - 1]);
        const hasTrailingSpace = endPos < (text.length - 1) && /[^\S\r\n]/.test(text[endPos + 1]);
        this._trimmedText = (hasLeadingSpace ? ' ' : '') + text.slice(startPos, endPos + 1) + (hasTrailingSpace ? ' ' : '');
        return this._trimmedText;
    }
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
        return this.rawText;
    }
    /**
     * Detect if the node contains only white space.
     * @return {bool}
     */
    get isWhitespace() {
        return /^(\s|&nbsp;)*$/.test(this.rawText);
    }
    toString() {
        return this.text;
    }
}
