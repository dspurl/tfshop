/**
 * 区域连接组件，用于堆叠柱状图和堆叠条形图
 */
import { each, assign, mix, find } from '@antv/util';
import { compare } from '../base/controller/state';
function parsePoints(shape, coord) {
    var parsedPoints = [];
    var points = shape.get('origin').points;
    each(points, function (p) {
        parsedPoints.push(coord.convertPoint(p));
    });
    return parsedPoints;
}
function getDefaultStyle() {
    return {
        areaStyle: {
            opacity: 0.2,
        },
        lineStyle: {
            lineWidth: 2,
            opacity: 0.1,
        },
    };
}
var ConnectedArea = /** @class */ (function () {
    function ConnectedArea(cfg) {
        this.areas = [];
        this.lines = [];
        this._areaStyle = {};
        this._lineStyle = {};
        assign(this, cfg);
        this._init();
    }
    ConnectedArea.prototype.draw = function () {
        var _this = this;
        var groupedShapes = this._getGroupedShapes();
        each(groupedShapes, function (shapes, name) {
            if (shapes.length > 0) {
                _this._drawConnection(shapes, name);
            }
        });
        if (this.triggerOn) {
            this._addInteraction();
        }
        else if (this.animation) {
            // 如果定义了triggerOn的方式，则组件是响应交互的，初始化为不可见状态，因此无需动画
            this._initialAnimation();
        }
    };
    ConnectedArea.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
        this.areas = [];
        this.lines = [];
    };
    ConnectedArea.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
    };
    ConnectedArea.prototype.setState = function (state, condition) {
        if (state === 'active') {
            this._onActive(condition);
        }
        if (state === 'disabled') {
            this._onDisabled(condition);
        }
        if (state === 'selected') {
            this._onSelected(condition);
        }
    };
    ConnectedArea.prototype._init = function () {
        var _this = this;
        var layer = this.view.backgroundGroup;
        this.container = layer.addGroup();
        this.draw();
        this.view.on('beforerender', function () {
            _this.clear();
        });
    };
    ConnectedArea.prototype._getGroupedShapes = function () {
        var _this = this;
        // 根据堆叠字段对shape进行分组
        var values = this.view.getScaleByField(this.field).values;
        var geometry = this.view.geometries[0];
        var shapes = geometry.getShapes();
        // 创建分组
        var groups = {};
        each(values, function (v) {
            groups[v] = [];
        });
        // 执行分组
        each(shapes, function (shape) {
            var origin = shape.get('origin').data;
            var key = origin[_this.field];
            groups[key].push(shape);
        });
        return groups;
    };
    ConnectedArea.prototype._drawConnection = function (shapes, name) {
        // tslint:disable-next-line: prefer-for-of
        var originColor = shapes[0].attr('fill');
        this._areaStyle[name] = this._getShapeStyle(originColor, 'area');
        this._lineStyle[name] = this._getShapeStyle(originColor, 'line');
        var coord = this.view.geometries[0].coordinate;
        for (var i = 0; i < shapes.length - 1; i++) {
            var current = parsePoints(shapes[i], coord);
            var next = parsePoints(shapes[i + 1], coord);
            var areaStyle = mix({}, this._areaStyle[name]);
            var lineStyle = mix({}, this._lineStyle[name]);
            if (this.triggerOn) {
                areaStyle.opacity = 0;
                lineStyle.opacity = 0;
            }
            var area = this.container.addShape('path', {
                attrs: mix({}, areaStyle, {
                    path: [
                        ['M', current[2].x, current[2].y],
                        ['L', next[1].x, next[1].y],
                        ['L', next[0].x, next[0].y],
                        ['L', current[3].x, current[3].y],
                    ],
                }),
                name: 'connectedArea',
            });
            var line = this.container.addShape('path', {
                attrs: mix({}, lineStyle, {
                    path: [
                        ['M', current[2].x, current[2].y],
                        ['L', next[1].x, next[1].y],
                    ],
                }),
                name: 'connectedArea',
            });
            // 在辅助图形上记录数据，用以交互和响应状态量
            var originData = shapes[i].get('origin').data;
            area.set('data', originData);
            line.set('data', originData);
            this.areas.push(area);
            this.lines.push(line);
        }
    };
    ConnectedArea.prototype._getShapeStyle = function (originColor, shapeType) {
        var styleName = shapeType + "Style";
        // 如果用户自己指定了样式，则不采用默认颜色映射
        if (this[styleName]) {
            return this[styleName];
        }
        var defaultStyle = getDefaultStyle()[styleName];
        var mappedStyle = { fill: originColor };
        if (shapeType === 'line') {
            mappedStyle = { stroke: originColor };
        }
        return mix(defaultStyle, mappedStyle);
    };
    ConnectedArea.prototype._addInteraction = function () {
        var _this = this;
        var eventName = this.triggerOn;
        this.view.on("interval:" + eventName, function (e) {
            var origin = e.target.get('origin').data[_this.field];
            _this.setState('active', {
                name: _this.field,
                exp: origin,
            });
            _this.setState('disabled', {
                name: _this.field,
                exp: function (d) {
                    return d !== origin;
                },
            });
            _this.view.canvas.draw();
        });
        // 当鼠标移动到其他区域时取消显示
        this.view.on('mousemove', function (e) {
            if (e.gEvent.target.get('name') !== 'interval') {
                _this.setState('disabled', {
                    name: _this.field,
                    exp: function () {
                        return true;
                    },
                });
            }
        });
    };
    ConnectedArea.prototype._initialAnimation = function () {
        // clipIn动画
        var _a = this.view.coordinateBBox, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        this.container.setClip({
            type: 'rect',
            attrs: {
                x: x,
                y: y,
                width: 0,
                height: height,
            },
        });
        this.container.set('animating', true);
        this.container.getClip().animate({
            width: width,
        }, 600, 'easeQuadOut', function () { }, // eslint-disable-line @typescript-eslint/no-empty-function
        400);
    };
    ConnectedArea.prototype._onActive = function (condition) {
        var _this = this;
        each(this.areas, function (area) {
            var shapeData = area.get('data');
            var styleField = shapeData[_this.field];
            if (compare(shapeData, condition)) {
                var opacity = _this._areaStyle[styleField].opacity || 1;
                // area.attr('opacity',this._areaStyle[styleField].opacity || 1);
                area.stopAnimate();
                area.animate({ opacity: opacity }, 400, 'easeQuadOut');
            }
        });
        each(this.lines, function (line) {
            var shapeData = line.get('data');
            var styleField = shapeData[_this.field];
            if (compare(shapeData, condition)) {
                var opacity = _this._lineStyle[styleField].opacity || 1;
                // line.attr('opacity',this._lineStyle[styleField].opacity || 1);
                line.stopAnimate();
                line.animate({ opacity: opacity }, 400, 'easeQuadOut');
            }
        });
    };
    ConnectedArea.prototype._onDisabled = function (condition) {
        each(this.areas, function (area) {
            var shapeData = area.get('data');
            if (compare(shapeData, condition)) {
                // area.attr('opacity',0);
                area.stopAnimate();
                area.animate({
                    opacity: 0,
                }, 400, 'easeQuadOut');
            }
        });
        each(this.lines, function (line) {
            var shapeData = line.get('data');
            if (compare(shapeData, condition)) {
                // line.attr('opacity',0);
                line.stopAnimate();
                line.animate({
                    opacity: 0,
                }, 400, 'easeQuadOut');
            }
        });
    };
    ConnectedArea.prototype._onSelected = function (condition) {
        this._onActive(condition);
    };
    ConnectedArea.prototype.getGeometry = function () {
        return find(this.view.geometries, function (geom) { return geom.type === 'interval'; });
    };
    return ConnectedArea;
}());
export default ConnectedArea;
//# sourceMappingURL=connected-area.js.map