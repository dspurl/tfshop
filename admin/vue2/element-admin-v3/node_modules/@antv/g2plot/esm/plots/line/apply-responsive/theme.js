import { registerResponsiveTheme } from '../../../util/responsive/theme';
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
registerResponsiveTheme('line', lineTheme);
//# sourceMappingURL=theme.js.map