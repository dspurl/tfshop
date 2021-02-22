import Network from '../utils/network.js'
export default {
	getList(data,success,fail) {
		Network.setGetMessage('notification',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	unread(data,success,fail) {
		Network.setGetMessage('notification/unread',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	destroy(id,success,fail){
		Network.setPostMessage('notification/destroy/' + id,{},'处理中', function (res) {
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
