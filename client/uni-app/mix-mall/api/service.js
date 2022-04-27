import Network from '../utils/network.js'
export function config(data,success,fail) {
	Network.setGet('serviceConfig',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
