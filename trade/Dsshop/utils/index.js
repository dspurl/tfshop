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
              title: '订阅失败：被后台封禁',
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
          title: '错误码：' + res.errCode + ' 请联系管理员',
          icon: 'none',
          duration: 2000
        })
      }
    })
	//#endif
  }
