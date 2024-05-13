import {
	createRouter,
	createWebHistory
} from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [{
			path: '/',
			name: '主页',
			component: () => import('../views/Home/Index.vue')
		},
		{
			path: '/login',
			name: '用户登录',
			component: () => import('../views/Account/Login.vue')
		}
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