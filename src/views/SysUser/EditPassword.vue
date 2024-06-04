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

			<div class="page_title">修改密码</div>

			<div style="margin:30px auto 0px auto; width:400px">
				<div class="zhiwei_flex">
					<div style="width:100px; color:#777777; line-height: 30px">原密码</div>
					<div style="width:100px; flex:1">
						<el-input></el-input>
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px; line-height: 30px;">
					<div style="width:100px; color:#777777">新密码</div>
					<div style="width:100px; flex:1">
						<el-input></el-input>
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px; line-height: 30px">
					<div style="width:100px; color:#777777">重复密码</div>
					<div style="width:100px; flex:1">
						<el-input></el-input>
					</div>
				</div>
				<div class="zhiwei_flex_center" style="margin-top:20px; line-height: 30px">
					<el-button type="danger">确认修改</el-button>
				</div>
			</div>
		</div>
	</div>
</template>


<style></style>