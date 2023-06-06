/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import configURL from './config.js'
/**
 * @returns {string}
 */
export function createUniqueString() {
	// const timestamp = +new Date() + ''
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	// return (+(randomNum + timestamp)).toString(32)
	return (randomNum + new Date().getMilliseconds())
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
export function diffArary(arr1, arr2) {
	arr1 = uniqueArr(arr1)
	arr2 = uniqueArr(arr2)
	return arr1.concat(arr2).filter(arg => !(arr1.includes(arg) && arr2.includes(arg)))
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

//BlobUrl转blob数据  
export function objectURLToBlob(url, callback) {
	var http = new XMLHttpRequest()
	http.open("GET", url, true)
	http.responseType = "blob"
	http.onload = function(e) {
		if (this.status == 200 || this.status === 0) {
			callback(this.response)
		}
	}
	http.send()
}

export function addDate() {
	let nowDate = new Date();
	let date = {
		year: nowDate.getFullYear(),
		month: nowDate.getMonth() + 1,
		date: nowDate.getDate(),
	}
	return date.year + '-'+ date.month + '-' + date.date
}

//订阅消息
export function authMsg(tmplIds) {
	//#ifdef MP-WEIXIN
    var that = this
    uni.requestSubscribeMessage({
      tmplIds: tmplIds,
      success(res) {
        switch (res[res]) {
          case 'reject':
            break;
          case 'ban':
            uni.showToast({
              title: this.$t('utils.subscription.error'),
              icon: 'none',
              duration: 2000
            })
            break;
          case 'accept':
            break;
        }
      },
      fail(res) {
        uni.showToast({
          title: this.$t('utils.subscription.error_code', { code: res.errCode }),
          icon: 'none',
          duration: 2000
        })
      }
    })
	//#endif
  }

// 登录
export function getLogin() {
	let that = this;
	uni.login({
		success(res) {
			if (res.code) {
				uni.request({
					url: configURL.BaseURL + 'miniLogin',
					data: {
						code: res.code,
						platform: getPlatform()
					},
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'apply-secret': configURL.secret,
						// #ifndef H5
						openid: uni.getStorageSync('applyDsshopOpenid')
						// #endif
					},
					success: res => {
						if (res.statusCode === 200) {
							if (res.data.result === 'ok') {
								uni.setStorageSync('applyDsshopSession_key', res.data.message.session_key);
								uni.setStorageSync('applyDsshopOpenid', res.data.message.openid);
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.message,
								duration: 2000
							});
						}
					},
					fail: res => {
						uni.showToast({
							title: this.$t('request.no_response'),
							duration: 2000
						});
					}
				});
			} else {
				console.log(this.$t('request.no_response'));
			}
		}
	});
}

//使用注释获取详细平台
export function getPlatform(){
	// #ifdef APP-PLUS
	return "APP"
	// #endif
	// #ifdef APP-PLUS-NVUE
	return "App nvue"
	// #endif
	// #ifdef H5
	return "H5"
	// #endif
	// #ifdef MP-WEIXIN
	return "miniWeixin"
	// #endif
	// #ifdef MP-ALIPAY
	return "miniAlipay"
	// #endif
	// #ifdef MP-BAIDU
	return "miniBaidu"
	// #endif
	// #ifdef MP-TOUTIAO
	return "miniToutiao"
	// #endif
	// #ifdef MP-QQ
	return "miniQq"
	// #endif
	// #ifdef MP-360
	return "mini360"
	// #endif
}
/**
 * 检测当前环境是否是微信浏览器访问
 */
export function micromessenger() {
	let ua = window.navigator.userAgent.toLowerCase()
	if(ua.match(/MicroMessenger/i)){
		if (ua.match(/MicroMessenger/i)[0] == 'micromessenger') {
			return true
		} else {
			return false
		}
	}else{
		return false
	}
	
}

// 获取字符串中url的参数
export function urlToObj(url) {
  let obj = {}
  let str = url.slice(url.indexOf('?') + 1)
  let arr = str.split('&')
  for (let j = arr.length, i = 0; i < j; i++) {
    let arr_temp = arr[i].split('=')
    obj[arr_temp[0]] = arr_temp[1]
  }
  return obj
}