import { __assign, __extends } from "tslib";
import { deepMix, each, hasKey } from '@antv/util';
import { registerPlotType } from '../../base/global';
import ViewLayer from '../../base/view-layer';
import squarify from './layout/squarify';
import { INTERACTION_MAP } from './interaction';
import * as EventParser from './event';
import TreemapLabel from './components/label';
var PARENT_NODE_OFFSET = 4;
var BLOCK_MARGIN = 4;
var TreemapLayer = /** @class */ (function (_super) {
    __extends(TreemapLayer, _super);
    function TreemapLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'treemap';
        return _this;
    }
    TreemapLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            maxLevel: 2,
            padding: [0, 0, 0, 0],
            tooltip: {
                visible: false,
                showTitle: false,
                showCrosshairs: false,
                showMarkers: false,
                shared: false,
            },
            legend: {
                visible: false,
            },
            xAxis: {
                visible: false,
            },
            yAxis: {
                visible: false,
            },
            xField: 'x',
            yField: 'y',
            label: {
                visible: true,
                adjustPosition: true,
                style: {
                    stroke: 'rgba(0,0,0,0)',
                    lineWidth: 0,
                    fontSize: 12,
                },
            },
            meta: {
                x: {
                    nice: false,
                },
                y: {
                    nice: false,
                },
            },
            interactions: [{ type: 'tooltip' }],
        });
    };
    TreemapLayer.prototype.beforeInit = function () {
        var _this = this;
        _super.prototype.beforeInit.call(this);
        var interactions = this.options.interactions;
        if (interactions) {
            each(interactions, function (interaction) {
                if (interaction.type === 'drilldown') {
                    _this.isDrilldown = true;
                    _this.options.maxLevel = 1;
                }
            });
        }
        var data = this.options.data;
        var treemapData = this.getTreemapData(data);
        this.rootData = treemapData;
    };
    TreemapLayer.prototype.afterRender = function () {
        _super.prototype.afterRender.call(this);
        if (this.options.label && this.options.label.visible) {
            var label = new TreemapLabel(__assign({ view: this.view, plot: this }, this.options.label));
            label.render();
        }
    };
    TreemapLayer.prototype.geometryParser = function () {
        return 'polygon';
    };
    TreemapLayer.prototype.getTreemapData = function (data, level) {
        var viewRange = this.getViewRange();
        var root = squarify(data, viewRange.x, viewRange.y, viewRange.width, viewRange.height);
        this.recursive(root, 1);
        var treemapData = [];
        this.getAllNodes(root, treemapData, level);
        treemapData.sort(function (a, b) {
            return a.depth - b.depth;
        });
        this.options.xField = 'x';
        this.options.yField = 'y';
        return treemapData;
    };
    TreemapLayer.prototype.processData = function () {
        return this.rootData;
    };
    TreemapLayer.prototype.coord = function () {
        return;
    };
    TreemapLayer.prototype.addGeometry = function () {
        var _this = this;
        var _a = this.options, data = _a.data, colorField = _a.colorField, color = _a.color;
        var treemapData = this.getTreemapData(data);
        this.rootData = treemapData;
        var isNested = this.isNested(treemapData);
        this.rect = {
            type: 'polygon',
            position: {
                fields: ['x', 'y'],
            },
            color: {
                fields: [colorField],
                values: color,
            },
            style: {
                fields: ['depth'],
                callback: function (d) {
                    var defaultStyle = _this.adjustStyleByDepth(d, isNested);
                    return deepMix({}, defaultStyle, _this.options.rectStyle);
                },
            },
            tooltip: {
                fields: ['name', 'value'],
            },
        };
        if (this.options.tooltip && this.options.tooltip.formatter) {
            this.rect.tooltip.callback = this.options.tooltip.formatter;
        }
        this.setConfig('geometry', this.rect);
    };
    TreemapLayer.prototype.applyInteractions = function () {
        var _this = this;
        var interactionCfg = this.options.interactions;
        var interactions = this.view.interactions;
        each(interactionCfg, function (inter) {
            var Ctr = INTERACTION_MAP[inter.type];
            if (Ctr) {
                var interaction = new Ctr(deepMix({}, {
                    view: _this.view,
                    plot: _this,
                    startEvent: 'polygon:click',
                }, inter.cfg, Ctr.getInteractionRange(_this.layerBBox, inter.cfg)));
                interactions[inter.type] = interaction;
            }
        });
    };
    TreemapLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        if (this.isDrilldown) {
            this.rect.animate = false;
        }
    };
    TreemapLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    TreemapLayer.prototype.recursive = function (rows, depth) {
        var _this = this;
        var colorField = this.options.colorField;
        each(rows, function (r) {
            each(r.children, function (c) {
                c.depth = depth;
                if (depth > 1)
                    c.parent = r;
                if (!hasKey(c, colorField)) {
                    c[colorField] = r[colorField];
                }
                c.showLabel = true;
                var leaf = _this.isLeaf(c);
                if (!leaf) {
                    var cliperHeight = Math.abs(c.y1 - c.y0);
                    var labelHeight = _this.getLabelHeight();
                    var parentLabelOffset = cliperHeight / 2 > labelHeight ? labelHeight : BLOCK_MARGIN;
                    c.showLabel = parentLabelOffset === BLOCK_MARGIN ? false : true;
                    var c_rows = squarify(c, c.x0 + BLOCK_MARGIN, c.y0 + parentLabelOffset, c.x1 - BLOCK_MARGIN, c.y1 - BLOCK_MARGIN);
                    _this.fillColorField(c_rows, colorField, c[colorField]);
                    _this.recursive(c_rows, c.depth + 1);
                }
            });
        });
    };
    TreemapLayer.prototype.getAllNodes = function (data, nodes, level) {
        var _this = this;
        var max = level ? level : this.options.maxLevel;
        var viewRange = this.getViewRange();
        each(data, function (d) {
            if (hasKey(d, 'x0') && d.depth <= max) {
                nodes.push(__assign(__assign({}, d), { x: [d.x0, d.x1, d.x1, d.x0], y: [viewRange.height - d.y1, viewRange.height - d.y1, viewRange.height - d.y0, viewRange.height - d.y0] }));
            }
            if (hasKey(d, 'children')) {
                _this.getAllNodes(d.children, nodes);
            }
        });
    };
    TreemapLayer.prototype.fillColorField = function (rows, fieldName, value) {
        each(rows, function (r) {
            if (!hasKey(r, fieldName)) {
                r[fieldName] = value;
            }
        });
    };
    TreemapLayer.prototype.getLabelHeight = function () {
        var label = this.options.label;
        var fontSize = this.getPlotTheme().label.style.fontSize;
        var size = 0;
        if (label && label.visible) {
            var labelStyle = label.style;
            size = labelStyle && labelStyle.fontSize ? labelStyle.fontSize : fontSize;
        }
        return size + PARENT_NODE_OFFSET * 2;
    };
    TreemapLayer.prototype.isLeaf = function (data) {
        return !data.children || data.children.length === 0;
    };
    TreemapLayer.prototype.isNested = function (data) {
        var maxLevel = this.options.maxLevel;
        if (maxLevel === 1) {
            return false;
        }
        var nested = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].children) {
                nested = true;
                break;
            }
        }
        return nested;
    };
    TreemapLayer.prototype.adjustStyleByDepth = function (depth, isNested) {
        var maxLevel = this.options.maxLevel;
        if (!isNested) {
            return {
                lineWidth: 1,
                stroke: 'rgba(0,0,0,0.9)',
                opacity: 0.9,
            };
        }
        else if (depth === 1) {
            return {
                lineWidth: 1,
                stroke: 'black',
                opacity: depth / maxLevel,
            };
        }
        else {
            return {
                lineWidth: 1,
                stroke: 'rgba(0,0,0,0.3)',
                opacity: depth / maxLevel,
            };
        }
    };
    return TreemapLayer;
}(ViewLayer));
export default TreemapLayer;
registerPlotType('treemap', TreemapLayer);
//# sourceMappingURL=layer.js.map