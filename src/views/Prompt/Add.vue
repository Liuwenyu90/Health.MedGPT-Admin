<template>
	<div class="add-prompt-container">
	  <h2>添加助手</h2>
		<el-form :model="formData" @submit.native.prevent="addPrompt">
				<el-form-item label="助手名称">
				<el-input v-model="formData.prompt_name" placeholder="助手名称"></el-input>
				</el-form-item>
				<el-form-item label="助手图标">
				<el-input v-model="formData.prompt_icon" placeholder="助手图标"></el-input>
				</el-form-item>
				<el-form-item label="助手简介">
				<el-input v-model="formData.prompt_intro" placeholder="助手简介"></el-input>
				</el-form-item>
				<el-form-item label="助手内容">
				<el-input
					type="textarea"
					v-model="formData.prompt_content"
					placeholder="助手内容"
				></el-input>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" @click="addPrompt">确认添加</el-button>
				</el-form-item>
		</el-form>
	</div>
  </template>
  
  <script>
  import server from '../../js/server.js'; // 导入server.js中的逻辑
  import { ElInput, ElButton, ElForm, ElFormItem, ElMessage } from 'element-plus';
  
  export default {
	components: {
	  ElInput,
	  ElButton,
	  ElForm,
	  ElFormItem,
	},
	data() {
	  return {
		formData: {
		  prompt_name: '',
		  prompt_icon: '',
		  prompt_intro: '',
		  prompt_content: '',
		},
	  };
	},
	methods: {
	  addPrompt() {
		// 表单验证逻辑可以在这里实现
		
		server.send({
		  method: 'post',
		  url: '/Prompt/Add',
		  data: this.formData,
		  success: (data) => {
			if (data.msg === '添加成功') {
			  ElMessage.success('添加成功');
			}
		  },
		  fail: (error) => {
			ElMessage.error('添加失败');
		  },
		});
	  },
	},
  };
  </script>
  
  <style scoped>
  .add-prompt-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
  }
  </style>