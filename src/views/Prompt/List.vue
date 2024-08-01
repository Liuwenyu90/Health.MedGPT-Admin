<script>
import { ref, onMounted, watch, computed } from 'vue';
import { ElPagination } from 'element-plus';
import server from '@/js/server'; // 导入封装的server.js

export default {
  components: {
    ElPagination
  },
  setup() {
    const promptsList = ref([]); // 用于存储列表数据
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(0);
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
    const paginatedList = computed(() => promptsList.value);

    const loginUser = ref(server.getCache("LoginUser")); // 使用server.js中的方法获取缓存

    const fetchData = async () => {
      try {
        const response = await server.send({
          url: 'Prompt/List', // 假设这是正确的API路径
          method: 'get',
          data: {
            page: currentPage.value,
            page_size: pageSize.value
          },
          loading: true, // 根据server.send的设计，设置loading遮罩
          shade: false // 设置遮罩的透明度
        });

        if (response && response.data) {
          const data = response.data;
          promptsList.value = data.prompts.map(item => ({
            id: item.id,
            prompt_name: item.prompt_name,
            prompt_icon: item.prompt_icon,
            prompt_intro: item.prompt_intro,
            status: item.status,
            sort: item.sort,
            call_count: item.call_count,
            add_date: item.add_date
          }));
          totalItems.value = data.total;
        } else {
          throw new Error('Response data format is incorrect');
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchData();
    };

    onMounted(() => {
      fetchData(); // 初始加载数据
    });

    watch(pageSize, (newVal) => {
      currentPage.value = 1; // 重置当前页码为1
      fetchData();
    });

    const GoPage=function(){
      location.href = '/Talk/Index?promptId=2'
    }

    return {
      promptsList,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      loginUser,
      fetchData,
      handlePageChange,
      paginatedList,
      GoPage
    };
  }
};
</script>

<template>
  <div style="padding: 15px 20px;">
    <div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
      <!-- 列表标题 -->
      <span class="page_title">助手列表</span>

      <div @click="GoPage()">助手</div>

      <!-- 列表展示区域 -->
      <div class="list-container" style="margin-top: 20px;">
        <ul>
          <li v-for="item in paginatedList" :key="item.id">
            <!-- 展示列表项的相关信息 -->
            <span>{{ prompt.prompt_name }}</span>
            <!-- 可以根据需要添加其他字段 -->
            <img :src="prompt.prompt_icon" alt="图标"> <!-- 假设prompt_icon是图标的URL -->
            <p>{{ prompt.prompt_intro }}</p> <!-- 展示简介 -->
            <!-- 其他列表项信息 -->
          </li>
        </ul>
      </div>
      <!-- 分页控件 -->
      <div class="pagination-container" style="margin-top: 20px; text-align: center;">
        <el-pagination layout="prev, pager, next" :total="totalItems" :current-page="currentPage"
          @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<style>
/* 省略其他样式 */
.list-container img {
  width: 50px;
  /* 根据需要调整图标大小 */
  height: auto;
}

.list-container p {
  margin: 5px 0;
}
</style>