<template>
	<div style="padding: 15px 20px;">
		<div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
			<span class="page_title">主页</span>
		</div>
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