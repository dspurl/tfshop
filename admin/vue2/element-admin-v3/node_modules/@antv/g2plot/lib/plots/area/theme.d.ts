export declare const DEFAULT_AREA_THEME: {
    areaStyle: {
        normal: {};
        active: (style: any) => {
            opacity: any;
        };
        disable: (style: any) => {
            opacity: number;
        };
        selected: {
            lineWidth: number;
            stroke: string;
        };
    };
    lineStyle: {
        normal: {};
        active: (style: any) => {
            opacity: any;
        };
        disable: (style: any) => {
            opacity: number;
        };
        selected: (style: any) => {
            lineWidth: any;
        };
    };
    pointStyle: {
        normal: {};
        active: (style: any) => {
            radius: any;
            shadowBlur: any;
            shadowColor: any;
            stroke: any;
            strokeOpacity: number;
            lineWidth: number;
        };
        disable: (style: any) => {
            opacity: number;
        };
        selected: (style: any) => {
            radius: any;
            shadowBlur: any;
            shadowColor: any;
            stroke: any;
            strokeOpacity: number;
            lineWidth: number;
        };
    };
    label: {
        darkStyle: {
            fill: string;
            stroke: string;
            fillOpacity: number;
        };
        lightStyle: {
            fill: string;
            fillOpacity: number;
            stroke: string;
        };
    };
};
