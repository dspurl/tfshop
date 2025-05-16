
//系统路由
const routes = [
	{
		name: "layout",
		path: "/",
		component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
		redirect: process.env.VUE_APP_DASHBOARD_URL || '/dashboard',
		children: []
	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/user_register",
		component: () => import(/* webpackChunkName: "userRegister" */ '@/views/Login/userRegister'),
		meta: {
			title: "注册"
		}
	},
	{
		path: "/reset_password",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/Login/resetPassword'),
		meta: {
			title: "重置密码"
		}
	}
]

export default routes;
