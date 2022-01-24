import { registerResponsiveTheme } from '../../../util/responsive/theme';
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
registerResponsiveTheme('column', columnTheme);
//# sourceMappingURL=theme.js.map