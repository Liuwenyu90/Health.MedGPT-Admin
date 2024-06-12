import {
	createApp
} from 'vue'
import App from './App.vue'

// 导入element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

// 导入弹出框样式
import 'vue3-layer/dist/s3Layer.css';

// 导入路由配置
import router from './js/router.js'

// 导入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(ElementPlus, {
	locale: zhCn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.use(router)

app.mount('#app')