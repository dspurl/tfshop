import Network from '../utils/network.js'
export function detail(id,success,fail) {
	Network.setGet('comment/detail/' + id,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function good(data,success,fail) {
	Network.setGet('comment/good',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function create(id,data,success,fail) {
	Network.setPost('comment/' + id,data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}

