import './assets/main.css'

import {
	createApp
} from 'vue'
import App from './App.vue'

// 导入element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

// 导入路由配置
import router from './js/router.js'


const app = createApp(App)

app.use(ElementPlus, {
	locale: zhCn,
});
app.use(router)

app.mount('#app')