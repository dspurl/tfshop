import Vue from 'vue'
var global= {
    install(Vue){
        Vue.prototype.global = {
            getcookiesInServer:function(req){
                let service_cookie = {};
                req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
                    let parts = val.split('=');
                    service_cookie[parts[0].trim()] = (parts[1] || '').trim();
                });
                return service_cookie;
            }
        };
    }
}
Vue.use(global);
