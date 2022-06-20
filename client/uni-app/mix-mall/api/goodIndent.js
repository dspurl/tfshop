import Network from '../utils/network.js'
export default {
    getList(data,success,fail) {
		Network.setGetMessage('goodIndent',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
    },
	detail(id,success,fail) {
		Network.setGetMessage('goodIndent/detail/' + id,{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	create(data,success,fail) {
		Network.setPostMessage('goodIndent',data,'处理中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	synchronizationInventory(data, success,fail) {
		Network.setPostMessage('goodIndent/synchronizationInventory',data,'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	addShoppingCart(data, success,fail) {
		Network.setPostMessage('goodIndent/addShoppingCart',data,'', function (res) {
			success(res)
		}, function (res) {
		})
	},
	clearShoppingCart(data, success,fail) {
		Network.setPostMessage('goodIndent/clearShoppingCart',data,'', function (res) {
		  success(res)
		}, function (res) {
		  
		})
	},
	pay(id, success,fail) {
		Network.setGetMessage('goodIndent/pay/' + id,{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	receipt(id, success,fail) {
		Network.setPostMessage('goodIndent/receipt/' + id,{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	cancel(id, success,fail) {
		Network.setPostMessage('goodIndent/cancel/' + id,{},'加载中', function (res) {
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
		Network.setPostMessage('goodIndent/destroy/' + id,{},'处理中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	quantity(success,fail) {
		Network.setGetMessage('goodIndent/quantity',{},'加载中', function (res) {
		  success(res)
		}, function (res) {
		  uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		  })
		})
	},
	download(id,success,fail){
		Network.setPost('goodIndent/download/' + id,{}, function (res) {
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
