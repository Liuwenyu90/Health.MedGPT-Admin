<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import * as icon from '@element-plus/icons-vue'
import server from '@/js/server';
import util from '../../js/util.js';

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
			loginUser: null,
			oldPassword: null,
			newpassword: null,
			comfirmPassword: null,

			eyeIndex: -1
		}
	},
	created() {
		this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))
	},
	methods: {
	
		onSubmitEdit() {
			let _that = this
			server.send({
				"url": "/sys/account/EditPassword",
				loading: true,
				data: {
					password: String(_that.oldPassword),
					newPassword: String(_that.newpassword),
					checkNewPassword: String(_that.comfirmPassword)
				},
				success(res) {
					if (res.code == 200 && res.data === true) {
						server.toast("修改成功", 1)

						//更新用户资料
						//***************************************
						// console.log('789');
						util.ReLoadLoginUser();
						//跳转主页
						// console.log('123');
						_that.eyeIndex = -1;
						// console.log('456');
						window.parent.location.href = "/index";
					} else {
						server.toast(res.msg, 2)
					}
				}
			})
		}
	}
}

</script>

<template>
	<div v-if="loginUser" style="padding: 15px 20px;">
		<div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">

			<div class="page_title">修改密码</div>

			<div style="margin:30px auto 0px auto; width:400px">
				<div class="zhiwei_flex">
					<div style="width:100px; color:#777777; line-height: 40px">原密码</div>
					<div style="flex:1; ">
						<div class="zhiwei_flex" style="border: solid 1px #ccc; border-radius: 5px;">
							<div style="flex:1; padding:0px 10px; height: 40px">
								<input v-if="eyeIndex == 0" v-model="oldPassword" type="input" class="input_txt"
									maxlength="32"></input>
								<input v-else v-model="oldPassword" type="password" class="input_pass"
									maxlength="32" placeholder="请输入原密码"></input>
							</div>
							<div v-if="oldPassword != null" style="padding: 10px 10px 10px 0px; cursor: pointer;" @mousedown="eyeIndex = 0"
								@mouseup="eyeIndex = -1">
								<img v-if="eyeIndex == 0" class="icon_see" src="/images/icons/eye_open.png" />
								<img v-else class="icon_see" src="/images/icons/eye_close.png" />
							</div>
						</div>
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px; line-height: 40px;">
					<div style="width:100px; color:#777777">新密码</div>
					<div style="flex:1">
						<div class="zhiwei_flex" style="border: solid 1px #ccc; border-radius: 5px;">
							<div style="flex:1; padding:0px 10px; height: 40px">
								<div v-if="eyeIndex == 1" style="line-height: 40px;">{{ newpassword }}</div>
								<input v-else v-model="newpassword" type="password" class="input_pass"
									maxlength="32" placeholder="请输入新密码"></input>
							</div>
							<div v-if="newpassword != null" style="padding: 10px 10px 10px 0px; cursor: pointer;" @mousedown="eyeIndex = 1"
								@mouseup="eyeIndex = -1">
								<img v-if="eyeIndex == 1" class="icon_see" src="/images/icons/eye_open.png" />
								<img v-else class="icon_see" src="/images/icons/eye_close.png" />
							</div>
						</div>
					</div>
				</div>
				<div class="zhiwei_flex" style="margin-top:20px; line-height: 40px">
					<div style="width:100px; color:#777777">重复密码</div>
					<div style="flex:1">
						<div class="zhiwei_flex" style="border: solid 1px #ccc; border-radius: 5px;">
							<div style="flex:1; padding:0px 10px; height: 40px">
								<div v-if="eyeIndex == 2" style="line-height: 40px;">{{ comfirmPassword }}</div>
								<input v-else v-model="comfirmPassword" type="password" class="input_pass"
									maxlength="32" placeholder="请再次输入密码"></input>
							</div>
							<div v-if="comfirmPassword != null" style="padding: 10px 10px 10px 0px; cursor: pointer;" @mousedown="eyeIndex = 2"
								@mouseup="eyeIndex = -1">
								<img v-if="eyeIndex == 2" class="icon_see" src="/images/icons/eye_open.png" />
								<img v-else class="icon_see" src="/images/icons/eye_close.png" />
							</div>
						</div>
					</div>
				</div>
				<div class="zhiwei_flex_center" style="margin-top:20px; line-height: 30px">
					<el-button type="danger" style="margin-top:30px; width:160px; height:40px;"
						@click="onSubmitEdit">确认修改</el-button>
				</div>
			</div>
		</div>
	</div>
</template>


<style>
.input_txt {

	line-height: 38px;
	height: 38px;
	border-width: 0px;
	width: 100%;
	font-size: 16px;
}

.input_pass {
	line-height: 38px;
	height: 38px;
	border-width: 0px;
	width: 100%;
	font-size: 20px;
	letter-spacing: 2px;
}

.input_pass::placeholder {
	line-height: 38px;
	height: 38px;
	border-width: 0px;
	width: 100%;
	font-size: 14px;
	letter-spacing: 0px;
	color:#aaa
}

.icon_see {
	width: 18px;
	height: 18px;
}
</style>