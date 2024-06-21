<!-- 时间列表 -->
<script setup>
	import server from '../../js/server.js';;
	// import util from '../../util.js';
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import * as icon from '@element-plus/icons-vue'

	const router = useRouter();

	//页面初始化
	onMounted(() => {
		if (router.currentRoute.value.query.medical_id != null) {
			medical_id.value = router.currentRoute.value.query.medical_id
		}
		if (router.currentRoute.value.query.diagnose_index != null) {
			diagnose_index.value = router.currentRoute.value.query.diagnose_index
		}

		LoadData(1);
	})

	//搜索
	const medical_id = ref(0);
	const diagnose_index = ref(1);

	const keyword = ref("");
	const pageIndex = ref(1);
	const pageSize = ref(10);
	const totalCount = ref(0);
	const eventList = ref([])


	//查询数据
	const LoadData = function(_pageIndex) {
		if (_pageIndex > 0) {
			pageIndex.value = _pageIndex;
		}

		server.send({
			"url": "/api/Diagnose/GetEventList", 
			loading: true,
			data: {
				medical_id: medical_id.value,
				diagnose_index: diagnose_index.value,

				keyword: keyword.value,
				pageIndex: pageIndex.value,
				pageSize: pageSize.value
			},
			success(res) {
				if (res.code == 200 && res.data != null) {
					totalCount.value = res.data.Count;
					eventList.value = res.data.List;
				} else {
					server.toast(res.msg, 2)
				}
			}
		})
	}

	//打开查看
	const onOpenDetail = (model) => {
		location.href = "/event/detail?event_id=" + model.event_id
	}


	//添加事件
	const showCreateEvent = ref(false);
	const createEventModel = ref(null);
	const onOpenCreateEvent = () => {
		showCreateEvent.value = true;
		createEventModel.value = {
			event_name: ""
		};
	}

	//提交添加事件
	const onCreateEvent = () => {
		server.confirm("确定添加不良事件信息？", null, function() {
			server.send({
				"url": "/api/Diagnose/CreateEvent",
				"data": {
					medical_id: medical_id.value,
					diagnose_index: diagnose_index.value,
					event_name: createEventModel.value.event_name
				},
				loading: true,
				success(res) {
					if (res.code == 200 && res.data > 0) {
						showCreateEvent.value = false;
						server.toast("添加成功", 1)
						//更新事件列表
						LoadData(1)
					} else {
						server.toast(res.msg, 2)
					}
				}
			})
		})

	}
</script>

<template>
	<div style="height:100%; background-color: #f4f4f4;">
		<div style="padding:20px;">
			<div style="line-height:40px; font-size:20px; font-weight: 700;">
				<span>{{ util.getDiagnoseName(diagnose_index)}} - </span>不良事件记录
			</div>
			<!-- 搜索栏 -->
			<div class="zhiwei_flex zhiwei_flex_warp"
				style="margin-top:20px; padding:10px; background:#ffffff; border-radius:5px">
				<el-button style="margin-right:10px" type="danger" :icon="icon.Plus"
					@click="onOpenCreateEvent">添加新事件</el-button>
				<div style="margin-right:10px">
					<el-input style="width:280px" placeholder="事件名称" v-model="keyword">
						<template #prepend>
							关键词
						</template>
					</el-input>
				</div>

				<div style="margin-right:10px">
					<el-button type="primary" v-on:click="LoadData(1);">搜索</el-button>
				</div>
			</div>

			<!-- 列表\分页 -->
			<div
				style="margin-top:10px; padding:5px 0px 10px 0px; min-height:500px; background:#ffffff; border-radius:5px">
				<!-- 列表 -->
				<div v-if="eventList != null && eventList.length > 0">
					<el-table :data="eventList" stripe style="width: 100%; color:#666666; ">
						<el-table-column label="序号" width="100px" align="center">
							<template #default="scope">
								<span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
							</template>
						</el-table-column>
						<el-table-column label="事件名称" width="300px">
							<template #default="scope">
								<span style="font-weight: 700;">
									{{ scope.row.event_name }}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="事件日期" width="300px">
							<template #default="scope">
								<span>
									{{ scope.row.event_date }}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="严重程度" width="120px" align="center">
							<template #default="scope">
								<span v-if="scope.row.important_level == 1">轻度</span>
								<span v-else-if="scope.row.important_level == 2">中度</span>
								<span v-else-if="scope.row.important_level == 3">重度</span>
								<span v-else-if="scope.row.important_level == 4">-</span>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="scope">
								<el-button type="primary" @click="onOpenDetail(scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div v-else style="text-align:center; line-height:200px; color:#999">未找到相关数据</div>
				<!-- 分页 -->
				<div v-if="totalCount > 0" class="block" style="padding-top:10px; padding-left:10px">
					<el-pagination layout="total,prev,pager,next" :current-page="pageIndex" :page-size="pageSize"
						:total="totalCount" v-on:current-change="LoadData"></el-pagination>
				</div>
			</div>
		</div>
	</div>


	<!-- 添加不良事件的弹框 -->
	<el-dialog v-model="showCreateEvent" title="添加不良事件" width="450px" :close-on-click-modal="false">
		<div v-if="createEventModel != null" style="padding: 20px">
			<div class="zhiwei_flex" style="margin-top:20px">
				<div style="width:80px; color:#666; line-height: 40px;">事件名称</div>
				<div>
					<el-input v-model="createEventModel.event_name" maxlength="50" show-word-limit
						style="margin-top:5px; width: 350px;" placeholder="请输入事件名称"></el-input>
				</div>
			</div>
			<div class="zhiwei_flex_center" style="margin-top:50px">
				<el-button style="width: 180px;" type="primary" size="large" @click="onCreateEvent">提交</el-button>
			</div>
		</div>
	</el-dialog>

</template>