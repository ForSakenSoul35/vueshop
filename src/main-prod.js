import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 导入插件
import TreeTable from 'vue-table-with-tree-grid'
// 组件全局注册
import VueQuillEditor from 'vue-quill-editor'

// require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
// 注册进度组件

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 请求拦截器
// 在request拦截器中 展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须返回 config
  return config
})
// 在respone拦截器中 隐藏拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 挂载到vue的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
