export declare const DEFAULT_RESPONSIVE_THEME: {
    axis: {
        x: {
            category: {
                constraints: {
                    name: string;
                }[];
                rules: {
                    elementDist: ({
                        name: string;
                        option: {
                            lineNumber: number;
                            degree?: undefined;
                            abbreviateBy?: undefined;
                        };
                    } | {
                        name: string;
                        option: {
                            degree: number;
                            lineNumber?: undefined;
                            abbreviateBy?: undefined;
                        };
                    } | {
                        name: string;
                        option: {
                            abbreviateBy: string;
                            lineNumber?: undefined;
                            degree?: undefined;
                        };
                    } | {
                        name: string;
                        option?: undefined;
                    })[];
                };
            };
            linear: {
                constraints: {
                    name: string;
                }[];
                rules: {
                    elementDist: ({
                        name: string;
                        option: {
                            keep: string[];
                            degree?: undefined;
                            unit?: undefined;
                            decimal?: undefined;
                            abbreviateBy?: undefined;
                        };
                    } | {
                        name: string;
                        option: {
                            degree: number;
                            keep?: undefined;
                            unit?: undefined;
                            decimal?: undefined;
                            abbreviateBy?: undefined;
                        };
                    } | {
                        name: string;
                        option: {
                            unit: string;
                            decimal: number;
                            abbreviateBy: string;
                            keep?: undefined;
                            degree?: undefined;
                        };
                    } | {
                        name: string;
                        option?: undefined;
                    })[];
                };
            };
            dateTime: {
                constraints: {
                    name: string;
                }[];
                rules: {
                    elementDist: ({
                        name: string;
                        option?: undefined;
                    } | {
                        name: string;
                        option: {
                            keep: string[];
                            degree?: undefined;
                        };
                    } | {
                        name: string;
                        option: {
                            degree: number;
                            keep?: undefined;
                        };
                    })[];
                };
            };
        };
        y: {
            linear: {
                constraints: {
                    name: string;
                }[];
                rules: {
                    elementDistVertical: {
                        name: string;
                    }[];
                    elementWidth: {
                        name: string;
                    }[];
                };
            };
            category: {
                constraints: {
                    name: string;
                }[];
                rules: {
                    elementDistVertical: {
                        name: string;
                    }[];
                    elementWidth: ({
                        name: string;
                        option: {
                            abbreviateBy: string;
                        };
                    } | {
                        name: string;
                        option?: undefined;
                    })[];
                };
            };
        };
    };
};
