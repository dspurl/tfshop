import Network from '../utils/network.js'
export default {
	getList(data,success,fail) {
		Network.setGetMessage('notice',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	getCount(data,success,fail) {
		Network.setGetMessage('noticeConut',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	deleteSubmit(id,success,fail){
		Network.setPostMessage('notice/' + id,{},'处理中', function (res) {
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
