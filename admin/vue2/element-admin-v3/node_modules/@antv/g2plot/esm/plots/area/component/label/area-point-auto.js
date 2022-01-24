import { __extends } from "tslib";
import { each, map, filter, last } from '@antv/util';
import { registerLabelComponent } from '../../../../components/label/base';
import PointAutoLabel from '../../../../components/label/point-auto';
import { getGeometryShapes, getGeometryByType } from '../../../../util/view';
import { getStrokePoints } from '../../../../util/math';
import { isContrastColorWhite } from '../../../../util/color';
var AreaPointAutoLabel = /** @class */ (function (_super) {
    __extends(AreaPointAutoLabel, _super);
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
        var areaGeometry = getGeometryByType(view, 'area');
        var areas = getGeometryShapes(areaGeometry).sort(function (left, right) {
            return right.getBBox().height - left.getBBox().height;
        });
        each(labels, function (label) {
            var labelBBox = label.getBBox();
            var points = getStrokePoints(labelBBox.x, labelBBox.y, labelBBox.width, labelBBox.height);
            var match = map(areas, function (area) { return ({
                area: area,
                matches: filter(points, function (point) { return !!area.isHit(point[0], point[1]); }).length,
            }); }).sort(function (left, right) { return left.matches - right.matches; });
            if (last(match).matches > 0) {
                var bgColor = last(match).area.attr('fill');
                var fillWhite = isContrastColorWhite(bgColor);
                label.attr({
                    fill: fillWhite ? lightStyle === null || lightStyle === void 0 ? void 0 : lightStyle.fill : darkStyle === null || darkStyle === void 0 ? void 0 : darkStyle.fill,
                    fillOpacity: fillWhite ? lightStyle.fillOpacity : darkStyle.fillOpacity,
                    stroke: fillWhite ? lightStyle === null || lightStyle === void 0 ? void 0 : lightStyle.stroke : darkStyle === null || darkStyle === void 0 ? void 0 : darkStyle.stroke,
                });
            }
        });
    };
    return AreaPointAutoLabel;
}(PointAutoLabel));
export default AreaPointAutoLabel;
registerLabelComponent('area-point-auto', AreaPointAutoLabel);
//# sourceMappingURL=area-point-auto.js.map