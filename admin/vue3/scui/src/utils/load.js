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
/**
 * loadJS 异步加载远程JS
 * @constructor
 * @param {string} src - 必填，需要加载的URL路径
 * @param {string} keyName - 必填，唯一key和JS返回的全局的对象名
 * @param {string} callbackName - 非必填，如果远程JS有callback，则可更有效的判断是否完成加载
 */
export function loadJS (src, keyName, callbackName) {
	return new Promise((resolve, reject) => {
		let has = document.head.querySelector("script[loadKey="+keyName+"]")
		if(has){
			return resolve(window[keyName])
		}
		let script = document.createElement("script")
		script.type = "text/javascript"
		script.src = src
		script.setAttribute("loadKey", keyName)
		document.head.appendChild(script)
		script.onload = () => {
			if(callbackName){
				window[callbackName] = () => {
					return resolve(window[keyName])
				}
			}else{
				setTimeout(()=>{
					return resolve(window[keyName])
				},50)
			}
		}
		script.onerror = (err) => {
			return reject(err)
		}
	})
}

/**
 * loadCSS 异步加载远程css
 * @constructor
 * @param {string} src - 必填，需要加载的URL路径
 * @param {string} keyName - 必填，唯一key
 */
export function loadCSS (src, keyName) {
	return new Promise((resolve, reject) => {
		let has = document.head.querySelector("link[loadKey="+keyName+"]")
		if(has){
			return resolve()
		}
		let link = document.createElement('link')
		link.rel = "stylesheet"
		link.href = src
		link.setAttribute("loadKey", keyName)
		document.head.appendChild(link)
		link.onload = () => {
			return resolve()
		}
		link.onerror = (err) => {
			return reject(err)
		}
	})
}
