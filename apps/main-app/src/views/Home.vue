<template>
  <div class="home">
    <Navigation />
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
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <h3>状态管理优化</h3>
            <el-button type="primary" @click="$router.push('/state-management')">查看示例</el-button>
          </div>
        </template>
        <p>展示了使用 Pinia 进行状态管理，优化组件之间的数据共享和状态管理。</p>
      </el-card>
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <h3>资源压缩优化</h3>
            <el-button type="primary" @click="$router.push('/resource-compression')">查看示例</el-button>
          </div>
        </template>
        <p>展示了使用 vite-plugin-compression 进行资源压缩，优化页面加载性能。</p>
      </el-card>
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <h3>渲染优化</h3>
            <el-button type="primary" @click="$router.push('/render-optimization')">查看示例</el-button>
          </div>
        </template>
        <p>展示了使用 KeepAlive 进行组件级缓存，优化渲染性能。</p>
      </el-card>
    </div>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import Navigation from '../components/Navigation.vue';
import BackToTop from '../components/BackToTop.vue';
</script>

<style scoped>
.home {
  height: 100%;
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
