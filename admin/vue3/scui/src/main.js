import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import scui from './scui'
import i18n from './locales'
import router from './router'
import store from './store'
import { createApp } from 'vue'
import App from './App.vue'
import VideoPlayer from 'vue-video-player/src'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus, {size: 'small'});
app.use(i18n);
app.use(scui);
app.use(VideoPlayer)
app.use(JsonViewer)

//挂载app
app.mount('#app');
