/**
 * 一天多少 ms
 */
export declare const DAY_MS = 86400000;
/**
 * 获取最大最小日期范围
 * @param dates
 */
export declare function getDateRange(dates: Date[]): string[];
/**
 * 日期对应年的范围
 * @param date
 */
export declare function getYearRange(date?: Date): string[];
/**
 * 是否当前月的最后一周
 */
export declare function isLastWeekOfMonth(date: Date): boolean;
/**
 * 是否是当月的最后一天
 */
export declare function isLastDayOfMonth(date: Date): boolean;
/**
 * 获取 date 对应的周索引（国际标准：一年的第一个周四为第一周）
 * @param date
 */
export declare function getWeek(date: Date): number;
/**
 * 获得一周的第几天（周日第 0 天）
 * @param date
 */
export declare function getDay(date: Date): number;
/**
 * 将 Date 前进 ms 时间
 * @param d
 * @param ms
 */
export declare function advanceBy(d: Date, ms: number): Date;
