const DEFAULT_CONFIG = {
	API_URLS: process.env.VUE_APP_DEBUG ? process.env.VUE_APP_API_URL : '/api',
}

// 如果生产模式，就合并动态的APP_CONFIG
// public/config.js
if(process.env.NODE_ENV === 'production'){
	Object.assign(DEFAULT_CONFIG, APP_CONFIG)
}

module.exports = DEFAULT_CONFIG
