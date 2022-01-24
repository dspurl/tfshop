"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var bbox_1 = tslib_1.__importDefault(require("../../../util/bbox"));
var LABEL_MARGIN = 4;
var ACTIVE_OPACITY = 1;
var DEACTIVE_OPACITY = 0.1;
var HeatmapLegend = /** @class */ (function () {
    function HeatmapLegend(cfg) {
        this.destroyed = false;
        this.dataSlides = {};
        var defaultOptions = this.getDefaultOptions();
        if (cfg.plot.options.theme && cfg.plot.options.theme === 'dark') {
            defaultOptions = this.getDarkOptions();
        }
        this.options = util_1.deepMix({}, defaultOptions, cfg);
        this.view = this.options.view;
        this.afterRender = true;
        this.init();
    }
    HeatmapLegend.prototype.init = function () {
        this.layout = this.getLayout();
        this.width = this.options.width ? this.options.width : this.getDefaultWidth();
        this.height = this.options.height ? this.options.height : this.getDefaultHeight();
        var plotContainer = this.options.plot.container;
        this.container = plotContainer.addGroup();
    };
    HeatmapLegend.prototype.render = function () {
        var scales = this.getScales();
        var colorField = this.options.plot.options.colorField;
        this.colorScale = scales[colorField];
        var _a = this.colorScale, min = _a.min, max = _a.max;
        var color = this.options.plot.options.color;
        if (this.layout === 'horizontal') {
            this.renderHorizontal(min, max, color);
        }
        else {
            this.renderVertical(min, max, color);
        }
        this.legendLayout();
        this.addInteraction();
        this.options.plot.canvas.draw();
    };
    HeatmapLegend.prototype.hide = function () {
        this.container.set('visible', false);
        this.options.plot.canvas.draw();
    };
    HeatmapLegend.prototype.show = function () {
        this.container.set('visible', true);
        this.options.plot.canvas.draw();
    };
    HeatmapLegend.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    HeatmapLegend.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    HeatmapLegend.prototype.getBBox = function () {
        var origin_bbox = this.container.getBBox();
        return new bbox_1.default(this.x, this.y, origin_bbox.width, origin_bbox.height);
    };
    HeatmapLegend.prototype.renderVertical = function (min, max, colors) {
        var _this = this;
        var gridWidth = this.width;
        var gridHeight = this.height / colors.length;
        var gridLineContainer = this.container.addGroup();
        var gridColors = util_1.clone(colors).reverse();
        var valueStep = (max - min) / colors.length;
        // 绘制色彩格子
        util_1.each(gridColors, function (c, i) {
            var y = gridHeight * i;
            // 记录每个grid代表的区间信息用于legend交互
            var appendInfo = { to: max - valueStep * i, from: max - valueStep * (i + 1) };
            var rect = _this.container.addShape('rect', {
                attrs: {
                    x: 0,
                    y: y,
                    width: gridWidth,
                    height: gridHeight,
                    fill: c,
                    opacity: ACTIVE_OPACITY,
                    cursor: 'pointer',
                },
                name: 'legend',
            });
            rect.set('info', appendInfo);
            var dataSlide = _this.getDataSlide(appendInfo);
            _this.dataSlides[appendInfo.from + "-" + appendInfo.to] = { mode: 'active', data: dataSlide };
            gridLineContainer.addShape('path', {
                attrs: tslib_1.__assign({ path: [
                        ['M', 0, y + gridHeight],
                        ['L', gridWidth, y + gridHeight],
                    ] }, _this.options.gridlineStyle),
            });
        });
        // 绘制两边的label
        this.container.addShape('text', {
            attrs: tslib_1.__assign({ text: max, x: gridWidth / 2, y: -LABEL_MARGIN, textAlign: 'center', textBaseline: 'bottom' }, this.options.text.style),
            name: 'legend-label',
        });
        this.container.addShape('text', {
            attrs: tslib_1.__assign(tslib_1.__assign({ text: min, x: gridWidth / 2, y: this.height + LABEL_MARGIN, textAlign: 'center', textBaseline: 'top' }, this.options.text.style), { name: 'legend-label' }),
        });
        // 绘制包围线
        gridLineContainer.addShape('path', {
            attrs: tslib_1.__assign({ path: [
                    ['M', 0, 0],
                    ['L', this.width, 0],
                    ['L', this.width, this.height],
                    ['L', 0, this.height],
                    ['L', 0, 0],
                ] }, this.options.gridlineStyle),
        });
    };
    HeatmapLegend.prototype.renderHorizontal = function (min, max, colors) {
        var _this = this;
        var gridWidth = this.width / colors.length;
        var gridHeight = this.height;
        var gridLineContainer = this.container.addGroup();
        var valueStep = (max - min) / colors.length;
        // 绘制色彩格子
        util_1.each(colors, function (c, i) {
            var x = gridWidth * i;
            // 记录每个grid代表的区间信息用于legend交互
            var appendInfo = { from: valueStep * i, to: valueStep * (i + 1) };
            var rect = _this.container.addShape('rect', {
                attrs: {
                    x: x,
                    y: 0,
                    width: gridWidth,
                    height: gridHeight,
                    fill: c,
                    opacity: 0.8,
                    cursor: 'pointer',
                },
                name: 'legend',
            });
            rect.set('info', appendInfo);
            gridLineContainer.addShape('path', {
                attrs: tslib_1.__assign({ path: [
                        ['M', x + gridWidth, 0],
                        ['L', x + gridWidth, gridHeight],
                    ] }, _this.options.gridlineStyle),
            });
        });
        // 绘制两边的label
        this.container.addShape('text', {
            attrs: tslib_1.__assign(tslib_1.__assign({ text: min, x: -LABEL_MARGIN, y: gridHeight / 2 }, this.options.text.style), { textAlign: 'right', textBaseline: 'middle' }),
            name: 'legend-label',
        });
        this.container.addShape('text', {
            attrs: tslib_1.__assign({ text: max, x: this.width + LABEL_MARGIN, y: gridHeight / 2, textAlign: 'left', textBaseline: 'middle' }, this.options.text.style),
            name: 'legend-label',
        });
        // 绘制包围线
        gridLineContainer.addShape('path', {
            attrs: tslib_1.__assign({ path: [
                    ['M', 0, 0],
                    ['L', this.width, 0],
                    ['L', this.width, this.height],
                    ['L', 0, this.height],
                    ['L', 0, 0],
                ] }, this.options.gridlineStyle),
        });
    };
    HeatmapLegend.prototype.getLayout = function () {
        var positions = this.options.position.split('-');
        this.position = positions[0];
        if (positions[0] === 'left' || positions[0] === 'right') {
            return 'vertical';
        }
        return 'horizontal';
    };
    HeatmapLegend.prototype.getDefaultWidth = function () {
        if (this.layout === 'horizontal') {
            var width = this.options.plot.options.width;
            return width * 0.5;
        }
        return 10;
    };
    HeatmapLegend.prototype.getDefaultHeight = function () {
        if (this.layout === 'vertical') {
            var height = this.options.plot.options.height;
            return height * 0.5;
        }
        return 10;
    };
    HeatmapLegend.prototype.legendLayout = function () {
        var _this = this;
        var bleeding = this.options.plot.getPlotTheme().bleeding;
        if (util_1.isArray(bleeding)) {
            util_1.each(bleeding, function (it, index) {
                if (typeof bleeding[index] === 'function') {
                    bleeding[index] = bleeding[index](_this.options.plot.options);
                }
            });
        }
        var bbox = this.container.getBBox();
        var x = 0;
        var y = 0;
        var positions = this.options.position.split('-');
        var plotWidth = this.options.plot.width;
        var plotHeight = this.options.plot.height;
        // 先确定x
        if (positions[0] === 'left') {
            x = bleeding[3];
        }
        else if (positions[0] === 'right') {
            x = plotWidth - bleeding[1] - bbox.width;
        }
        else if (positions[1] === 'center') {
            x = (plotWidth - bbox.width) / 2;
        }
        else if (positions[1] === 'left') {
            x = bleeding[3];
        }
        else if (positions[1] === 'right') {
            x = this.options.plot.width - bleeding[1] - bbox.width;
        }
        // 再确定y
        if (positions[0] === 'bottom') {
            y = plotHeight - bleeding[2] - bbox.height;
        }
        else if (positions[0] === 'top') {
            y = this.getTopPosition(bleeding);
        }
        else if (positions[1] === 'center') {
            y = (plotHeight - bbox.height) / 2;
        }
        else if (positions[1] === 'top') {
            y = bleeding[0];
        }
        else if (positions[1] === 'bottom') {
            y = plotHeight - bleeding[2] - bbox.height;
        }
        this.x = x;
        this.y = y;
        this.container.translate(x, y);
    };
    HeatmapLegend.prototype.getDefaultOptions = function () {
        return {
            text: {
                style: {
                    fontSize: 12,
                    fill: 'rgba(0, 0, 0, 0.45)',
                },
            },
            gridlineStyle: {
                lineWidth: 1,
                stroke: 'rgba(0, 0, 0, 0.45)',
            },
        };
    };
    HeatmapLegend.prototype.getDarkOptions = function () {
        return {
            text: {
                style: {
                    fontSize: 12,
                    fill: 'rgba(255, 255, 255, 0.45)',
                },
            },
            gridlineStyle: {
                lineWidth: 1,
                stroke: 'rgba(255, 255, 255, 0.25)',
            },
        };
    };
    HeatmapLegend.prototype.addInteraction = function () {
        var _this = this;
        var colorField = this.options.plot.options.colorField;
        this.container.on('click', function (ev) {
            var target = ev.target;
            if (target.get('name') === 'legend') {
                var appendInfo = target.get('info');
                var targetInfo = appendInfo.from + "-" + appendInfo.to;
                var relativeData = _this.dataSlides[targetInfo];
                if (relativeData.mode === 'active') {
                    relativeData.mode = 'deactive';
                    target.stopAnimate();
                    target.animate({
                        opacity: DEACTIVE_OPACITY,
                    }, 200);
                }
                else {
                    relativeData.mode = 'active';
                    target.stopAnimate();
                    target.animate({
                        opacity: ACTIVE_OPACITY,
                    }, 200);
                }
                var filteredData = _this.getFilteredData();
                if (filteredData.length > 0) {
                    _this.view.changeData(filteredData);
                    //this.view.set('data', filteredData);
                    _this.view.scale(colorField, {
                        min: _this.colorScale.min,
                        max: _this.colorScale.max,
                        nice: _this.colorScale.nice,
                    });
                    _this.view.render();
                }
            }
        });
    };
    HeatmapLegend.prototype.getFilteredData = function () {
        var filteredData = [];
        util_1.each(this.dataSlides, function (s) {
            if (s.mode == 'active') {
                filteredData.push.apply(filteredData, s.data);
            }
        });
        return filteredData;
    };
    //预先对数据进行分组
    HeatmapLegend.prototype.getDataSlide = function (range) {
        var slide = [];
        var _a = this.options.plot.options, colorField = _a.colorField, data = _a.data;
        util_1.each(data, function (d) {
            var value = d[colorField];
            if (value >= range.from && value < range.to) {
                slide.push(d);
            }
        });
        return slide;
    };
    HeatmapLegend.prototype.getTopPosition = function (bleeding) {
        if (this.options.plot.description) {
            var bbox = this.options.plot.description.getBBox();
            return bbox.maxY + 10;
        }
        else if (this.options.plot.title) {
            var bbox = this.options.plot.title.getBBox();
            return bbox.maxY + 10;
        }
        return bleeding[0];
    };
    HeatmapLegend.prototype.getScales = function () {
        var scales;
        util_1.each(this.view.geometries, function (geom) {
            if (geom.type === 'heatmap') {
                scales = geom.scales;
            }
        });
        return scales;
    };
    return HeatmapLegend;
}());
exports.default = HeatmapLegend;
//# sourceMappingURL=legend.js.map