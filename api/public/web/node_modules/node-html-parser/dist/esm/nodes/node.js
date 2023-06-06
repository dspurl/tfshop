/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default class Node {
    constructor(parentNode = null) {
        this.parentNode = parentNode;
        this.childNodes = [];
    }
    get innerText() {
        return this.rawText;
    }
    get textContent() {
        return this.rawText;
    }
    set textContent(val) {
        this.rawText = val;
    }
}
