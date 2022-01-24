/**
 * 按照scale字段values中的start和end信息从全部数据中取出对应的部分
 *
 * @param field scale field
 * @param values scale values
 * @param data original data
 * @param range range start & end
 */
export declare const getDataByScaleRange: (field: string, values: string[], data: object[], [start, end]: [number, number], vertical?: boolean) => object[];
