<template>
	<div style="width:100%; height:100%">
		<router-view></router-view>
	</div>
</template>


<script>
export default {
	created() {

	},
	mounted() {
		console.log("启动成功")
	}
}
</script>

<style>
.main_container {
	padding: 20px
}
</style>