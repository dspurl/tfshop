import { __assign } from "tslib";
import { each, isArray, isFunction, deepMix } from '@antv/util';
import BBox from '../../../util/bbox';
var Quadrant = /** @class */ (function () {
    function Quadrant(cfg) {
        this.quadrantGroups = [];
        this.regionData = [];
        this.lineData = [];
        this.options = cfg;
        this.view = this.options.view;
        this.init();
    }
    Quadrant.prototype.init = function () {
        var _a = this.options, xBaseline = _a.xBaseline, yBaseline = _a.yBaseline;
        var coord = this.view.getCoordinate();
        // TODO: xBaseline和yBaseline支持百分比
        // 根据 xBaseline 和 yBaseline 分割象限
        var xScale = this.view.getScaleByField(this.options.plotOptions.xField);
        var yScale = this.view.getScaleByField(this.options.plotOptions.yField);
        // 先进行 x 方向的分割
        var xRegion;
        if (xBaseline > xScale.min && xBaseline < xScale.max) {
            var ratio = (xBaseline - xScale.min) / (xScale.max - xScale.min);
            xRegion = [
                new BBox(coord.start.x, coord.end.y, coord.getWidth() * ratio, coord.getHeight()),
                new BBox(coord.start.x + coord.getWidth() * ratio, coord.end.y, coord.getWidth() * (1 - ratio), coord.getHeight()),
            ];
            var verticalLineData = {
                start: { x: coord.start.x + coord.getWidth() * ratio, y: coord.end.y },
                end: { x: coord.start.x + coord.getWidth() * ratio, y: coord.start.y },
            };
            this.lineData.push(verticalLineData);
        }
        else {
            xRegion = [new BBox(coord.start.x, coord.end.y, coord.getWidth(), coord.getHeight())];
        }
        // 再进行 y 方向的分割
        if (yBaseline > yScale.min && yBaseline < yScale.max) {
            var ratio = (yBaseline - yScale.min) / (yScale.max - yScale.min);
            var horizontalLineData = {
                start: { x: coord.start.x, y: coord.start.y - coord.getHeight() * ratio },
                end: { x: coord.end.x, y: coord.start.y - coord.getHeight() * ratio },
            };
            this.lineData.push(horizontalLineData);
            var topQuadrant = {
                name: xBaseline <= xScale.min ? 'top-right' : 'top-left',
                bbox: new BBox(xRegion[0].minX, xRegion[0].minY, xRegion[0].width, xRegion[0].height * (1 - ratio)),
                index: xBaseline <= xScale.min ? 2 : 0,
            };
            this.regionData.push(topQuadrant);
            var bottomQuadrant = {
                name: xBaseline <= xScale.min ? 'bottom-right' : 'bottom-left',
                bbox: new BBox(xRegion[0].minX, xRegion[0].minY + xRegion[0].height * (1 - ratio), xRegion[0].width, xRegion[0].height * ratio),
                index: xBaseline <= xScale.min ? 3 : 1,
            };
            this.regionData.push(bottomQuadrant);
            // 四象限齐全
            if (xRegion.length > 1) {
                var rightTopQuadrant = {
                    name: 'top-right',
                    bbox: new BBox(xRegion[1].minX, xRegion[1].minY, xRegion[1].width, xRegion[1].height * (1 - ratio)),
                    index: 2,
                };
                this.regionData.push(rightTopQuadrant);
                var rightBottomQuadrant = {
                    name: 'bottom-right',
                    bbox: new BBox(xRegion[1].minX, xRegion[1].minY + xRegion[1].height * (1 - ratio), xRegion[1].width, xRegion[1].height * ratio),
                    index: 3,
                };
                this.regionData.push(rightBottomQuadrant);
            }
        }
        else if (xRegion.length === 2) {
            if (yBaseline <= yScale.min) {
                var leftTopQuadrant = {
                    name: 'top-left',
                    bbox: xRegion[0],
                    index: 0,
                };
                this.regionData.push(leftTopQuadrant);
                var rightTopQuadrant = {
                    name: 'top-right',
                    bbox: xRegion[1],
                    index: 2,
                };
                this.regionData.push(rightTopQuadrant);
            }
            else {
                var leftBottomQuadrant = {
                    name: 'bottom-left',
                    bbox: xRegion[0],
                    index: 1,
                };
                this.regionData.push(leftBottomQuadrant);
                var rightBottomQuadrant = {
                    name: 'bottom-right',
                    bbox: xRegion[1],
                    index: 3,
                };
                this.regionData.push(rightBottomQuadrant);
            }
        }
        else {
            // 当前绘制区域全部在一个象限中
            if (xBaseline <= xScale.min) {
                if (yBaseline <= yScale.min) {
                    var rightTopQuadrant = {
                        name: 'top-right',
                        bbox: xRegion[0],
                        index: 2,
                    };
                    this.regionData.push(rightTopQuadrant);
                }
                else {
                    var rightBottomQuadrant = {
                        name: 'bottom-right',
                        bbox: xRegion[0],
                        index: 3,
                    };
                    this.regionData.push(rightBottomQuadrant);
                }
            }
            else {
                if (yBaseline <= yScale.min) {
                    var leftTopQuadrant = {
                        name: 'top-left',
                        bbox: xRegion[0],
                        index: 0,
                    };
                    this.regionData.push(leftTopQuadrant);
                }
                else {
                    var leftBottomQuadrant = {
                        name: 'bottom-left',
                        bbox: xRegion[0],
                        index: 1,
                    };
                    this.regionData.push(leftBottomQuadrant);
                }
            }
        }
        // 创建container
        this.container = this.view.backgroundGroup.addGroup();
    };
    Quadrant.prototype.render = function () {
        var _this = this;
        if (this.regionData.length > 0) {
            var defaultStyle_1 = this.getDefaultStyle();
            var regionStyle_1 = this.getRegionStyle(this.regionData);
            each(this.regionData, function (d) {
                var index = d.index;
                var group = _this.container.addGroup();
                var rect = group.addShape('rect', {
                    attrs: __assign({ x: d.bbox.minX, y: d.bbox.minY, width: d.bbox.width, height: d.bbox.height }, regionStyle_1[index]),
                    name: 'quadrant',
                });
                if (_this.options.label && _this.options.label.text) {
                    var labelOptions = deepMix({}, defaultStyle_1.label, _this.options.label);
                    var labelCfg = _this.getLabelConfig(d, labelOptions);
                    group.addShape('text', {
                        attrs: __assign({}, labelCfg),
                        name: 'quadrant-label',
                    });
                }
                // rect.setSilent('data', d);
                rect.set('data', d);
                _this.quadrantGroups.push(group);
            });
            // 绘制象限辅助线
            var lineStyle_1 = deepMix({}, defaultStyle_1.line, this.options.lineStyle);
            each(this.lineData, function (d) {
                _this.container.addShape('path', {
                    attrs: __assign({ path: [
                            ['M', d.start.x, d.start.y],
                            ['L', d.end.x, d.end.y],
                        ] }, lineStyle_1),
                    name: 'quadrant-line',
                });
            });
            this.view.canvas.draw();
        }
    };
    Quadrant.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    Quadrant.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
    };
    Quadrant.prototype.getDefaultStyle = function () {
        return {
            line: {
                stroke: '#9ba29a',
                lineWidth: 1,
            },
            regionStyle: [
                { fill: '#000000', opacity: 0.05 },
                { fill: '#ffffff', opacity: 0 },
                { fill: '#ffffff', opacity: 0 },
                { fill: '#000000', opacity: 0.05 },
            ],
            label: {
                position: 'outter-inner',
                offset: 10,
                style: {
                    fontSize: 14,
                    fill: '#ccc',
                },
            },
        };
    };
    Quadrant.prototype.getRegionStyle = function (regionData) {
        var defaultStyle = this.getDefaultStyle();
        var style = defaultStyle.regionStyle;
        if (this.options.regionStyle) {
            var regionStyle_2 = this.options.regionStyle;
            if (isArray(regionStyle_2)) {
                style = style.map(function (s, index) {
                    if (regionStyle_2.length > index && regionStyle_2[index]) {
                        return regionStyle_2[index];
                    }
                    return s;
                });
            }
            else if (isFunction(regionStyle_2)) {
                each(regionData, function (d, index) {
                    style[index] = regionStyle_2(d);
                });
            }
        }
        return style;
    };
    Quadrant.prototype.getLabelConfig = function (region, labelOptions) {
        var index = region.index;
        var x = 0;
        var y = 0;
        var style = {};
        var text = labelOptions.text;
        if (isFunction(text)) {
            text = text(region);
        }
        else if (isArray(text)) {
            text = text[index];
        }
        var position = labelOptions.position;
        var pos = position.split('-');
        var dim = region.name.split('-');
        // x方向
        if (dim[1] === 'left') {
            if (pos[0] === 'inner') {
                x = region.bbox.maxX - labelOptions.offset;
                style.textAlign = 'right';
            }
            if (pos[0] === 'outter') {
                x = region.bbox.minX + labelOptions.offset;
                style.textAlign = 'left';
            }
        }
        else if (dim[1] === 'right') {
            if (pos[0] === 'inner') {
                x = region.bbox.minX + labelOptions.offset;
                style.textAlign = 'left';
            }
            if (pos[0] === 'outter') {
                x = region.bbox.maxX - labelOptions.offset;
                style.textAlign = 'right';
            }
        }
        // y方向
        if (dim[0] === 'top') {
            if (pos[1] === 'inner') {
                y = region.bbox.maxY - labelOptions.offset;
                style.textBaseline = 'bottom';
            }
            if (pos[1] === 'outter') {
                y = region.bbox.minY + labelOptions.offset;
                style.textBaseline = 'top';
            }
        }
        else if (dim[0] === 'bottom') {
            if (pos[1] === 'inner') {
                y = region.bbox.minY + labelOptions.offset;
                style.textBaseline = 'top';
            }
            if (pos[1] === 'outter') {
                y = region.bbox.maxY - labelOptions.offset;
                style.textBaseline = 'bottom';
            }
        }
        style = deepMix({}, labelOptions.style, style);
        style.lineHeight = style.fontSize;
        return __assign({ x: x,
            y: y,
            text: text }, style);
    };
    return Quadrant;
}());
export default Quadrant;
//# sourceMappingURL=quadrant.js.map