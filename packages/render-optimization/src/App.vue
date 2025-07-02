<template>
  <div class="render-optimization">
    <el-card>
      <template #header>
        <div class="header">
          <h2>渲染优化示例（KeepAlive + 组件级缓存）</h2>
          <div>
            <el-switch
              v-model="keepAlive"
              active-text="缓存开启"
              inactive-text="缓存关闭"
            />
          </div>
        </div>
      </template>

      <div class="btn-group mb-3">
        <el-button :type="active === 'list' ? 'primary' : 'default'" @click="active = 'list'">
          用户列表
        </el-button>
        <el-button :type="active === 'chart' ? 'primary' : 'default'" @click="active = 'chart'">
          图表视图
        </el-button>
      </div>

      <!-- 使用 KeepAlive 根据开关决定是否缓存组件实例，并通过 key 强制不同模式下重新挂载 -->
      <keep-alive v-if="keepAlive">
        <component :is="currentComponent" :key="'cached-' + active" />
      </keep-alive>
      <!-- 关闭缓存时直接渲染，切换模式会销毁并重新创建组件 -->
      <component v-else :is="currentComponent" :key="'nocache-' + active" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import UserList from './components/UserList.vue';
import HeavyChart from './components/HeavyChart.vue';

// 当前激活视图
const active = ref<'list' | 'chart'>('list');
// 是否启用缓存（KeepAlive）
const keepAlive = ref(true);

// 根据激活视图返回对应组件
const currentComponent = computed(() => (active.value === 'list' ? UserList : HeavyChart));
</script>

<style scoped>
.render-optimization {
  max-width: 900px;
  margin: 40px auto;
}
.header {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  padding-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mb-3 {
  margin-bottom: 16px;
}
</style> 