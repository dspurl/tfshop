import Network from '../utils/network.js'
export default {
	login(data, success, fail) {
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
	register(data, success, fail) {
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
	verifyEmail(data, success, fail) {
		Network.setPostMessage('verifyEmail', data, '处理中', function(res) {
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
	authorization(data, success, fail) {
		Network.setPost('authorization', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	cellphoneCode(data, success, fail) {
		Network.setPost('cellphoneCode', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	emailCode(data, success, fail) {
		Network.setPostMessage('emailCode', data, '处理中', function(res) {
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
	}
};
