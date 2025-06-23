<template>
  <div class="container">
    <el-card class="task-card">
      <template #header>
        <div class="card-header">
          <h2>任务管理系统</h2>
          <div class="task-stats">
            <el-tag type="success">已完成: {{ completedCount }}</el-tag>
            <el-tag type="warning" class="ml-2">未完成: {{ incompletedCount }}</el-tag>
          </div>
        </div>
      </template>

      <div class="categories">
        <el-radio-group v-model="activeCategory" @change="handleCategoryChange">
          <el-radio-button label="全部" />
          <el-radio-button v-for="category in categories" :key="category" :label="category" />
        </el-radio-group>
      </div>

      <div class="add-task">
        <el-form :model="newTask" inline @submit.prevent="handleAddTask">
          <el-form-item>
            <el-input
              v-model="newTask.title"
              placeholder="任务名称"
              :maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="newTask.category" placeholder="选择分类">
              <el-option
                v-for="category in categories"
                :key="category"
                :label="category"
                :value="category"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="newTask.priority" placeholder="选择优先级">
              <el-option label="高优先级" value="high" />
              <el-option label="中优先级" value="medium" />
              <el-option label="低优先级" value="low" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddTask">添加任务</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-for="(tasks, priority) in tasksByPriority" :key="priority" class="priority-section">
        <h3 class="priority-title">
          {{ getPriorityLabel(priority) }}
          <el-tag :type="getPriorityType(priority)" size="small">{{ tasks.length }}</el-tag>
        </h3>
        <el-collapse>
          <el-collapse-item
            v-for="task in tasks"
            :key="task.id"
            :title="task.title"
            :class="{ 'task-completed': task.completed }"
          >
            <div class="task-item">
              <div class="task-content">
                <el-checkbox 
                  :model-value="task.completed"
                  @update:model-value="() => handleToggleStatus(task.id)"
                >
                  <span :class="{ completed: task.completed }">{{ task.title }}</span>
                </el-checkbox>
                <div class="task-meta">
                  <el-tag size="small">{{ task.category }}</el-tag>
                  <span class="task-date">{{ formatDate(task.createdAt) }}</span>
                </div>
              </div>
              <div class="task-actions">
                <el-select
                  :model-value="task.priority"
                  size="small"
                  @update:model-value="(val: Task['priority']) => handlePriorityChange(task.id, val)"
                >
                  <el-option label="高优先级" value="high" />
                  <el-option label="中优先级" value="medium" />
                  <el-option label="低优先级" value="low" />
                </el-select>
                <el-button type="danger" size="small" @click="() => handleRemoveTask(task.id)">
                  删除
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useTaskStore, type Task } from './stores/task';
import { ElMessage, ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';

const store = useTaskStore();

// 使用storeToRefs来保持响应性
const { 
  tasks,
  categories,
  tasksByPriority,
  completedCount,
  incompletedCount,
} = storeToRefs(store);

const {
  addTask: storeAddTask,
  removeTask: storeRemoveTask,
  toggleTaskStatus: storeToggleStatus,
  updateTaskPriority: storeUpdatePriority,
  setActiveCategory,
  generateSampleTasks,
} = store;

// 使用计算属性来保持响应性
const activeCategory = computed({
  get: () => store.activeCategory,
  set: (value: string) => setActiveCategory(value)
});

const newTask = ref({
  title: '',
  category: '',
  priority: 'medium' as Task['priority'],
  completed: false,
});

async function handleAddTask() {
  const error = storeAddTask(newTask.value);
  if (error) {
    ElMessage.warning(error);
    return;
  }

  newTask.value.title = '';
  newTask.value.category = '';
  ElMessage.success('任务添加成功');
}

function handleCategoryChange(category: string) {
  setActiveCategory(category);
  // 强制更新一下计算属性
  nextTick(() => {
    console.log('更新后的任务列表:', tasksByPriority);
  });
}

async function handleRemoveTask(taskId: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (storeRemoveTask(taskId)) {
      ElMessage.success('任务删除成功');
    } else {
      ElMessage.error('任务删除失败');
    }
  } catch {
    // 用户取消删除
  }
}

async function handleToggleStatus(taskId: number) {
  if (storeToggleStatus(taskId)) {
    ElMessage({
      message: '任务状态更新成功',
      type: 'success',
      duration: 1500,
    });
  } else {
    ElMessage.error('任务状态更新失败');
  }
}

async function handlePriorityChange(taskId: number, priority: Task['priority']) {
  if (storeUpdatePriority(taskId, priority)) {
    ElMessage({
      message: '任务优先级更新成功',
      type: 'success',
      duration: 1500,
    });
  } else {
    ElMessage.error('任务优先级更新失败');
  }
}

function getPriorityLabel(priority: string): string {
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  };
  return labels[priority as keyof typeof labels];
}

function getPriorityType(priority: string): string {
  const types = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  };
  return types[priority as keyof typeof types];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

onMounted(() => {
  generateSampleTasks();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.task-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-stats {
  display: flex;
  gap: 10px;
}

.categories {
  margin-bottom: 20px;
}

.add-task {
  margin-bottom: 30px;
}

.priority-section {
  margin-bottom: 20px;
}

.priority-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.task-content {
  flex: 1;
}

.task-meta {
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-date {
  color: #999;
  font-size: 0.9em;
}

.task-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.completed {
  text-decoration: line-through;
  color: #999;
}

.task-completed {
  opacity: 0.8;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 10px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

:deep(.el-select) {
  width: 120px;
}
</style>
