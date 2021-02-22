import Network from '../utils/network.js'
export default {
    getList(data,success,fail) {
		Network.setGetMessage('good',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
    },
	detail(id, data,success,fail) {
		Network.setGetMessage('good/' + id,data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	goodCategory(data,success,fail) {
		Network.setGetMessage('goodCategory',data,'加载中', function (res) {
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
