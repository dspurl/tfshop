import Vue from 'vue'
import store from './store'
import App from './App'
import configURL from './utils/config.js'
import filter from './utils/filter.js'
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

/* 注册过滤器 */
for (const key in filter) {
  if (filter.hasOwnProperty(key)) {
    const element = filter[key]
    Vue.filter(key, element)
  }
}

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.prototype.configURL = configURL
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()