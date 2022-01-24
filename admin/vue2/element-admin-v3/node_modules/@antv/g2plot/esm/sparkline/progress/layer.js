import { __extends } from "tslib";
import { isArray, mix, hasKey, each, has, isFunction, clone, deepMix, isString, isNumber } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { getGeom } from '../../geoms/factory';
import TinyLayer from '../tiny-layer';
import Marker from './component/marker';
import * as EventParser from './event';
var G2_GEOM_MAP = {
    progress: 'interval',
};
var PLOT_GEOM_MAP = {
    interval: 'progress',
};
var DEFAULT_COLOR = ['#55A6F3', '#E8EDF3'];
var ProgressLayer = /** @class */ (function (_super) {
    __extends(ProgressLayer, _super);
    function ProgressLayer() {
        /**
         * 将进度条配置项转为堆叠条形图配置项
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'progress';
        _this.isEntered = false;
        return _this;
    }
    ProgressLayer.prototype.processProps = function () {
        var props = this.options;
        props.data = this.processData();
        var cfg = {
            padding: [0, 0, 0, 0],
            xField: 'value',
            yField: '1',
            stackField: 'type',
            barSize: props.size ? props.size : this.getSize(),
            barStyle: props.progressStyle,
            color: this.parseColorProps(props) || DEFAULT_COLOR,
        };
        props = mix(props, cfg);
    };
    ProgressLayer.prototype.init = function () {
        this.processProps();
        _super.prototype.init.call(this);
    };
    ProgressLayer.prototype.beforeInit = function () {
        var percent = this.options.percent;
        if (!isNumber(percent)) {
            throw new Error('Percent value is required, and the type of percent must be Number.');
        }
    };
    ProgressLayer.prototype.update = function (cfg) {
        var props = this.options;
        if (hasKey(cfg, 'percent')) {
            props.percent = cfg.percent;
            this.changeData(this.processData());
        }
        if (cfg.style) {
            this.styleUpdateAnimation(cfg.style);
            this.updateColorConfigByStyle(cfg.style);
        }
        if (cfg.color) {
            var style = void 0;
            if (isArray(cfg.color)) {
                this.options.color = cfg.color;
                style = [{ fill: cfg.color[0] }, { fill: cfg.color[1] }];
            }
            else {
                this.options.color[0] = cfg.color;
                style = { fill: cfg.color };
            }
            this.styleUpdateAnimation(style);
        }
        if (cfg.marker) {
            this.updateMarkers(cfg.marker);
            this.options.marker = cfg.marker;
        }
    };
    ProgressLayer.prototype.destroy = function () {
        if (this.markers && this.markers.length > 0) {
            each(this.markers, function (marker) {
                marker.destroy();
            });
            this.markers = [];
        }
        _super.prototype.destroy.call(this);
    };
    ProgressLayer.prototype.afterRender = function () {
        var _this = this;
        if (this.options.marker && !this.markers) {
            this.markers = [];
            each(this.options.marker, function (cfg) {
                var markerCfg = mix({
                    canvas: _this.canvas,
                    view: _this.view,
                    progressSize: _this.options.barSize,
                }, cfg);
                var marker = new Marker(markerCfg);
                _this.markers.push(marker);
            });
        }
        var progressContainer = this.view.geometries[0].container;
        var bbox = progressContainer.getBBox();
        var rect = progressContainer.addShape('rect', {
            attrs: {
                width: bbox.width,
                height: bbox.height,
                x: bbox.minX,
                y: bbox.minY,
                fill: 'rgba(0,0,0,0)',
            },
        });
        this.canvas.draw();
        rect.on('mouseenter', function (ev) {
            _this.isEntered = true;
            _this.view.emit('progress:mouseenter', ev);
        });
        rect.on('mouseleave', function (ev) {
            _this.isEntered = false;
            _this.view.emit('progress:mouseleave', ev);
        });
        var canvasDom = this.canvas.get('container');
        canvasDom.addEventListener('mouseleave', function (ev) {
            if (_this.isEntered) {
                _this.view.emit('progress:mouseleave', ev);
                _this.isEntered = false;
            }
        });
    };
    ProgressLayer.prototype.geometryParser = function (dim, type) {
        if (dim === 'g2') {
            return G2_GEOM_MAP[type];
        }
        return PLOT_GEOM_MAP[type];
    };
    ProgressLayer.prototype.coord = function () {
        this.setConfig('coordinate', {
            actions: [['transpose']],
        });
    };
    ProgressLayer.prototype.addGeometry = function () {
        var props = this.options;
        var bar = getGeom('interval', 'main', {
            positionFields: [props.yField, props.xField],
            plot: this,
        });
        bar.adjust = [
            {
                type: 'stack',
            },
        ];
        if (has(props, 'animation')) {
            bar.animate = props.animation;
        }
        this.setConfig('geometry', bar);
    };
    ProgressLayer.prototype.parseEvents = function (eventParser) {
        if (eventParser) {
            _super.prototype.parseEvents.call(this, eventParser);
        }
        else {
            _super.prototype.parseEvents.call(this, EventParser);
        }
    };
    ProgressLayer.prototype.parseColorProps = function (props) {
        var colorOption;
        if (props.color) {
            if (isFunction(props.color)) {
                colorOption = props.color(props.percent);
            }
            else {
                colorOption = props.color;
            }
            if (isString(colorOption)) {
                var color = clone(DEFAULT_COLOR);
                color[0] = colorOption;
                return color;
            }
            else {
                return colorOption;
            }
        }
        return props.color;
    };
    ProgressLayer.prototype.processData = function () {
        var props = this.options;
        var data = [
            { type: 'current', value: props.percent },
            { type: 'rest', value: 1.0 - props.percent },
        ];
        return data;
    };
    ProgressLayer.prototype.updateMarkers = function (markerCfg) {
        var markerLength = markerCfg.length;
        var animationOptions = this.getUpdateAnimationOptions();
        // marker diff
        each(this.markers, function (marker, index) {
            if (index > markerLength - 1) {
                marker.destroy();
            }
            else {
                marker.update(markerCfg[index], animationOptions.duration, animationOptions.easing);
            }
        });
        // add new markers
        if (this.markers.length < markerLength) {
            var startIndex = this.markers.length;
            for (var i = startIndex; i < markerLength; i++) {
                var cfg = deepMix({}, {
                    canvas: this.canvas,
                    view: this.view,
                    progressSize: this.options.barSize,
                }, markerCfg[i]);
                var marker = new Marker(cfg);
                this.markers.push(marker);
            }
        }
    };
    ProgressLayer.prototype.getSize = function () {
        var height = this.height;
        if (height >= 50) {
            return 10;
        }
        return 4;
    };
    ProgressLayer.prototype.styleUpdateAnimation = function (style) {
        // style更新动画接受用户animation配置的透传
        var _a = this.getUpdateAnimationOptions(), duration = _a.duration, easing = _a.easing;
        // get geometry shapes
        var progressShapes = [];
        var view = this.view;
        var geometry = view.geometries;
        each(geometry, function (geom) {
            if (geom.type === 'interval') {
                var elements = geom.elements;
                each(elements, function (ele) {
                    progressShapes.push.apply(progressShapes, ele.shape);
                });
            }
        });
        if (isArray(style)) {
            each(style, function (s, index) {
                progressShapes[index].animate(s, duration, easing);
            });
        }
        else {
            progressShapes[0].animate(style, duration, easing);
        }
    };
    ProgressLayer.prototype.getUpdateAnimationOptions = function () {
        var duration = 450;
        var easing = 'easeQuadInOut';
        var animationOptions = this.options.animation;
        if (animationOptions && animationOptions.update) {
            if (animationOptions.update.duration) {
                duration = animationOptions.update.duration;
            }
            if (animationOptions.update.easing) {
                easing = animationOptions.update.easing;
            }
        }
        return { duration: duration, easing: easing };
    };
    ProgressLayer.prototype.updateColorConfigByStyle = function (style) {
        var _this = this;
        if (isArray(style)) {
            each(style, function (s, index) {
                if (s.fill) {
                    _this.options.color[index] = s.fill;
                }
            });
        }
        else if (style.fill) {
            this.options.color[0] = style.fill;
        }
    };
    return ProgressLayer;
}(TinyLayer));
export default ProgressLayer;
registerPlotType('progress', ProgressLayer);
//# sourceMappingURL=layer.js.map