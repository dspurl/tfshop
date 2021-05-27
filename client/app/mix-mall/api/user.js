import Network from '../utils/network.js'
export default {
	detail(success, fail) {
		Network.setGetMessage('user',{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	edit(data,success, fail) {
		Network.setPost('user', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	notification(data,success, fail) {
		Network.setPost('user/notification', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	cancel(data,success, fail){
		Network.setPost('cancel', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	}
};
