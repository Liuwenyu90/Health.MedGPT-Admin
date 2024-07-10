<script>
import server from '../../js/server.js'; // 导入server.js中的逻辑
// import util from '../../util.js';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as icon from '@element-plus/icons-vue';
import ElMessage from 'element-plus/lib/el-message.min.js'; // 引入Element Plus的消息提示组件
import { ElUpload } from 'element-plus';

const router = useRouter();
const isEditMode = ref(false);
const uploadUrl = '/sys/file/upload'; 

//页面初始化
onMounted(() => {
	if (router.currentRoute.value.query.medical_id != null) {
		medical_id.value = router.currentRoute.value.query.medical_id
	}
	if (router.currentRoute.value.query.diagnose_index != null) {
		diagnose_index.value = router.currentRoute.value.query.diagnose_index
	}

	LoadData(1);
});

//搜索
const medical_id = ref(0);
const diagnose_index = ref(1);

const keyword = ref("");
const page = ref(1);
const page_size = ref(10);
const mobile = ref('');
const nickname = ref('');

// 表单数据
const formData = ref({
	id: null,
	mobile: '',
	nickname: ''
});

// 添加会员的方法
const addMember = () => {
  if (!mobile.value || !nickname.value) {
    ElMessage.error('手机号和昵称不能为空');
    return;
  }
  server.send({
    method: 'POST',
    url: '/api/member/Add',
    data: {
      mobile: mobile.value,
      nickname: nickname.value,
    },
    success: (response) => {
      if (response.code === 200) {
        ElMessage.success(response.msg);
        // 重置表单
        mobile.value = '';
        nickname.value = '';
        // 可以在这里调用 LoadData 来刷新列表
      } else {
        ElMessage.error(response.msg);
      }
    },
    error: (error) => {
      console.error('添加会员失败:', error);
      ElMessage.error('添加会员失败');
    },
  });
};

// 编辑会员的方法
const editMember = async () => {
  if (!formData.value.id) {
    ElMessage.error('会员ID不能为空');
    return;
  }
  // 文件上传成功的回调
  const handleAvatarSuccess = (res, file) => {
    avatar.value = URL.createObjectURL(file.raw);
    formData.value.avatar = res.file_path; // 假设服务器返回的路径是file_path
  };
  
  // 文件上传前的验证
  const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;
  
    if (!isJPG) {
      ElMessage.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
      ElMessage.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
  };
  try {
    const response = await server.send({
      method: 'POST',
      url: `/api/member/Edit/${formData.value.id}`, // 假设编辑API需要ID
      data: {
        mobile: formData.value.mobile,
        nickname: formData.value.nickname,
        // 其他字段如头像...
      },
    });
    if (response.code === 200) {
      ElMessage.success(response.msg);
      // 重置表单和编辑模式
      formData.value = { id: null, mobile: '', nickname: '' };
      isEditMode.value = false;
      // 可以在这里调用 LoadData 来刷新列表
    } else {
      ElMessage.error(response.msg || '编辑失败');
    }
  } catch (error) {
    console.error('编辑会员失败:', error);
    ElMessage.error('编辑会员失败');
  }
};

export default {
  setup() {
    return {
      // 将响应式引用和方法暴露给模板
      medical_id,
      diagnose_index,
      keyword,
      page,
      page_size,
      mobile,
      nickname,
      formData,
      addMember,
      editMember,
    };
  },
  components: {
	ElUpload,
    ElInput,
	ElButton,
	ElForm,
	ElFormItem,
  },
methods: {
  addPrompt() {
	// 表单验证逻辑可以在这里实现
	
	server.send({
	  method: 'post',
	  url: '/api/member/Add',
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


<template>
	<div style="height:100%; background-color: #f4f4f4;">
	<!-- 添加会员表单 -->
	<div style="margin-top: 20px; padding: 10px; background:#f4f4f4; border-radius: 5px;">
		<h3>添加/编辑会员</h3>
		<el-form :model="formData" label-width="120px">
		  <el-form-item label="手机号">
		    <el-input v-model="formData.mobile" placeholder="请输入手机号"></el-input>
		  </el-form-item>
		  <el-form-item label="昵称">
		    <el-input v-model="formData.nickname" placeholder="请输入昵称"></el-input>
		  </el-form-item>
		  <!-- 头像上传 -->
			<el-form-item label="头像">
			<el-upload
			  :action="uploadUrl"
			  :on-success="handleAvatarSuccess"
			  :before-upload="beforeAvatarUpload"
			  :show-file-list="false">
			  <img v-if="avatar" :src="avatar" class="avatar">
			  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
			</el-upload>
			</el-form-item>
		  
		  <el-form-item>
		    <el-button type="primary" @click="isEditMode ? editMember : addMember">
				{{ isEditMode ? '保存修改' : '添加会员' }}
			</el-button>
		  </el-form-item>
		</el-form>
	</div>
	</div>
</template>