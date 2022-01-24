import columnWidth from './column-width';
import elementCollision from './element-collision';
import elementDist from './element-dist';
import elementDistVertical from './element-dist-vertical';
import elementWidth from './element-width';
import minRingThickness from './min-ring-thickness';
import ringThickness from './ring-thickness';
export var constraintsLib = {
    elementDist: elementDist,
    elementDistVertical: elementDistVertical,
    elementCollision: elementCollision,
    elementWidth: elementWidth,
    columnWidth: columnWidth,
    ringThickness: ringThickness,
    minRingThickness: minRingThickness,
};
export function registerResponsiveConstraint(name, constraint) {
    // todo: 防止覆盖
    constraintsLib[name] = constraint;
}
//# sourceMappingURL=index.js.map