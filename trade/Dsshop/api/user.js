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
	toVerifyEmail(data, success, fail) {
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
	authorizedPhone(data, success, fail) {
		Network.setPost('authorizedPhone', data, function(res) {
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
	getRegisterEmailCode(data, success, fail) {
		Network.setPostMessage('getRegisterEmailCode', data, '处理中', function(res) {
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
	setNotification(data,success, fail) {
		Network.setPost('userNotification', data, function(res) {
			success(res)
		}, function(res) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	unsubscribe(data,success, fail){
		Network.setPost('unsubscribe', data, function(res) {
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
