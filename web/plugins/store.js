import Vue from 'vue'
const store= {
    install(Vue){
        Vue.prototype.store = require('store')
    }
};
Vue.use(store);
