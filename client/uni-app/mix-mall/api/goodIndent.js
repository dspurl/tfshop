/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import Network from '../utils/network.js'
import i18n from '@/utils/lang/index'
export default {
    getList(data,success,fail) {
		Network.setGetMessage('goodIndent',data,i18n.t('common.loading'), function (res) {
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
		Network.setGetMessage('goodIndent/detail/' + id,{},i18n.t('common.loading'), function (res) {
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
		Network.setPostMessage('goodIndent',data,i18n.t('common.processing'), function (res) {
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
		Network.setPostMessage('goodIndent/synchronizationInventory',data,i18n.t('common.loading'), function (res) {
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
		Network.setGetMessage('goodIndent/pay/' + id,{},i18n.t('common.loading'), function (res) {
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
		Network.setPostMessage('goodIndent/receipt/' + id,{},i18n.t('common.loading'), function (res) {
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
		Network.setPostMessage('goodIndent/cancel/' + id,{},i18n.t('common.loading'), function (res) {
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
		Network.setPostMessage('goodIndent/destroy/' + id,{},i18n.t('common.processing'), function (res) {
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
		Network.setGetMessage('goodIndent/quantity',{},i18n.t('common.loading'), function (res) {
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
