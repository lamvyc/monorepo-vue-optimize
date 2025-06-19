<template>
  <div class="home">
    <h1>Vue3 Monorepo 优化示例</h1>
    <div class="cards">
      <router-link to="/optimization/memo" class="card">
        <h3>v-memo 性能优化</h3>
        <p>展示如何使用 v-memo 指令优化大列表渲染性能</p>
      </router-link>
      <!-- 后续添加更多优化示例卡片 -->
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #409EFF;
  text-align: center;
  margin-bottom: 40px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.card h3 {
  color: #409EFF;
  margin: 0 0 10px 0;
}

.card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}
</style> 