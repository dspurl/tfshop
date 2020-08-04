/*
 * @Description: uniapp formatToJSON v1.0.0
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-09-23 15:13:28
 * @instruction: https://www.yuque.com/pocky/aaeyux/adkd6g
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/formatToJSON
 * @dcloud: https://ext.dcloud.net.cn/plugin?id=798
 */

export default function main (val) {
    let newVal = deepCopy(val);

    return format(newVal);
}

/**
 * 格式化
 * 
 * `xxxx` => `xxxx`
 * `{a: 'is a'}` => `{key: 'a', value: 'is a'}`
 * `{a: 'a1', b: 'b1'}` => `[{key: 'a', value: 'a1'}, {key: 'b', value: 'b1'}]`
 * `['a', 'b']` => `[{key: 0, value: 'a'}, {key: 1, value: 'b'}]`
 * 
 * @param {Any} anyVal 值
 * @param {Object|Array} list [[]] 容器
 * @return {Any}
 */
function format (anyVal, list = []) {
    if (typeof anyVal !== 'object') return anyVal;

    for (const key in anyVal) {
        const value = anyVal[key];

        if (isType('array', value) || (isType('object', value) && Object.keys(value).length > 1)) {
            list.push({ key, value: format(value) });
        } else if (isType('object', value)) {
            list.push({ key, value: format(value, {}) });
        } else if (isType('array', list)) {
            list.push({ key, value })
        } else {
            list.key = key;
            list.value = value;
        }
    }

    return list
}

/**
 * 普通 深拷贝
 * @param {Any} anyVal 任何值
 * @param {Object|Array} target [{}] 容器
 * @return {Any}
 */
function deepCopy (anyVal, target = {}) {
    if (typeof anyVal !== 'object' || anyVal === null) return anyVal;

    for (let i in anyVal) {
        const val = anyVal[i];

        if (isType('array', val)) {
            target[i] = deepCopy(val, [])
        } else if (typeof val === 'object') {
            target[i] = deepCopy(val);
        } else {
            target[i] = val;
        }
    }

    return target;
}

/**
 * 类型判断
 * @param {String} type 判断类型
 * @param {Any} anyVal 值
 * @return {Boolean}
 */
function isType (type, anyVal) {
    let newType = type.substring(0, 1).toUpperCase() + type.substring(1);

    return Object.prototype.toString.call(anyVal) === `[object ${newType}]`;
}