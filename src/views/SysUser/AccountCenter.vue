<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import * as icon from '@element-plus/icons-vue'

export default {
	setup() {
		const router = useRouter();

		return {
			//跳转页面
			onOpenPage(_pageUrl) {
				router.push(_pageUrl);
			}
		}
	},
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

<template>
	<div v-if="loginUser" style="padding: 15px 20px;">
		<div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">

			<div class="page_title">账号中心</div>
			
			<div style="margin-top:30px">
				<div class="zhiwei_flex">
					<div style="width:100px; color:#777777">登录账号</div>
					<div style="width:100px; flex:1">{{ loginUser.LoginName }}</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px">
					<div style="width:100px; color:#777777">用户昵称</div>
					<div style="width:100px; flex:1">{{ loginUser.NickName }}</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px">
					<div style="width:100px; color:#777777">用户头像</div>
					<div style="width:100px; flex:1">
						{{ loginUser.HeadImg }}
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px">
					<div style="width:100px; color:#777777">手机号</div>
					<div style="width:100px; flex:1">
						{{ loginUser.Mobile }}
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px">
					<div style="width:100px; color:#777777">注册日期</div>
					<div style="width:100px; flex:1">
						{{ loginUser.AddDate }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<style></style>