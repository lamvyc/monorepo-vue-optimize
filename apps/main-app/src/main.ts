import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

// 确保 ElementPlus 在 router 之前注册
app.use(ElementPlus, {
  // 设置全局配置
  size: 'default',
  zIndex: 3000,
});

// 注册所有图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }

app.use(router);
app.use(pinia);
app.mount('#app');
