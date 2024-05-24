<template>
	<div class="main_container" style="background-color: #f0f0f0;">
		<div style="padding:50px">
			<h1>login page</h1>
		</div>


		<div><el-input v-model="loginName" style="width: 240px" placeholder="账号" /></div>
		<div style="margin-top: 20px"><el-input v-model="loginPass" style="width: 240px" placeholder="密码" /></div>
		<div style="margin-top: 20px">
			<el-button style="width:200px" type="primary" @click="onSubmitLogin">登录</el-button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import server from '/src/js/server.js';

export default {
	data() {
		return {
			loginName: "",
			loginPass: ""
		}
	},
	created() {
		console.log('Login Page')
	},
	methods: {
		onSubmitLogin() {
			let _that = this
			//发送请求API
			server.send({
				"url": "api/user/list", "method": "POST",
				"data": {
					loginName: this.loginName,
					loginPass: this.loginPass
				},
				"success": function (res) {
					// res = { "code": 200, "msg": "登录成功", "data": { "token": "1234567890", "token": "1234567890", "expireDate": "2024-4-28 18:00:00" }
					if (res.code == 20000 && res.data != null) {
						server.setCache('LoginUser', JSON.stringify(res.data))
						location.href = '/'
					} else {
						server.alert(res.msg)
					}
				},
				"fail": function (res) {
					console.log(res)
				},
				"complete": function (res) {
					console.log(res)
				}
			})

			//模拟登录，更改API地址和结果处理逻辑
			// axios.request({
			// 	"url": "http://localhost:8000/api/user/login",
			// 	"method": "POST",
			// 	"data": {
			// 		loginName: this.loginName,
			// 		loginPass: this.loginPass
			// 	}
			// })
			// 	.then(response => {
			// 		var loginUser = {
			// 			LoginName: _that.loginName,
			// 			LoginPass: _that.loginPass,
			// 			LoginToken: "1234567890",
			// 			ExpireDate: "2024-4-28 18:00:00"
			// 		};

			// 		localStorage.setItem('LoginUser', JSON.stringify(loginUser))
			// 	});


			// location.href = '/'
		}
	}
}
</script>