<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="logo">
        <span class="title">Vue Comp Demo</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px" class="aside">
        <el-menu :default-active="activeName" @select="handleSelect">
          <el-menu-item index="FileParser">文件解析器 (FileParser)</el-menu-item>
          <!-- 后续组件菜单放这里 -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <component :is="activeComponent" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FileParser from './components/FileParser/index.vue'

const componentsMap = {
  FileParser
}

type ComponentKey = keyof typeof componentsMap
const activeName = ref<ComponentKey>('FileParser')
const activeComponent = computed(() => componentsMap[activeName.value])

function handleSelect(index: string) {
  if (index in componentsMap) {
    activeName.value = index as ComponentKey
  }
}
</script>

<style lang="less" scoped>
.layout {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  background-color: #35495e;
  color: #fff;
  padding: 0 20px;
  .logo {
    display: flex;
    align-items: center;
    img {
      height: 32px;
      margin-right: 10px;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.aside {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
}
.main {
  padding: 20px;
  overflow: auto;
  background-color: #f5f5f5;
}
</style> 