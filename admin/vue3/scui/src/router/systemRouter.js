
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
		component: () => import(/* webpackChunkName: "login" */ '@/views/userCenter/login'),
		meta: {
			title: "登录"
		}
	}
]

export default routes;
