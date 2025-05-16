import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import "@/assets/style/iconfont.css";
import scui from './scui'
import i18n from './locales'
import router from './router'
import store from './store'
import App from './App.vue'
import VideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'



const app = createApp(App);
// 全局注册组件
app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.use(scui);
app.use(VideoPlayer)
app.use(JsonViewer)

//挂载app
app.mount('#app');
