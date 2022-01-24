"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var bbox_1 = tslib_1.__importDefault(require("../../../util/bbox"));
var LABEL_MARGIN = 4;
var MatrixLegend = /** @class */ (function () {
    function MatrixLegend(cfg) {
        this.destroyed = false;
        this.dataSlides = {};
        this.interactiveEvents = {};
        var defaultOptions = this.getDefaultOptions();
        this.options = util_1.deepMix({}, defaultOptions, cfg);
        this.view = this.options.view;
        this.afterRender = true;
        this.init();
    }
    MatrixLegend.prototype.init = function () {
        var _this = this;
        this.layout = this.getLayout();
        this.width = this.options.width ? this.options.width : this.getDefaultWidth();
        this.height = this.options.height ? this.options.height : this.getDefaultHeight();
        var plotContainer = this.options.plot.container;
        if (this.container) {
            this.container.remove();
        }
        this.container = plotContainer.addGroup();
        this.view.on('beforerender', function () {
            _this.clear();
            _this.options.plot.canvas.draw();
        });
    };
    MatrixLegend.prototype.render = function () {
        var scales = this.view.geometries[0].scales;
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
    };
    MatrixLegend.prototype.hide = function () {
        this.container.set('visible', false);
        this.options.plot.canvas.draw();
    };
    MatrixLegend.prototype.show = function () {
        this.container.set('visible', true);
        this.options.plot.canvas.draw();
    };
    MatrixLegend.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    MatrixLegend.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.offEvent();
        this.destroyed = true;
    };
    MatrixLegend.prototype.getBBox = function () {
        var origin_bbox = this.container.getBBox();
        return new bbox_1.default(this.x, this.y, origin_bbox.width, origin_bbox.height);
    };
    MatrixLegend.prototype.renderVertical = function (min, max, colors) {
        var _this = this;
        var valueStep = (max - min) / (colors.length - 1);
        var colorStep = 1 / (colors.length - 1);
        var tickStep = this.height / (colors.length - 1);
        var gradientColor = 'l(90)';
        util_1.each(colors, function (c, index) {
            var stepNum = colorStep * index;
            gradientColor += stepNum + ":" + c + " ";
        });
        this.container.addShape('rect', {
            attrs: {
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                fill: gradientColor,
            },
            name: 'legend',
        });
        // draw tick and label
        util_1.each(colors, function (c, index) {
            // tick
            var step = tickStep * index;
            _this.container.addShape('path', {
                attrs: tslib_1.__assign({ path: [
                        ['M', 0, step],
                        ['L', _this.width, step],
                    ] }, _this.options.ticklineStyle),
            });
            // value
            var value = Math.round(valueStep * index);
            _this.container.addShape('text', {
                attrs: tslib_1.__assign({ text: value, textAlign: 'left', textBaseline: 'middle', x: _this.width + LABEL_MARGIN, y: step }, _this.options.text.style),
                name: 'legend-label',
            });
        });
        //anchor
        var tri_width = 10;
        var tri_height = 14;
        var tri_path = [['M', -tri_width, -tri_height / 2], ['L', 0, 0], ['L', -tri_width, tri_height / 2], ['Z']];
        this.anchor = this.container.addShape('path', {
            attrs: tslib_1.__assign({ path: tri_path }, this.options.anchorStyle),
        });
        this.anchor.set('visible', false);
    };
    MatrixLegend.prototype.renderHorizontal = function (min, max, colors) {
        var _this = this;
        var valueStep = (max - min) / (colors.length - 1);
        var colorStep = 1 / (colors.length - 1);
        var tickStep = this.width / (colors.length - 1);
        var gradientColor = 'l(0)';
        util_1.each(colors, function (c, index) {
            var stepNum = colorStep * index;
            gradientColor += stepNum + ":" + c + " ";
        });
        this.container.addShape('rect', {
            attrs: {
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                fill: gradientColor,
            },
            name: 'legend',
        });
        // draw tick and label
        util_1.each(colors, function (c, index) {
            // tick
            var step = tickStep * index;
            _this.container.addShape('path', {
                attrs: tslib_1.__assign({ path: [
                        ['M', step, 0],
                        ['L', step, _this.height],
                    ] }, _this.options.ticklineStyle),
                name: 'legend-label',
            });
            // value
            var value = Math.round(valueStep * index);
            _this.container.addShape('text', {
                attrs: tslib_1.__assign({ text: value, textAlign: 'center', textBaseline: 'top', x: step, y: _this.height + LABEL_MARGIN }, _this.options.text.style),
            });
        });
        //anchor
        var tri_width = 14;
        var tri_height = 10;
        var tri_path = [['M', 0, 0], ['L', -tri_width / 2, -tri_height], ['L', tri_width / 2, -tri_height], ['Z']];
        this.anchor = this.container.addShape('path', {
            attrs: tslib_1.__assign({ path: tri_path }, this.options.anchorStyle),
        });
        this.anchor.set('visible', false);
    };
    MatrixLegend.prototype.getLayout = function () {
        var positions = this.options.position.split('-');
        this.position = positions[0];
        if (positions[0] === 'left' || positions[0] === 'right') {
            return 'vertical';
        }
        return 'horizontal';
    };
    MatrixLegend.prototype.getDefaultWidth = function () {
        if (this.layout === 'horizontal') {
            var width = this.view.coordinateBBox.width;
            return width;
        }
        return 10;
    };
    MatrixLegend.prototype.getDefaultHeight = function () {
        if (this.layout === 'vertical') {
            var height = this.view.coordinateBBox.height;
            return height;
        }
        return 10;
    };
    MatrixLegend.prototype.legendLayout = function () {
        var _this = this;
        var panelRange = this.view.coordinateBBox;
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
            // default
            if (this.width === panelRange.width) {
                x = panelRange.x;
            }
            else {
                x = (plotWidth - bbox.width) / 2;
            }
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
            // default
            if (this.height === panelRange.height) {
                y = panelRange.y;
            }
            else {
                //用户自行设定
                y = (plotHeight - bbox.height) / 2;
            }
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
    MatrixLegend.prototype.getDefaultOptions = function () {
        return {
            text: {
                style: {
                    fontSize: 12,
                    fill: 'rgba(0, 0, 0, 0.45)',
                },
            },
            ticklineStyle: {
                lineWidth: 1,
                stroke: 'rgba(0, 0, 0, 0.8)',
            },
            anchorStyle: {
                fill: 'rgba(0,0,0,0.5)',
            },
            triggerOn: 'mousemove',
        };
    };
    MatrixLegend.prototype.addInteraction = function () {
        var _this = this;
        var geomType;
        if (this.options.plot.options.shapeType === 'rect') {
            geomType = 'polygon';
        }
        else {
            geomType = 'point';
        }
        var eventName = geomType + ":" + this.options.triggerOn;
        //const labelEventName = `label:${this.options.triggerOn}`;
        var field = this.options.plot.options.colorField;
        var _a = this.colorScale, min = _a.min, max = _a.max;
        var geomEventHandler = function (ev) {
            var value = ev.data.data[field];
            var ratio = (value - min) / (max - min);
            _this.moveAnchor(ratio);
        };
        this.view.on(eventName, geomEventHandler);
        this.interactiveEvents[eventName] = {
            target: this.view,
            handler: geomEventHandler,
        };
        /*this.view.on(labelEventName, (ev) => {
          const value = ev.data[field];
          const ratio = (value - min) / (max - min);
          this.moveAnchor(ratio);
        });*/
        var mouseleaveHandler = function () {
            _this.anchor.set('visible', false);
        };
        this.options.plot.canvas.on('mouseleave', mouseleaveHandler);
        this.interactiveEvents.mouseleave = {
            target: this.options.plot.canvas,
            handler: mouseleaveHandler,
        };
    };
    MatrixLegend.prototype.moveAnchor = function (ratio) {
        this.anchor.set('visible', true);
        if (this.layout === 'vertical') {
            var pos = this.height * ratio;
            var ulMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            ulMatrix[7] = pos;
            this.anchor.stopAnimate();
            this.anchor.animate({
                matrix: ulMatrix,
            }, 400, 'easeLinear');
        }
        else {
            var pos = this.width * ratio;
            var ulMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            ulMatrix[6] = pos;
            this.anchor.stopAnimate();
            this.anchor.animate({
                matrix: ulMatrix,
            }, 400, 'easeLinear');
        }
    };
    MatrixLegend.prototype.getTopPosition = function (bleeding) {
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
    MatrixLegend.prototype.offEvent = function () {
        util_1.each(this.interactiveEvents, function (event, key) {
            var target = event.target, handler = event.handler;
            target.off(key, handler);
        });
    };
    return MatrixLegend;
}());
exports.default = MatrixLegend;
//# sourceMappingURL=legend.js.map