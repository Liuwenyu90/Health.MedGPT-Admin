<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import server from '../../js/server.js';

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
	<div style="padding: 15px 20px;">
		<div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">

			<div class="page_title">模板页</div>

		</div>
	</div>
</template>


<style>

</style>