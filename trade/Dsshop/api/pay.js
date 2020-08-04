import Network from '../utils/network.js'
export default {
	wxPay(data, success, fail) {
		Network.setPostMessage('wxPay', data, '支付中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	balancePay(data, success, fail) {
		Network.setPostMessage('balancePay', data, '支付中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
};
