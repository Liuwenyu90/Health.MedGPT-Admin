<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import * as icon from '@element-plus/icons-vue'
import server from '@/js/server';

export default {
	setup() {
		const router = useRouter();
		const firstMenuId = ref(0);
		const secondMenuId = ref(0);

		return {
			firstMenuId,
			secondMenuId,
			//跳转菜单
			onChangeMenu(_menu) {
				secondMenuId.value = _menu.MenuId
				router.push(_menu.MenuUrl);
			},
			//跳转页面
			onOpenPage(_pageUrl) {
				router.push(_pageUrl);
			}
		}
	},
	data() {
		return {
			fileHost: server.FileHost(),
			showAccountCenter: false,
			currentUrl: null,
			loginUser: null,
			win: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			menuList: []
		}
	},
	created() {
		window.addEventListener('resize', this.handleResize);
		this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))

		//加载菜单列表
		this.LoadMenu();
		
		//激活当前菜单
		this.toActiveCurrentMenu();

	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
		//加载菜单列表
		LoadMenu() {
			let _that = this
			server.send({
				"url": "/sys/account/getmenu",
				success(res) {
					if (res.code == 200 && res.data != null) {
						let _menuList = []
						for (var i = 0; i < res.data.length; i++) {
							if (res.data[i].ParentId == 0) {
								let menuModel = {
									MenuId: res.data[i].MenuId,
									MenuName: res.data[i].MenuName,
									MenuIcon: res.data[i].MenuIcon,
									MenuUrl: res.data[i].MenuUrl,
									ChildList: []
								};

								//添加二级菜单
								for (var j = 0; j < res.data.length; j++) {
									if (res.data[i].MenuId == res.data[j].ParentId) {
										menuModel.ChildList.push({
											MenuId: res.data[j].MenuId,
											MenuName: res.data[j].MenuName,
											MenuIcon: res.data[j].MenuIcon,
											MenuUrl: res.data[j].MenuUrl
										})
									}
								}
								_menuList.push(menuModel)
							}
						}
						_that.menuList = _menuList
					} else {
						server.toast(res.msg, 2)
					}
				}
			})
		},
		handleResize() {
			this.win = {
				width: window.innerWidth,
				height: window.innerHeight
			}
		},
		//激活当前菜单
		toActiveCurrentMenu() {
			var path = this.$router.currentRoute.value.path;
			for (var i = 0; i < this.menuList.length; i++) {
				if (this.menuList[i].ChildList != null && this.menuList[i].ChildList.length > 0) {

					for (var j = 0; j < this.menuList[i].ChildList.length; j++) {
						if (this.menuList[i].ChildList[j].MenuUrl == path) {
							this.secondMenuId = this.menuList[i].ChildList[j].MenuId
							break;
						}
					}
				}
			}
		},
		//退出登录
		onExit() {
			localStorage.removeItem('LoginUser')
			window.parent.location.href = "/login"
		},
		onOpenAccountCenterBox() {
			document.getElementById("div_account_center_menu").style.display = "block"
		},
		onCloseAccountCenterBox() {
			document.getElementById("div_account_center_menu").style.display = "none"
		}
	}
}

</script>

<template>
	<!-- 顶部菜单 -->
	<div class="zhiwei_flex_between"
		style="line-height: 60px; border-bottom: solid 1px #ddd; position: fixed; z-index: 100000; top:0px; left:0px; right:0px; background-color: #3697FF;">
		<div style="padding:0px 20px; font-weight: 700; font-size: 24px; font-family:宋体; color:#fff">MedGPT综合管理平台</div>
		<div class="zhiwei_flex_end" style="padding:0px 20px">
			<!-- 个人中心 -->
			<div class="btn_account_info zhiwei_flex_center"
				style="padding:0px 10px; width:120px; line-height: 60px; cursor: pointer; position: relative;"
				@mouseover="onOpenAccountCenterBox" @mouseout="onCloseAccountCenterBox">
				<img :src="fileHost + loginUser.HeadImg"
					style="padding: 2px;;margin: 8px 5px; width:21px; min-width:21px; height:21px; border-radius: 21px; background-color: #fff;"
					onerror="this.src='/images/icons/headimg.png'" />

				<span class="auto_hidden">{{ loginUser.NickName }}</span>
				<!-- 个人中心菜单 -->
				<div id="div_account_center_menu"
					style="position: absolute; top:60px; right:0px; padding:20px; width:160px; background-color: #00a2f3; box-shadow: 0px 5px 10px #aaa; display: none"
					@mouseover="onOpenAccountCenterBox" @mouseout="onCloseAccountCenterBox">
					<div class="btn_account_menu" @click="onOpenPage('/SysUser/AccountCenter')">账号中心</div>
					<div class="btn_account_menu" style="margin-top:10px" @click="onOpenPage('/SysUser/EditPassword')">
						修改密码</div>
					<div class="btn_account_menu" style="margin-top:10px" @click="onExit()">退出</div>
				</div>
			</div>
		</div>
	</div>

	<div style="height:100%; display: flex; flex-direction: column; min-width:1024px">
		<div style="height: 60px; min-height: 60px;"></div>
		<div style="flex:1; display: flex; justify-content: flex-start">
			<!-- 左侧菜单 -->
			<div style="width:240px; overflow:hidden">
				<div style="overflow-y:scroll; width: 245px;" :style="{ 'height': win.height - 60 + 'px' }">
					<div style="padding:20px">
						<div v-for="fiestMenu in menuList">
							<div class="first_menu">
								{{ fiestMenu.MenuName }}
							</div>
							<div v-for="secondMenu in fiestMenu.ChildList">
								<div class="second_menu"
									:class="{ 'second_menu_active': secondMenuId == secondMenu.MenuId }"
									@click="onChangeMenu(secondMenu)">
									{{ secondMenu.MenuName }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 主功能区 -->
			<div style="flex:1; background-color: #f5f5f5; overflow-y: auto"
				:style="{ 'height': win.height - 60 + 'px' }">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>


<style>
.first_menu {
	line-height: 40px;
	color: #777;
	font-size: 15px
}

.second_menu {
	margin-top: 5px;
	padding: 0px 30px;
	line-height: 40px;
	cursor: pointer;
	font-size: 15px;
	border-radius: 3px;
}

.second_menu:hover {
	background-color: #f4f9fc;
}

.second_menu_active {
	background-color: #e6f4ff;
	color: #2c94e3
}

.second_menu_active:hover {
	background-color: #e6f4ff;
}

.btn_account_info {
	color:#fff
}

.btn_account_info:hover {
	background-color: #fff;
	color:#000
}


.btn_account_menu {
	padding: 0px 20px;
	line-height: 35px;
	font-size: 15px;
	background-color: #fff;
	border: solid 1px #eee;
	color: #333;
	border-radius: 5px;
	cursor: pointer;
	text-align: center;
}

.btn_account_menu:hover {
	background-color: #f98989;
	color: #fff;
}
</style>