<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import * as icon from '@element-plus/icons-vue'
const router = useRouter();
export default {
	setup() {
		const router = useRouter();
		const firstMenuId = ref(0);
		const secondMenuId = ref(0);

		//跳转页面
		const onChangeMenu = (_menu) => {
			secondMenuId.value = _menu.MenuId
			router.push(_menu.MenuUrl);
		};

		return {
			firstMenuId,
			secondMenuId,
			onChangeMenu
		}
	},
	data() {
		return {
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

		this.menuList.push({
			MenuId: 11,
			MenuName: "会员管理",
			MenuIcon: "",
			MenuUrl: "",
			ChildList: [{
				MenuId: 1101,
				MenuName: "添加会员",
				MenuUrl: "/user/add",
			}, {
				MenuId: 1102,
				MenuName: "会员列表",
				MenuUrl: "/user/list",
			}]
		})

		//激活当前菜单
		this.toActiveCurrentMenu()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
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
		}
	}
}

</script>

<template>
	<!-- 顶部菜单 -->
	<div class="zhiwei_flex_between"
		style="line-height: 60px; border-bottom: solid 1px #ddd; position: fixed; z-index: 100000; top:0px; left:0px; right:0px; background-color: #fff;">
		<div style="padding:0px 20px; font-weight: 700; font-size: 24px; font-family:宋体">MedGPT综合管理平台</div>
		<div class="zhiwei_flex_end" style="padding:10px 20px">
			<div class="zhiwei_flex" style="padding:0px 10px; line-height: 40px;">
				<img src="/public/images/icons/headimg.png" style="margin:10px 5px; width:20px; height:20px; border-radius: 20px; background-color: #0080ff;"/>
				<span>{{ loginUser.NickName }}</span>
			</div>
			<div class="btn_exit" @click="onExit()">退出</div>
		</div>
	</div>

	<div style="height:100%; display: flex; flex-direction: column; min-width:1024px">
		<div style="height: 60px; min-height: 60px;"></div>
		<div class="zhiwei_flex" style="flex:1">
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
.btn_exit {
	padding: 0px 20px;
	line-height: 40px;
	font-size: 15px;
	background-color: #ff6666;
	color: #fff;
	border-radius: 5px;
	cursor: pointer;
}

.btn_exit:hover {
	background-color: #f98989;
}

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
</style>