<template>
  <el-menu :router="true" mode="horizontal" :ellipsis="false" class="navigation">
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
      <el-menu-item index="/state-management">
        <el-icon><Management /></el-icon>
        状态管理优化
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { House, Monitor, Memo, Loading, Management } from '@element-plus/icons-vue';
</script>

<style scoped>
.navigation {
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-icon) {
  width: 20px !important;
  height: 20px !important;
  font-size: 20px !important;
}
</style>
