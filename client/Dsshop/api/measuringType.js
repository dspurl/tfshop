import Network from '../utils/network.js'
export default {
	getList(data,success,fail) {
		Network.setGetMessage('MeasuringType',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	updateSubmit(data,success,fail) {
		Network.setPost('MeasuringType/' + data.id,data, function (res) {
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
		Network.setPostMessage('MeasuringTypeDelete/' + id,{},'处理中', function (res) {
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
		Network.setGetMessage('MeasuringType/' + id,data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	createSubmit(data,success,fail) {
		Network.setPost('MeasuringType',data, function (res) {
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
