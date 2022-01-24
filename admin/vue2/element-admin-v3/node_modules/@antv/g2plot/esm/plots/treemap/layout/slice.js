import { each } from '@antv/util';
export function slice(root, x0, y0, x1, y1) {
    var height = y1 - y0;
    var children = root.children, value = root.value;
    children.sort(function (a, b) {
        return b.value - a.value;
    });
    var k = height / value;
    var node_y = y0;
    each(children, function (c) {
        c.x0 = x0;
        c.x1 = x1;
        c.y0 = node_y;
        node_y += c.value * k;
        c.y1 = c.y0 + c.value * k;
    });
}
//# sourceMappingURL=slice.js.map