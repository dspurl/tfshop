/**
 * 注册全局主题
 * @param name
 * @param theme
 */
export declare function registerGlobalTheme(name: string, theme: any): void;
/**
 * 获取默认主题
 * @param name 如果 name 为空，则返回默认的主题，否则返回指定 name 的主题
 */
export declare function getGlobalTheme(name?: string): any;
