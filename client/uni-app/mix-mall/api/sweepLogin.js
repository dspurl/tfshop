import Network from '../utils/network.js'
export function success(data,success,fail) {
	Network.setPost('sweepLogin/success',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}

export function authorization(data,success,fail) {
	Network.setPost('sweepLogin/authorization',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
