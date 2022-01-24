"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../../../../components/label/base");
var point_auto_1 = tslib_1.__importDefault(require("../../../../components/label/point-auto"));
var view_1 = require("../../../../util/view");
var math_1 = require("../../../../util/math");
var color_1 = require("../../../../util/color");
var AreaPointAutoLabel = /** @class */ (function (_super) {
    tslib_1.__extends(AreaPointAutoLabel, _super);
    function AreaPointAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaPointAutoLabel.prototype.layoutLabels = function (geometry, labels) {
        _super.prototype.layoutLabels.call(this, geometry, labels);
        this.adjustAreaLabelsStyle(labels);
    };
    AreaPointAutoLabel.prototype.adjustAreaLabelsStyle = function (labels) {
        var view = this.view;
        var _a = this.options, darkStyle = _a.darkStyle, lightStyle = _a.lightStyle;
        var areaGeometry = view_1.getGeometryByType(view, 'area');
        var areas = view_1.getGeometryShapes(areaGeometry).sort(function (left, right) {
            return right.getBBox().height - left.getBBox().height;
        });
        util_1.each(labels, function (label) {
            var labelBBox = label.getBBox();
            var points = math_1.getStrokePoints(labelBBox.x, labelBBox.y, labelBBox.width, labelBBox.height);
            var match = util_1.map(areas, function (area) { return ({
                area: area,
                matches: util_1.filter(points, function (point) { return !!area.isHit(point[0], point[1]); }).length,
            }); }).sort(function (left, right) { return left.matches - right.matches; });
            if (util_1.last(match).matches > 0) {
                var bgColor = util_1.last(match).area.attr('fill');
                var fillWhite = color_1.isContrastColorWhite(bgColor);
                label.attr({
                    fill: fillWhite ? lightStyle === null || lightStyle === void 0 ? void 0 : lightStyle.fill : darkStyle === null || darkStyle === void 0 ? void 0 : darkStyle.fill,
                    fillOpacity: fillWhite ? lightStyle.fillOpacity : darkStyle.fillOpacity,
                    stroke: fillWhite ? lightStyle === null || lightStyle === void 0 ? void 0 : lightStyle.stroke : darkStyle === null || darkStyle === void 0 ? void 0 : darkStyle.stroke,
                });
            }
        });
    };
    return AreaPointAutoLabel;
}(point_auto_1.default));
exports.default = AreaPointAutoLabel;
base_1.registerLabelComponent('area-point-auto', AreaPointAutoLabel);
//# sourceMappingURL=area-point-auto.js.map