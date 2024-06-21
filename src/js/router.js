import {
	createRouter,
	createWebHistory
} from 'vue-router'


// 包含菜单的二级页面
const childRouters = [
	{ name: '主页1', path: '/', component: () => import('../views/Home/Index.vue') },
	{ name: '主页2', path: '/index', component: () => import('../views/Home/Index.vue') },
	{ name: '账号中心', path: '/SysUser/AccountCenter', component: () => import('../views/SysUser/AccountCenter.vue') },
	{ name: '修改密码', path: '/SysUser/EditPassword', component: () => import('../views/SysUser/EditPassword.vue') },
	{ name: '添加会员', path: '/User/Add', component: () => import('../views/User/Add.vue') },
	{ name: '会员列表', path: '/User/List', component: () => import('../views/User/List.vue') },
	{ name: '添加助手', path: '/Prompt/Add', component: () => import('../views/Prompt/Add.vue') },
	{ name: '助手列表', path: '/Prompt/List', component: () => import('../views/Prompt/List.vue') },
	{ name: '会话设置', path: '/Talk/Setup', component: () => import('../views/Talk/Setup.vue') },
	{ name: '会话列表', path: '/Talk/List', component: () => import('../views/Talk/List.vue') },
	{ name: '问诊对话', path: '/Talk/Index', component: () => import('../views/Talk/Index1.vue') },
	{ name: '医生列表', path: '/Doctor/List', component: () => import('../views/Doctor/List.vue') },
	{ name: '患者列表', path: '/Doctor/PatientList', component: () => import('../views/Doctor/PatientList.vue') }
]

//头部页面
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', component: () => import('../views/Home/Desk.vue'), children: childRouters },
		{ path: '/login', name: '用户登录', component: () => import('../views/SysUser/Login.vue') }
	],
	base: '/main'
})

//验证登录
router.beforeEach((to, from, next) => {
	if (to.path === '/login' || to.path === '/404') {
		next();
	} else {
		let _loginUserStr = localStorage.getItem('LoginUser');

		if (_loginUserStr == null || _loginUserStr == "") {
			next('/login');
		} else {
			var _loginUser = JSON.parse(_loginUserStr);

			if (_loginUser === null || _loginUser === '' || _loginUser.length < 10 ||
				_loginUser.LoginToken == null || new Date(_loginUser.ExpireDate) < new Date()) {

				localStorage.removeItem('LoginUser')
				next('/login');
			} else {
				next();
			}
		}
	}
});

export default router