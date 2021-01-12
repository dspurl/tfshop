let configURL = {}
const NODE_ENV = 'test'; // prod:生产环境 | test:测试环境  
const INTERFACE = '/api/v1/app/'
let applyDsshopNodeEnv = '' //保存当前环境

if (process.env.NODE_ENV === "development") {
	//本地环境(小程序调试时请勾选不检验合法域名，且手机无法调试，需要调试，请修改此地址为外网地址)
	const domainName = 'http://dsshop.test'
	configURL = {
		// 腾讯地图的key，参考：https://lbs.qq.com/service/webService/webServiceGuide/webServiceGeocoder
		lbsQq: '',
		DomainName: domainName,
		BaseURL: domainName +INTERFACE,	//api_URL
		secret: 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='
	}
	applyDsshopNodeEnv = 'dev'
} else {
	if (NODE_ENV === 'test') {
		//测试环境
		const domainName = 'http://dsshop.test'
		configURL = {
			lbsQq: '',
			DomainName: domainName,
			BaseURL: domainName +INTERFACE,
			secret: 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='
		}
		applyDsshopNodeEnv = 'test'
	}else{
		//生产环境
		const domainName = 'http://dsshop.test'
		configURL = {
			lbsQq: '',
			DomainName: domainName,
			BaseURL: domainName +INTERFACE,
			secret: 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='
		}
		applyDsshopNodeEnv = 'prod'
	}
}
if(applyDsshopNodeEnv !== uni.getStorageSync('applyDsshopNodeEnv')){	//如果当前环境和上一次环境不同，则清空缓存
	uni.clearStorageSync()
	uni.setStorageSync('applyDsshopNodeEnv', applyDsshopNodeEnv)
}
export default configURL
