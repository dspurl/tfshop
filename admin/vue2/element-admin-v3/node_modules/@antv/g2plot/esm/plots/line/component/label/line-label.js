import { each, deepMix, clone, find } from '@antv/util';
var DEFAULT_OFFSET = 8;
var LineLabel = /** @class */ (function () {
    function LineLabel(cfg) {
        this.destroyed = false;
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = deepMix(defaultOptions, cfg, {});
        this.init();
    }
    LineLabel.prototype.init = function () {
        var _this = this;
        this.container = this.getGeometry().labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    LineLabel.prototype.render = function () {
        var _this = this;
        var elements = this.getGeometry().elements;
        each(elements, function (ele) {
            var shapeInfo = _this.getShapeInfo(ele.shape);
            var _a = _this.options, style = _a.style, offsetX = _a.offsetX, offsetY = _a.offsetY;
            var formatter = _this.options.formatter;
            var content = formatter ? formatter(shapeInfo.name) : shapeInfo.name;
            _this.container.addShape('text', {
                attrs: deepMix({}, {
                    x: shapeInfo.x + offsetX,
                    y: shapeInfo.y + offsetY,
                    text: content,
                    fill: shapeInfo.color,
                    textAlign: 'left',
                    textBaseline: 'middle',
                }, style),
                name: 'label',
            });
        });
    };
    LineLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    LineLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    LineLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    LineLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    LineLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    LineLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = clone(theme.label.style);
        delete labelStyle.fill;
        return {
            offsetX: DEFAULT_OFFSET,
            offsetY: 0,
            style: labelStyle,
        };
    };
    LineLabel.prototype.getGeometry = function () {
        return find(this.view.geometries, function (geom) { return geom.type === 'line'; });
    };
    LineLabel.prototype.getShapeInfo = function (shape) {
        var originPoints = shape.get('origin').points;
        var lastPoint = originPoints[originPoints.length - 1];
        var color = shape.attr('stroke');
        var seriesField = this.plot.options.seriesField;
        var name = shape.get('origin').data[0][seriesField];
        return { x: lastPoint.x, y: lastPoint.y, color: color, name: name };
    };
    return LineLabel;
}());
export default LineLabel;
//# sourceMappingURL=line-label.js.map