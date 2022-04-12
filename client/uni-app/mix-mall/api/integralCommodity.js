import Network from '../utils/network.js'
export function getDetail(data,success,fail) {
	Network.setPost('integralCommodity',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}