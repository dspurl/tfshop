import Network from '../utils/network.js'
export function getList(data,success,fail) {
	Network.setGet('integralDraw',data, function (res) {
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
	Network.setGet('integralDraw/' + id,data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function winning(id,success,fail) {
	Network.setGet('integralWinning/' + id,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}