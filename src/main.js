import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 挂载到vue的原型上
Vue.prototype.$http = axios
// 配置请求的根路径
// axios.defaults.baseURL = ""
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
