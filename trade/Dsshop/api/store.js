import Network from '../utils/network.js'
export default {
    edit(data,success,fail) {
    	Network.setPostMessage('store',data,'处理中', function (res) {
    	  success(res)
    	}, function (res) {
    	  uni.showToast({
    		title: res.message,
    		icon: 'none',
    		duration: 2000
    	  })
    	})
    },
	getDetails(data,success,fail) {
		Network.setGetMessage('store',{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
};
