import { DataItem } from '../..';
/**
 * 根据 range 补齐日历图的数据
 * @param data 传入数据
 * @param dateRange 日期区间
 * @param dateField 日期字段
 */
export declare function generateCalendarData(data: DataItem[], dateRange: string[], dateField: string): DataItem[];
/**
 * 计算每个月的中间周。
 */
export declare function getMonthCenterWeek(dateRange: string[]): Record<number, number>;
