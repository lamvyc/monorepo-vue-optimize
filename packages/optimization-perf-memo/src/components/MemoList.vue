<template>
  <div class="memo-demo">
    <div class="controls">
      <el-button type="primary" @click="addItems">批量添加100项</el-button>
      <el-button type="warning" @click="updateAllTimestamps">更新所有时间戳</el-button>
      <el-button type="success" @click="updateRandomScores">随机更新10个分数</el-button>
      <el-button type="danger" @click="reset">重置数据</el-button>
    </div>

    <div class="performance-stats">
      <div class="stat-item">
        <h3>性能统计</h3>
        <p>列表项数量: {{ items.length }}</p>
        <p>更新操作次数: {{ updateCount }}</p>
      </div>
      <div class="stat-item">
        <h3>渲染时间对比 (ms)</h3>
        <div class="render-stats">
          <div class="stat-bar">
            <div class="label">普通渲染:</div>
            <div class="bar">
              <div class="bar-inner" :style="{ width: normalRenderTime + 'px' }"></div>
              <span>{{ normalRenderTime.toFixed(2) }}ms</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="label">v-memo:</div>
            <div class="bar">
              <div class="bar-inner" :style="{ width: memoRenderTime + 'px' }"></div>
              <span>{{ memoRenderTime.toFixed(2) }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lists">
      <div class="list" ref="normalList">
        <h3>不使用 v-memo（普通渲染）</h3>
        <p class="subtitle">每次更新都会重新渲染整个列表项</p>
        <div class="list-container">
          <div
            v-for="item in items"
            :key="item.id"
            class="list-item"
            :class="{ highlight: item.isUpdated }"
          >
            <span class="name">{{ item.name }}</span>
            <span class="score">得分: {{ item.score }}</span>
            <span class="time">{{ item.timestamp }}</span>
          </div>
        </div>
      </div>

      <div class="list" ref="memoList">
        <h3>使用 v-memo（优化渲染）</h3>
        <p class="subtitle">只有当 name 或 score 变化时才重新渲染</p>
        <div class="list-container">
          <div
            v-for="item in items"
            :key="item.id"
            class="list-item"
            v-memo="[item.name, item.score]"
            :class="{ highlight: item.isUpdated }"
          >
            <span class="name">{{ item.name }}</span>
            <span class="score">得分: {{ item.score }}</span>
            <span class="time">{{ item.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
您可以尝试：
点击"批量添加100项"观察两种渲染方式的性能差异
点击"更新所有时间戳"，注意右侧使用 v-memo 的列表不会重新渲染（因为 v-memo 只监听 name 和 score）
点击"随机更新10个分数"，观察右侧列表只有分数变化的项目会重新渲染
*/
import { ref, onMounted } from 'vue';

interface ListItem {
  id: number;
  name: string;
  score: number;
  timestamp: string;
  isUpdated: boolean;
}

const items = ref<ListItem[]>([]);
const updateCount = ref(0);
const normalRenderTime = ref(0);
const memoRenderTime = ref(0);
let nextId = 1;

// 测量渲染时间的函数
const measureRenderTime = async (callback: () => void) => {
  const start = performance.now();
  callback();
  await new Promise((resolve) => setTimeout(resolve, 0)); // 等待下一个渲染周期
  return performance.now() - start;
};

const addItems = async () => {
  const newItems = Array.from({ length: 100 }, (_, index) => ({
    id: nextId + index,
    name: `Item ${nextId + index}`,
    score: Math.floor(Math.random() * 100),
    timestamp: new Date().toLocaleTimeString(),
    isUpdated: false,
  }));
  nextId += 100;

  const [normalTime, memoTime] = await Promise.all([
    measureRenderTime(() => {
      items.value.push(...newItems);
    }),
    measureRenderTime(() => {
      items.value.push(...newItems);
    }),
  ]);

  normalRenderTime.value = normalTime;
  memoRenderTime.value = memoTime;
  updateCount.value++;
};

const updateAllTimestamps = async () => {
  const now = new Date().toLocaleTimeString();

  // 重置高亮状态
  items.value.forEach((item) => (item.isUpdated = false));

  const [normalTime, memoTime] = await Promise.all([
    measureRenderTime(() => {
      items.value.forEach((item) => {
        item.timestamp = now;
        item.isUpdated = true;
      });
    }),
    measureRenderTime(() => {
      items.value.forEach((item) => {
        item.timestamp = now;
        item.isUpdated = true;
      });
    }),
  ]);

  normalRenderTime.value = normalTime;
  memoRenderTime.value = memoTime;
  updateCount.value++;

  // 3秒后移除高亮
  setTimeout(() => {
    items.value.forEach((item) => (item.isUpdated = false));
  }, 3000);
};

const updateRandomScores = async () => {
  const itemsToUpdate = 10;
  const totalItems = items.value.length;

  // 重置高亮状态
  items.value.forEach((item) => (item.isUpdated = false));

  const [normalTime, memoTime] = await Promise.all([
    measureRenderTime(() => {
      for (let i = 0; i < itemsToUpdate; i++) {
        const index = Math.floor(Math.random() * totalItems);
        items.value[index].score = Math.floor(Math.random() * 100);
        items.value[index].timestamp = new Date().toLocaleTimeString();
        items.value[index].isUpdated = true;
      }
    }),
    measureRenderTime(() => {
      for (let i = 0; i < itemsToUpdate; i++) {
        const index = Math.floor(Math.random() * totalItems);
        items.value[index].score = Math.floor(Math.random() * 100);
        items.value[index].timestamp = new Date().toLocaleTimeString();
        items.value[index].isUpdated = true;
      }
    }),
  ]);

  normalRenderTime.value = normalTime;
  memoRenderTime.value = memoTime;
  updateCount.value++;

  // 3秒后移除高亮
  setTimeout(() => {
    items.value.forEach((item) => (item.isUpdated = false));
  }, 3000);
};

const reset = () => {
  items.value = [];
  updateCount.value = 0;
  nextId = 1;
  normalRenderTime.value = 0;
  memoRenderTime.value = 0;
};

// 初始化一些数据
onMounted(() => {
  addItems();
});
</script>

<style scoped>
.memo-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-item {
  padding: 15px;
}

.stat-item h3 {
  color: #409eff;
  margin: 0 0 15px 0;
}

.render-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  width: 100px;
  text-align: right;
  color: #666;
}

.bar {
  flex: 1;
  height: 24px;
  background: #f5f7fa;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  background: #409eff;
  transition: width 0.3s ease;
}

.bar span {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  font-size: 12px;
}

.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.list {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.list h3 {
  margin: 0;
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.subtitle {
  color: #909399;
  font-size: 0.9em;
  margin: 10px 0;
}

.list-container {
  height: 400px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  margin: 5px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.list-item.highlight {
  background: #ecf5ff;
  transform: scale(1.02);
}

.name {
  font-weight: bold;
  color: #333;
}

.score {
  color: #67c23a;
}

.time {
  color: #909399;
  font-size: 0.9em;
}

/* 自定义滚动条样式 */
.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.list-container::-webkit-scrollbar-thumb {
  background: #409eff;
  border-radius: 3px;
}

.list-container::-webkit-scrollbar-thumb:hover {
  background: #337ecc;
}
</style>
