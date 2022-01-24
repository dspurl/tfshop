"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var index_1 = require("./constraints/index");
var index_2 = require("./rules/index");
var Responsive = /** @class */ (function () {
    function Responsive(cfg) {
        this.iterationTime = 10;
        this.iterationIndex = 0;
        this.rulesLocker = [];
        this.constraintIndex = 0;
        util_1.assign(this, cfg);
        this.currentConstraint = this.constraints[0];
        if (this.rules) {
            this.iterationTime = this.rules[this.currentConstraint.name].length;
        }
        this._start();
        this._run();
        this._end();
    }
    Responsive.prototype._start = function () {
        if (this.onStart) {
            this.onStart(this.nodes);
        }
    };
    Responsive.prototype._iteration = function () {
        var nodes;
        if (this.nodes.type === 'shape') {
            nodes = this.nodes;
        }
        else {
            nodes = this.nodes;
        }
        if (nodes.type === 'shape') {
            nodes.measureNodes();
        }
        if (this.rules) {
            this._applyRules();
        }
        if (nodes.type === 'shape') {
            nodes.measureNodes();
        }
        if (this.onIteration) {
            this.onIteration(this.nodes);
        }
    };
    Responsive.prototype._end = function () {
        if (this.onEnd) {
            this.onEnd(this.nodes);
        }
    };
    Responsive.prototype._run = function () {
        var constraintPassed = this._constraintsTest();
        while (!constraintPassed) {
            if (this.iterationIndex > this.iterationTime - 1) {
                break;
            }
            this._iteration();
            constraintPassed = this._constraintsTest();
            this.iterationIndex++;
        }
        if (this.constraintIndex < this.constraints.length - 1) {
            this.constraintIndex++;
            this.currentConstraint = this.constraints[this.constraintIndex];
            this.iterationTime = this.rules ? this.rules[this.currentConstraint.name].length : 1;
            this.iterationIndex = 0;
            this._run();
        }
    };
    Responsive.prototype._constraintsTest = function () {
        var constraint = index_1.constraintsLib[this.currentConstraint.name];
        var constraintOption = this.currentConstraint.option;
        if (constraint.usage === 'compare') {
            return this._constraintCompare(constraint, constraintOption);
        }
        return this._constraintAssignment(constraint, constraintOption);
    };
    Responsive.prototype._constraintCompare = function (constraint, option) {
        var type = constraint.type, expression = constraint.expression;
        var nodes = this.nodes.nodes;
        if (type === 'chain') {
            return this._chainConstraintCompare(expression, nodes, option);
        }
        if (type === 'padding') {
            return this._paddingConstraintCompare(expression, this.region, nodes, option);
        }
        if (type === 'group') {
            return this._groupConstraintCompare(expression, nodes, option);
        }
    };
    Responsive.prototype._chainConstraintCompare = function (expression, nodes, option) {
        for (var i = 0; i < nodes.length - 1; i++) {
            var a = nodes[i];
            var b = nodes[i + 1];
            if (expression(a, b, option) === false) {
                return false;
            }
        }
        return true;
    };
    Responsive.prototype._paddingConstraintCompare = function (expression, region, nodes, option) {
        if (region) {
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                if (expression(node, region, option) === false) {
                    return false;
                }
            }
        }
        return true;
    };
    Responsive.prototype._groupConstraintCompare = function (expression, nodes, option) {
        for (var i = 0; i < nodes.length; i++) {
            var a = nodes[i];
            for (var j = 0; j < nodes.length; j++) {
                if (j !== i) {
                    var b = nodes[j];
                    if (expression(a, b, option) === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Responsive.prototype._constraintAssignment = function (constraint, option) {
        var type = constraint.type, expression = constraint.expression;
        var nodes = this.nodes.nodes;
        if (type === 'chain') {
            return this._chainConstraintAssign();
        }
        if (type === 'padding') {
            return this._paddingConstraintAssign(expression, this.region, nodes, option);
        }
    };
    Responsive.prototype._chainConstraintAssign = function () {
        return true;
    };
    Responsive.prototype._paddingConstraintAssign = function (expression, region, nodes, option) {
        if (region) {
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var node = nodes_2[_i];
                var value = expression(node, region, option);
                node.value = value;
            }
        }
        return true;
    };
    Responsive.prototype._applyRules = function () {
        var ruleCfg = this.rules[this.currentConstraint.name][this.iterationIndex];
        // if (this.rulesLocker.indexOf(ruleCfg) < 0) {
        var rule = index_2.rulesLib[ruleCfg.name];
        var option = ruleCfg.option ? ruleCfg.option : {};
        var nodes = this.nodes.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            /** apply rule上下文 */
            this._applyRule(node.shape, rule, option, i);
        }
        // this.rulesLocker.push(ruleCfg);
        // }
    };
    Responsive.prototype._applyRule = function (shape, rule, option, index) {
        var cfg = {
            nodes: this.nodes,
            region: this.region,
            plot: this.plot,
        };
        // rule(shape, option, index, this);
        rule(shape, option, index, cfg);
    };
    return Responsive;
}());
exports.default = Responsive;
//# sourceMappingURL=responsive.js.map