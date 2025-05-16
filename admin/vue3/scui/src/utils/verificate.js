/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
//验证手机号
export function verifyPhone(rule, value, callback) {
	let reg = /^[1][3, 4, 5, 6, 7, 8, 9][0-9]{9}$/
	if (!reg.test(value)) {
		return callback(new Error('请输入正确的手机号码'))
	}
	callback()
}

//车牌号码
export function verifyCars(rule, value, callback) {
	let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
	if (!reg.test(value)) {
		return callback(new Error('请输入正确的车牌号码'))
	}
	callback()
}

// 根据组件名生成新组件
export function getNewComponent(component, initializing) {
	// let cmp = deepClone(initializing[component])
	// style set不会被保留，故重新赋值
	// cmp.styles = initializing[component].styles
	// 不使用deepClone，某些参数会被删除
	let cmp = initializing[component]
	cmp.id = getRandomCode(6)
	return cmp
}

export function getRandomCode(num = 8, stamp = true) {
	let data = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	]
	let nums = ''
	let timestamp = parseInt(new Date().getTime() / 1000) + ''
	for (let i = 0; i < num; i++) {
		let r = parseInt(Math.random() * 61)
		nums += data[r]
	}
	return stamp ? timestamp + nums : nums
}
