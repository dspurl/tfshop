import { __assign } from "tslib";
import { assign, isArray, each, mix } from '@antv/util';
import { breakText } from '../util/common';
import BBox from '../util/bbox';
/**
 * 图表的文字描述，一般用于生成图表的标题和副标题
 */
var TextDescription = /** @class */ (function () {
    function TextDescription(cfg) {
        this.position = 'top';
        this.destroyed = false;
        assign(this, cfg);
        this.init();
    }
    TextDescription.prototype.getBBox = function () {
        var _this = this;
        if (this.shape) {
            // @ts-ignore
            var bbox = this.shape.getBBox();
            if (this.index === 0) {
                return BBox.fromBBoxObject(bbox);
            }
            var padding_1 = this.plot.theme.description.padding;
            if (isArray(padding_1)) {
                each(padding_1, function (it, index) {
                    if (typeof padding_1[index] === 'function') {
                        padding_1[index] = padding_1[index](_this.plot.options.legend.position);
                    }
                });
            }
            return new BBox(bbox.maxX, bbox.minY, bbox.width, bbox.height);
        }
        return null;
    };
    TextDescription.prototype.clear = function () {
        if (this.shape) {
            // @ts-ignore
            this.shape.attr('text', '');
        }
    };
    TextDescription.prototype.destroy = function () {
        if (this.shape) {
            this.shape.remove();
        }
        this.destroyed = true;
    };
    TextDescription.prototype.init = function () {
        var content = this.textWrapper();
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        this.shape = this.container.addShape('text', {
            attrs: mix({
                x: x,
                y: y,
                text: content,
            }, this.style, {
                textAlign: this.getTextAlign(),
            }),
        });
        // @ts-ignore
        this.shape.name = this.name;
    };
    TextDescription.prototype.getPosition = function () {
        if (this.alignTo === 'left') {
            return { x: this.leftMargin, y: this.topMargin };
        }
        else if (this.alignTo === 'middle') {
            return { x: this.leftMargin + this.wrapperWidth / 2, y: this.topMargin };
        }
        else {
            return { x: this.rightMargin, y: this.topMargin };
        }
    };
    TextDescription.prototype.getTextAlign = function () {
        if (this.alignTo === 'left') {
            return 'left';
        }
        else if (this.alignTo === 'middle') {
            return 'center';
        }
        else {
            return 'right';
        }
    };
    /**
     * 当text过长时，默认换行
     * 1. 注意初始text带换行符的场景
     */
    TextDescription.prototype.textWrapper = function () {
        var width = this.wrapperWidth;
        var style = this.style;
        var textContent = this.text;
        var tShape = this.container.addShape('text', {
            attrs: __assign({ text: '', x: 0, y: 0 }, style),
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
    };
    return TextDescription;
}());
export default TextDescription;
//# sourceMappingURL=description.js.map