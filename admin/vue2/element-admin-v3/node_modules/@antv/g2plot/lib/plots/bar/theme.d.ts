export declare const DEFAULT_BAR_THEME: {
    label: {
        darkStyle: {
            fill: string;
            stroke: string;
            fillOpacity: number;
        };
        lightStyle: {
            fill: string;
            stroke: string;
            fillOpacity: number;
        };
    };
    columnStyle: {
        normal: {};
        active: (style: any) => {
            opacity: number;
        };
        disable: (style: any) => {
            opacity: number;
        };
        selected: {
            lineWidth: number;
            stroke: string;
        };
    };
};
