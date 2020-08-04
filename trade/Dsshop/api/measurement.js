import Network from '../utils/network.js'
export default {
	getCommodityList(data,success,fail) {
		Network.setGetMessage('GoodIndentCommodity',data,'加载中', function (res) {
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
		Network.setPost('GoodIndentMeasurement/' + data.id,data, function (res) {
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
		Network.setPostMessage('GoodIndentMeasurementDelete/' + id,{},'处理中', function (res) {
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
		Network.setGetMessage('GoodIndentMeasurement/' + id,data,'加载中', function (res) {
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
		Network.setPost('GoodIndentMeasurement',data, function (res) {
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
