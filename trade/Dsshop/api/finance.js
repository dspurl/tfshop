import Network from '../utils/network.js'
export default {
    getList(data,success,fail) {
		Network.setGetMessage('finance',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
    },
	getDetails(id, data,success,fail) {
		Network.setGetMessage('finance/' + id,data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	}
};
