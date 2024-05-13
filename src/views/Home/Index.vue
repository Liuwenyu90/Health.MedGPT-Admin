<template>
	<div class="main_container">
		<div style="margin-top:20px">账号：{{loginUser.LoginName}}</div>
		<div style="margin-top:20px">密码：{{loginUser.LoginPass}}</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loginUser: null
			}
		},
		created() {
			this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))
		},
		methods: {

		}
	}
</script>