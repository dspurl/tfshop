import { each, deepMix, clone, find } from '@antv/util';
import { breakText } from '../../../util/common';
var LEAF_LABEL_OFFSET = 4;
var MIN_FONTSIZE = 8;
function isLeaf(data, maxLevel) {
    return !data.children || data.depth >= maxLevel;
}
function textWrapper(label, width, container) {
    var fontSize = label.attr('fontSize');
    var textContent = label.attr('text');
    var tShape = container.addShape('text', {
        attrs: {
            text: '',
            x: 0,
            y: 0,
            fontSize: fontSize,
        },
    });
    var textArr = textContent.split('\n');
    var wrappedTextArr = textArr.map(function (wrappedText) {
        var text = '';
        var chars = wrappedText.split('');
        var breakIndex = [];
        for (var i = 0; i < chars.length; i++) {
            var item = chars[i];
            tShape.attr('text', (text += item));
            var currentWidth = tShape.getBBox().width - 1;
            if (currentWidth > width) {
                // 如果是第一个字符就大于宽度不做任何换行处理
                if (i === 0) {
                    break;
                }
                breakIndex.push(i);
                text = '';
            }
        }
        return breakText(chars, breakIndex);
    });
    tShape.remove();
    return wrappedTextArr.join('\n');
}
function textAbbreviate(text, fontSize, width, container) {
    var tailShape = container.addShape('text', {
        attrs: {
            text: '...',
            x: 0,
            y: 0,
            fontSize: fontSize,
        },
    });
    var tailWidth = tailShape.getBBox().width;
    var tShape = container.addShape('text', {
        attrs: {
            text: '',
            x: 0,
            y: 0,
            fontSize: fontSize,
        },
    });
    var t = '';
    var abbreviateWidth = width - tailWidth;
    for (var i = 0; i < text.length; i++) {
        var item = text[i];
        tShape.attr('text', (t += item));
        var currentWidth = tShape.getBBox().width;
        if (currentWidth >= abbreviateWidth) {
            var string = t.substr(0, t.length - 1);
            if (string.length > 0) {
                return string + '...';
            }
        }
    }
    tShape.remove();
    tailShape.remove();
    return t;
}
var TreemapLabel = /** @class */ (function () {
    function TreemapLabel(cfg) {
        this.destroyed = false;
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = deepMix(defaultOptions, cfg, {});
        this.init();
    }
    TreemapLabel.prototype.init = function () {
        var _this = this;
        this.container = this.getGeometry().labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    TreemapLabel.prototype.render = function () {
        var _this = this;
        var elements = this.getGeometry().elements;
        each(elements, function (ele) {
            var shape = ele.shape;
            var data = shape.get('origin').data;
            var isLeafNode = isLeaf(data, _this.plot.options.maxLevel);
            if (data.showLabel) {
                var style = clone(_this.options.style);
                var position = _this.getPosition(shape, isLeafNode);
                var formatter = _this.options.formatter;
                var content = formatter ? formatter(data.name) : data.name;
                var textBaseline = _this.getTextBaseLine(isLeafNode);
                var label = _this.container.addShape('text', {
                    attrs: deepMix({}, style, {
                        x: position.x,
                        y: position.y,
                        text: content,
                        fill: 'black',
                        textAlign: 'center',
                        textBaseline: textBaseline,
                        fontWeight: isLeafNode ? 300 : 600,
                    }),
                    name: 'label',
                });
                _this.adjustLabel(label, shape, isLeafNode);
            }
        });
    };
    TreemapLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    TreemapLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    TreemapLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    TreemapLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    TreemapLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    TreemapLabel.prototype.getPosition = function (shape, isLeafNode) {
        var shapeBbox = shape.getBBox();
        var x = 0;
        var y = 0;
        if (!isLeafNode) {
            x = shapeBbox.x + shapeBbox.width / 2;
            y = shapeBbox.y + 4;
        }
        else {
            x = shapeBbox.minX + shapeBbox.width / 2;
            y = shapeBbox.minY + shapeBbox.height / 2;
        }
        return { x: x, y: y };
    };
    TreemapLabel.prototype.getTextBaseLine = function (isLeafNode) {
        return isLeafNode ? 'middle' : 'top';
    };
    TreemapLabel.prototype.adjustLabel = function (label, shape, isLeafNode) {
        if (isLeafNode) {
            this.adjustLeafLabel(label, shape);
        }
        else {
            this.adjustParentLabel(label, shape);
        }
    };
    TreemapLabel.prototype.adjustLeafLabel = function (label, shape) {
        var bbox = shape.getBBox();
        var labelBBox = label.getBBox();
        var labelText = clone(label.attr('text'));
        var sizeOffset = 2;
        var fontSize = Math.max(label.attr('fontSize') - sizeOffset, MIN_FONTSIZE);
        var centerX = bbox.x + bbox.width / 2;
        var centerY = bbox.y + bbox.height / 2;
        label.attr({
            x: centerX,
            y: centerY,
            textAlign: 'center',
            textBaseline: 'middle',
            lineHeight: fontSize,
            fontSize: fontSize,
        });
        var wrapperWidth = bbox.width - LEAF_LABEL_OFFSET * 2;
        if (labelBBox.width > bbox.width && labelBBox.height > bbox.height) {
            label.attr('text', '');
            return;
        }
        else if (wrapperWidth < fontSize) {
            label.attr('text', '');
            return;
        }
        if (labelBBox.width > bbox.width) {
            var wrappedText = textWrapper(label, wrapperWidth, this.container);
            label.attr({
                lineHeight: label.attr('fontSize'),
                text: wrappedText,
            });
            var tem_bbox = label.getBBox();
            if (tem_bbox.height > bbox.height) {
                var text = textAbbreviate(labelText, fontSize, wrapperWidth, this.container);
                label.attr('text', text);
            }
        }
    };
    TreemapLabel.prototype.adjustParentLabel = function (label, shape) {
        var shapeBbox = shape.getBBox();
        var wrapperWidth = shapeBbox.width - LEAF_LABEL_OFFSET * 2;
        if (label.getBBox().width > wrapperWidth) {
            var text = textAbbreviate(label.attr('text'), label.attr('fontSize'), wrapperWidth, this.container);
            label.attr('text', text);
        }
    };
    TreemapLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            offsetX: 0,
            offsetY: 0,
            style: clone(labelStyle),
        };
    };
    TreemapLabel.prototype.getGeometry = function () {
        return find(this.view.geometries, function (geom) { return geom.type === 'polygon'; });
    };
    return TreemapLabel;
}());
export default TreemapLabel;
//# sourceMappingURL=label.js.map