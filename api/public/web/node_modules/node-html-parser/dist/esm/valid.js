import { base_parse } from './nodes/html';
/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 */
export default function valid(data, options = { lowerCaseTagName: false, comment: false }) {
    const stack = base_parse(data, options);
    return Boolean(stack.length === 1);
}
