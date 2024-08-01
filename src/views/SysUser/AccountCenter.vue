<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import uploadImage from "../../components/UploadImage.vue"
import server from '../../js/server.js';
import util from '../../js/util.js';

export default {
	components: {
		uploadImage
	},
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
			fileHost: server.FileHost(),
			loginUser: null,
			editModel: null,
			//0：账号资料，1：编辑自己，2：实名认证
			actionType: 0
		}
	},
	created() {
		this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))
		//this.onOpenEdit()
	},
	methods: {
		onOpenEdit() {
			this.actionType = 1
			this.editModel = {
				LoginName: this.loginUser.LoginName,
				NickName: this.loginUser.NickName,
				HeadImg: this.loginUser.HeadImg,
				Mobile: this.loginUser.Mobile
			}
		},
		onSubmitEdit() {
			let _that = this
			server.send({
				"url": "/sys/account/edit",
				loading: true,
				data: {
					nickName: _that.editModel.NickName,
					headImg: _that.editModel.HeadImg,
					mobile: _that.editModel.Mobile
				},
				success(res) {
					if (res.code == 200 && res.data === true) {
						server.toast("修改成功", 1)
						_that.loginUser.NickName = _that.editModel.NickName;
						_that.loginUser.HeadImg = _that.editModel.HeadImg;
						_that.loginUser.Mobile = _that.editModel.Mobile;

						//更新用户资料
						//***************************************
						util.ReLoadLoginUser();
						//跳转主页
						_that.actionType = 1;
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
		<!-- 账号资料 -->
		<div v-if="actionType == 0" style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
			<div class="page_title">账号资料</div>

			<div style="margin-top:30px;">
				<div style="line-height: 40px;">
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">登录账号</div>
						<div style="flex:1">{{ loginUser.LoginName }}</div>
					</div>
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">用户昵称</div>
						<div style="flex:1">{{ loginUser.NickName }}</div>
					</div>
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">手机号</div>
						<div style="flex:1">
							{{ loginUser.Mobile }}
						</div>
					</div>
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">用户头像</div>
						<div style="flex:1">
							<img v-if="loginUser.HeadImg != null && loginUser.HeadImg.length > 0"
								:src="fileHost + loginUser.HeadImg" style="width:100px; height:100px" />
						</div>
					</div>
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">注册日期</div>
						<div style="flex:1">
							{{ loginUser.AddDate }}
						</div>
					</div>
				</div>
				<div style="padding: 30px 0px">
					<el-button type="danger" style="width:100px" @click="onOpenEdit">
						<el-icon :size="16">
							<EditPen />
						</el-icon>
						<span style="margin-left: 5px;">编辑</span>
					</el-button>
					<el-button type="primary" style="width:100px">
						<el-icon :size="16">
							<Edit />
						</el-icon>
						<span style="margin-left: 5px;">实名认证</span>
					</el-button>
				</div>
			</div>
		</div>
		<!-- 编辑资料 -->
		<div v-else-if="actionType == 1" style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
			<div class="page_title">编辑资料</div>

			<div v-if="editModel != null" style="margin-top:30px">
				<div style="line-height: 40px;">
					<div class="zhiwei_flex">
						<div style="width:100px; color:#777777">登录账号</div>
						<div style="flex:1">{{ loginUser.LoginName }}</div>
					</div>
					<div class="zhiwei_flex" style="margin-top:10px">
						<div style="width:100px; color:#777777; line-height: 40px;" maxlength="20">用户昵称</div>
						<div style="flex:1">
							<el-input v-model="editModel.NickName" style="width:200px"></el-input>
						</div>
					</div>
					<div class="zhiwei_flex" style="margin-top:10px">
						<div style="width:100px; color:#777777">手机号</div>
						<div style="flex:1">
							<el-input v-model="editModel.Mobile" style="width:200px" maxlength="11"></el-input>
						</div>
					</div>
					<div class="zhiwei_flex" style="margin-top:10px">
						<div style="width:100px; color:#777777">用户头像</div>
						<div style="flex:1">
							<uploadImage v-model:files="editModel.HeadImg" :max="1" :size="1024 * 10" :width="100"
								:height="100"></uploadImage>
						</div>
					</div>
				</div>
				<div style="padding: 30px 0px">
					<el-button type="default" style="width:80px" @click="actionType = 0">
						<el-icon :size="16">
							<ArrowLeft />
						</el-icon>
						<span style="margin-left: 5px;">返回</span>
					</el-button>
					<el-button type="danger" style="width:100px" @click="onSubmitEdit">
						<el-icon :size="16">
							<Select />
						</el-icon>
						<span style="margin-left: 5px;">提交修改</span>
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>


<style></style>