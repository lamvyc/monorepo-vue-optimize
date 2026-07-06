import { createApp } from 'vue'
import App from './App.vue'

// 导入Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建Vue应用
const app = createApp(App)

// 使用插件
app.use(Antd)
app.use(ElementPlus)

// 挂载应用
app.mount('#app') 