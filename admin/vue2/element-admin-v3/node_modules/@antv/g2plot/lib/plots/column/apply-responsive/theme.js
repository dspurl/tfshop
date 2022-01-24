"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../../util/responsive/theme");
/** 组装theme */
var columnTheme = {
    label: {
        top: {
            constraints: [{ name: 'elementCollision' }],
            rules: {
                elementCollision: [
                    { name: 'nodeJitterUpward' },
                    {
                        name: 'nodesResamplingByState',
                        option: {
                            keep: ['min', 'max', 'median'],
                        },
                    },
                    {
                        name: 'textHide',
                    },
                ],
            },
        },
    },
};
theme_1.registerResponsiveTheme('column', columnTheme);
//# sourceMappingURL=theme.js.map