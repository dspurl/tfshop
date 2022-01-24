"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../../util/responsive/theme");
/** 组装theme */
var lineTheme = {
    label: {
        point: {
            constraints: [{ name: 'elementCollision' }],
            rules: {
                elementCollision: [{ name: 'nodesResamplingByChange' }, { name: 'clearOverlapping' }],
            },
        },
    },
};
theme_1.registerResponsiveTheme('line', lineTheme);
//# sourceMappingURL=theme.js.map