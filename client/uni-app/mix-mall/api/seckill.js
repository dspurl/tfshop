import Network from '../utils/network.js'
export function getList(data,success,fail) {
	Network.setGet('seckill',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function detail(id, data,success,fail) {
	Network.setGet('seckill/' + id,data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
