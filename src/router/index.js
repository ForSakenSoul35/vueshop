import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向路由
    { path: '/', redirect: './login' },
    { path: '/login', component: Login }
  ]
})

export default router
