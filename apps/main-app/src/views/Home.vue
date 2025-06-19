<template>
  <div class="home">
    <!-- <el-menu
      :router="true"
      mode="horizontal"
      :ellipsis="false"
      class="navigation"
    >
      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        首页
      </el-menu-item>
      <el-sub-menu index="optimization">
        <template #title>
          <el-icon><Monitor /></el-icon>
          性能优化示例
        </template>
        <el-menu-item index="/memo">
          <el-icon><Memo /></el-icon>
          v-memo 优化
        </el-menu-item>
        <el-menu-item index="/lazy-loading">
          <el-icon><Loading /></el-icon>
          懒加载优化
        </el-menu-item>
      </el-sub-menu>
    </el-menu> -->

    <div class="content">
      <h1>Vue3 性能优化示例</h1>
      <p>这个项目展示了 Vue3 中的各种性能优化技术：</p>
      
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <h3>v-memo 优化</h3>
            <el-button type="primary" @click="$router.push('/memo')">查看示例</el-button>
          </div>
        </template>
        <p>使用 v-memo 指令来跳过不必要的虚拟 DOM 重新渲染，优化列表渲染性能。</p>
      </el-card>

      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <h3>懒加载优化</h3>
            <el-button type="primary" @click="$router.push('/lazy-loading')">查看示例</el-button>
          </div>
        </template>
        <p>展示了图片懒加载、组件异步加载和路由懒加载等优化技术。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { House, Monitor, Memo, Loading } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  height: 100%;
}

.navigation {
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 为 ul 和 li 添加样式，确保它们不会影响图标的大小 */
.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation li {
  display: inline-block;
  margin-right: 20px;
}

.navigation :deep(.el-icon) {
  width: 20px !important;
  height: 20px !important;
  font-size: 20px !important;
}

.navigation :deep(.el-menu-item) {
  min-height: 50px;
  line-height: 50px;
}

.content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.feature-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

p {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}
</style> 