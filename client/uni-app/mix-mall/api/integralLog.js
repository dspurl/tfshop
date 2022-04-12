import Network from '../utils/network.js'
export function getList(data,success,fail) {
	Network.setGet('integralLog',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}