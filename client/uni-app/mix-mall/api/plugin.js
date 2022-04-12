import Network from '../utils/network.js'
export function verifyPlugin(name,success,fail) {
	Network.setPost('verifyPlugin/'+name,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}