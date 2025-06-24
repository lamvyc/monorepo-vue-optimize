<template>
  <div class="container">
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <h2>资源压缩演示</h2>
        </div>
      </template>

      <div class="demo-section">
        <h3>1. 图片压缩</h3>
        <div class="image-comparison">
          <div class="image-item">
            <h4>原始图片</h4>
            <img src="/images/original.jpg" alt="原始图片" />
            <p>大小: {{ getFileSize('original') }}</p>
          </div>
          <div class="image-item">
            <h4>压缩后</h4>
            <img src="/images/compressed.jpg" alt="压缩后的图片" />
            <p>大小: {{ getFileSize('compressed') }}</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>2. Gzip压缩</h3>
        <el-table :data="compressionStats" border style="width: 100%">
          <el-table-column prop="fileName" label="文件名" width="180" />
          <el-table-column prop="originalSize" label="原始大小" width="180" />
          <el-table-column prop="compressedSize" label="Gzip后大小" />
          <el-table-column prop="ratio" label="压缩比" />
        </el-table>
      </div>

      <div class="demo-section">
        <h3>3. 代码分割</h3>
        <el-descriptions border>
          <el-descriptions-item label="主包">
            app.js: {{ getFileSize('app') }}
          </el-descriptions-item>
          <el-descriptions-item label="Vue相关">
            vue-vendor.js: {{ getFileSize('vue-vendor') }}
          </el-descriptions-item>
          <el-descriptions-item label="Element Plus">
            element-plus.js: {{ getFileSize('element-plus') }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟文件大小数据
const compressionStats = ref([
  {
    fileName: 'app.js',
    originalSize: '156 KB',
    compressedSize: '45 KB',
    ratio: '71.2%'
  },
  {
    fileName: 'vendor.js',
    originalSize: '1.2 MB',
    compressedSize: '320 KB',
    ratio: '73.3%'
  },
  {
    fileName: 'style.css',
    originalSize: '85 KB',
    compressedSize: '22 KB',
    ratio: '74.1%'
  }
]);

// 模拟获取文件大小
function getFileSize(type: string): string {
  const sizes = {
    original: '2.5 MB',
    compressed: '850 KB',
    app: '156 KB',
    'vue-vendor': '320 KB',
    'element-plus': '450 KB'
  };
  return sizes[type as keyof typeof sizes] || 'N/A';
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 20px;
  color: #409EFF;
}

.image-comparison {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.image-item {
  flex: 1;
  text-align: center;
}

.image-item img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-item h4 {
  margin: 10px 0;
  color: #606266;
}

.image-item p {
  color: #909399;
}
</style> 