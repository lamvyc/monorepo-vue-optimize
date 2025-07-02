<template>
  <div>
    <el-table :data="users" style="width: 100%" height="500">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

// 生成大量用户数据以模拟重渲染开销
const users = ref<User[]>(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
})));

// 调试日志：记录组件的挂载 / 卸载
onMounted(() => {
  console.log('%cUserList mounted', 'color:green');
});

onUnmounted(() => {
  console.log('%cUserList unmounted', 'color:red');
});
</script> 