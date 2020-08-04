import Network from '../utils/network.js'
export default {
	goLogin(data, success, fail) {
		Network.setPostMessage('login', data, '登录中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	goRegister(data, success, fail) {
		Network.setPostMessage('register', data, '处理中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	findPassword(data, success, fail) {
		Network.setPostMessage('findPassword', data, '处理中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	goWxLogin(data, success, fail) {
		Network.setPost('wxlogin', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	getRegisterCellphoneCode(data, success, fail) {
		Network.setPost('getRegisterCellphoneCode', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	logout(data, success, fail) {
		Network.setPostMessage('logout', {}, '退出中', function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	user(success, fail) {
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
	setUser(data,success, fail) {
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
};
