/*
 * @Descripttion: 工具集
 * @version: 1.2
 * @LastEditors: sakuya
 * @LastEditTime: 2022年5月24日00:28:56
 */

import CryptoJS from "crypto-js";

const tool = {};

/* localStorage */
tool.data = {
	set(key, data, datetime = 0) {
		//加密
		if (process.env.LS_ENCRYPTION === "AES") {
			data = tool.crypto.AES.encrypt(JSON.stringify(data), process.env.LS_ENCRYPTION_KEY)
		}
		let cacheValue = {
			content: data,
			datetime: parseInt(datetime) === 0 ? 0 : new Date().getTime() + parseInt(datetime) * 1000
		}
		return localStorage.setItem(key, JSON.stringify(cacheValue))
	},
	get(key) {
		try {
			const value = JSON.parse(localStorage.getItem(key))
			if (value) {
				let nowTime = new Date().getTime()
				if (nowTime > value.datetime && value.datetime != 0) {
					localStorage.removeItem(key)
					return null;
				}
				//解密
				if (process.env.LS_ENCRYPTION === "AES") {
					value.content = JSON.parse(tool.crypto.AES.decrypt(value.content, process.env.LS_ENCRYPTION_KEY))
				}
				return value.content
			}
			return null
		} catch (err) {
			return null
		}
	},
	remove(key) {
		return localStorage.removeItem(key)
	},
	clear() {
		return localStorage.clear()
	}
}

/*sessionStorage*/
tool.session = {
	set(table, settings) {
		var _set = JSON.stringify(settings)
		return sessionStorage.setItem(table, _set);
	},
	get(table) {
		var data = sessionStorage.getItem(table);
		try {
			data = JSON.parse(data)
		} catch (err) {
			return null
		}
		return data;
	},
	remove(table) {
		return sessionStorage.removeItem(table);
	},
	clear() {
		return sessionStorage.clear();
	}
}

/*cookie*/
tool.cookie = {
	set(name, value, config = {}) {
		var cfg = {
			expires: null,
			path: null,
			domain: null,
			secure: false,
			httpOnly: false,
			...config
		}
		var cookieStr = `${name}=${escape(value)}`
		if (cfg.expires) {
			var exp = new Date()
			exp.setTime(exp.getTime() + parseInt(cfg.expires) * 1000)
			cookieStr += `;expires=${exp.toGMTString()}`
		}
		if (cfg.path) {
			cookieStr += `;path=${cfg.path}`
		}
		if (cfg.domain) {
			cookieStr += `;domain=${cfg.domain}`
		}
		document.cookie = cookieStr
	},
	get(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
		if (arr != null) {
			return unescape(arr[2])
		} else {
			return null
		}
	},
	remove(name) {
		var exp = new Date()
		exp.setTime(exp.getTime() - 1)
		document.cookie = `${name}=;expires=${exp.toGMTString()}`
	}
}

/* Fullscreen */
tool.screen = function (element) {
	var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
	if (isFull) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	} else {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		}
	}
}

/* 复制对象 */
tool.objCopy = function (obj) {
	return JSON.parse(JSON.stringify(obj));
}

/* 日期格式化 */
tool.dateFormat = function (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
	date = new Date(date)
	var o = {
		"M+": date.getMonth() + 1,                 //月份
		"d+": date.getDate(),                    //日
		"h+": date.getHours(),                   //小时
		"m+": date.getMinutes(),                 //分
		"s+": date.getSeconds(),                 //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

/* 千分符 */
tool.groupSeparator = function (num) {
	num = num + '';
	if (!num.includes('.')) {
		num += '.'
	}
	return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
		return $1 + ',';
	}).replace(/\.$/, '');
}

/* 显示小图片 */
tool.smallImage = function (img, size) {
	const index = img.lastIndexOf(".");
	if (!size) {
		size = 300;
	}
	return (
		img.substring(0, index) +
		"_" +
		size +
		"." +
		img.substring(index + 1, img.length)
	);
};

/* 小写数字转大写 */
tool.digitUppercase = function (n) {
	const fraction = ['角', '分'];
	const digit = [
		'零', '壹', '贰', '叁', '肆',
		'伍', '陆', '柒', '捌', '玖'
	];
	const unit = [
		['元', '万', '亿'],
		['', '拾', '佰', '仟']
	];
	const head = n < 0 ? '负' : '';
	n = Math.abs(n);
	let s = '';
	for (let i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
	}
	s = s || '整';
	n = Math.floor(n);
	for (let i = 0; i < unit[0].length && n > 0; i++) {
		let p = '';
		for (let j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p;
			n = Math.floor(n / 10);
		}
		s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
	}
	return head + s.replace(/(零.)*零元/, '元')
		.replace(/(零.)+/g, '零')
		.replace(/^整$/, '零元整');
}

/* 常用加解密 */
tool.crypto = {
	//MD5加密
	MD5(data) {
		return CryptoJS.MD5(data).toString()
	},
	//BASE64加解密
	BASE64: {
		encrypt(data) {
			return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
		},
		decrypt(cipher) {
			return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
		}
	},
	//AES加解密
	AES: {
		encrypt(data, secretKey, config = {}) {
			if (secretKey.length % 8 != 0) {
				console.warn("[SCUI error]: 秘钥长度需为8的倍数，否则解密将会失败。")
			}
			const result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
				iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
				mode: CryptoJS.mode[config.mode || "ECB"],
				padding: CryptoJS.pad[config.padding || "Pkcs7"]
			})
			return result.toString()
		},
		decrypt(cipher, secretKey, config = {}) {
			const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(secretKey), {
				iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
				mode: CryptoJS.mode[config.mode || "ECB"],
				padding: CryptoJS.pad[config.padding || "Pkcs7"]
			})
			return CryptoJS.enc.Utf8.stringify(result);
		}
	}
}

export default tool
