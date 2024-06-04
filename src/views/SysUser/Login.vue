<script setup>
import server from '../../js/server.js';
import {
	ref,
	onMounted
} from "vue"

//data
const loginName = ref("");
const password = ref("");
const isSavePass = ref(false);

//页面初始化
onMounted(() => {
	if (server.getCache("loginName") != null) {
		loginName.value = server.getCache("loginName")
	}
	isSavePass.value = server.getCache("isSavePass");
	if (isSavePass.value === true && server.getCache("password") != null) {
		password.value = server.getCache("password");
	}
})

//提交登录
const onGoLogin = function () {
	if (loginName.value == null || loginName.value === "") {
		document.getElementById("txtLoginName").focus()
		server.toast("请输入登录账号")
	} else if (password.value == null || password.value === "") {
		document.getElementById("txtLoginPass").focus()
		server.toast("请输入登录密码")
	} else {
		//调用账号验证接口
		server.send({
			"url": "/sys/account/login",
			loading: true,
			data: {
				loginName: loginName.value,
				password: password.value
			},
			success(res) {
				if (res.code == 200 && res.data != null) {
					//保存token
					server.setCache("LoginUser", res.data)
					//记住密码
					if (isSavePass.value === true) {
						server.setCache("loginName", loginName.value)
						server.setCache("password", password.value)
						server.setCache("isSavePass", isSavePass.value)
					} else {
						server.setCache("loginName", loginName.value)
						server.removeCache("password")
						server.removeCache("isSavePass")
					}
					//跳转主页
					window.parent.location.href = "/index";
				} else {
					server.toast(res.msg, 2)
				}
			}
		})
	}
}

//监听键盘输入
const onPressLoginName = function (event) {
	if (event.keyCode == 13) {
		document.getElementById("txtLoginPass").focus()
	}
}
const onPressLoginPass = function (event) {
	if (event.keyCode == 13) {
		onGoLogin();
	}
}
</script>

<style>
.login_title {
	text-align: center;
	color: #222;
	font-family: PingFang SC;
	font-weight: 500;
	font-size: 32px;
	letter-spacing: 5px;
	line-height: 50px;
}

.login_main {
	padding: 50px 20px;
	margin-top: 20px;
	width: 600px;
	background: rgba(245, 245, 245, 1);
	border-radius: 2px;
	box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.25);
}

input::-webkit-input-safebox-button {
	display: none;
}
</style>

<template>
	<div style="width:100%; height:100%; background: linear-gradient(to bottom, #008AD3, #008AD3);
		 background-repeat: no-repeat;; background-size: 100% 100%;">
		<div style="z-index:101; position:absolute; left:50%; top: 40%; transform: translate(-50%, -50%);">
			<div class="login_main">
				<div class="login_title">MedGPT综合管理平台</div>
				<div style="width: 260px; margin:auto;">
					<div class="zhiwei_flex"
						style="margin-top: 30px; padding:10px 12px; width: 260px; height: 45px; border-radius: 12px; border: 1px solid rgba(228, 223, 223, 1); box-sizing: border-box; background: rgba(255, 255, 255, 1);">
						<img src="/images/icons/login_account.png" style="width: 20px; height: 20px" />
						<input id="txtLoginName" v-model="loginName" maxlength="30"
							style="padding: 0px 10px; flex: 1; height:23px; line-height:23px; font-family: PingFang SC; font-size: 14px; border: none; outline: none; "
							placeholder="请输入账号" type="text" autocomplete="off" @keydown="onPressLoginName" />
					</div>
					<div class="zhiwei_flex"
						style="margin-top: 20px; padding:10px 12px; width: 260px; height: 45px; border-radius: 12px; border: 1px solid rgba(228, 223, 223, 1); box-sizing: border-box; background: rgba(255, 255, 255, 1);">
						<img src="/images/icons/login_password.png" style="width: 20px; height: 20px" />
						<input id="txtLoginPass" v-model="password" maxlength="30"
							style="padding: 0px 10px; flex: 1; height:23px; line-height:23px; font-family: PingFang SC; font-size: 14px; border: none; outline: none; "
							placeholder="请输入密码" type="password" autocomplete="off" @keydown="onPressLoginPass" />
					</div>
					<div style="margin-top: 15px; text-align: left">
						<el-checkbox v-model="isSavePass">记住密码</el-checkbox>
					</div>
					<div style="margin-top: 20px; text-align:center; ">
						<el-button type="primary" style="width:100%; height:40px"
							v-on:click="onGoLogin()">立即登录</el-button>
					</div>
				</div>
			</div>
		</div>
		<div style="z-index:101; position:absolute; left:0px; right:0px; bottom: 60px; text-align: center;">
			<div style="color:#fff">中科(安徽)G60智慧健康创新研究院</div>
		</div>
	</div>
</template>