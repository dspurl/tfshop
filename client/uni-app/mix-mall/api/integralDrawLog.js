import Network from '../utils/network.js'
export function getList(data,success,fail) {
	Network.setGet('integralDrawLog',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function good(id,success,fail) {
	Network.setGet('integralDrawLogGood/' + id,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
