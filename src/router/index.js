import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Login')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Welcome')

// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName: "users_right_roles" */'../components/user/Users')
// import Rights from '../components/power/Rights'
const Rights = () => import(/* webpackChunkName: "users_right_roles" */'../components/power/Rights')
// import Roles from '../components/power/Roles'
const Roles = () => import(/* webpackChunkName: "users_right_roles" */'../components/power/Roles')

// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "cate_params" */'../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName: 'cate_params" */'../components/goods/Params')

// import List from '../components/report/Report'
const List = () => import(/* webpackChunkName: "list_add" */'../components/report/Report')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName: "list_add" */'../components/goods/Add')

// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName: "order_report" */'../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName: "order_report" */'../components/report/Report')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向路由
    { path: '/', redirect: './login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 挂载路由导航守卫
// to 将要访问的路径
// from  从哪个路径
// next 函数 表示放行   next() 直接放行  next('./login') 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('./login')
  next()
})

export default router
