import Network from '../utils/network.js'
export function getList(data,success,fail) {
	Network.setGet('groupPurchase',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function detail(id, data,success,fail) {
	Network.setGet('groupPurchase/' + id,data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function foreman(id,success,fail) {
	Network.setGet('groupPurchaseForeman/' + id,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}
export function indent(id,success,fail) {
	Network.setGet('groupPurchaseIndent/' + id,{}, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}

export function code(data,success,fail) {
	Network.setPost('groupPurchaseCode',data, function (res) {
	  success(res)
	}, function (res) {
	  uni.showToast({
		title: res.message,
		icon: 'none',
		duration: 2000
	  })
	})
}