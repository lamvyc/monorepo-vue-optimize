import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
}

const STORAGE_KEY = 'vue-task-management';
const MAX_TITLE_LENGTH = 100;

export const useTaskStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref<Task[]>([]);
  const categories = ref<string[]>(['工作', '学习', '生活', '其他']);
  const activeCategory = ref<string>('全部');

  // 从本地存储加载数据
  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        tasks.value = data.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
      } catch (error) {
        console.error('Failed to load tasks from storage:', error);
      }
    }
  }

  // 保存数据到本地存储
  watch(
    tasks,
    (newTasks) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      } catch (error) {
        console.error('Failed to save tasks to storage:', error);
      }
    },
    { deep: true },
  );

  // Getters - 使用计算属性实现缓存
  const filteredTasks = computed(() => {
    if (activeCategory.value === '全部') return tasks.value;
    return tasks.value.filter((task) => task.category === activeCategory.value);
  });

  const tasksByPriority = computed(() => {
    const result = {
      high: [] as Task[],
      medium: [] as Task[],
      low: [] as Task[],
    };

    for (const task of filteredTasks.value) {
      result[task.priority].push(task);
    }

    return result;
  });

  const completedCount = computed(() => tasks.value.filter((task) => task.completed).length);

  const incompletedCount = computed(() => tasks.value.filter((task) => !task.completed).length);

  // 验证任务
  function validateTask(task: Omit<Task, 'id' | 'createdAt'>): string | null {
    if (!task.title.trim()) {
      return '任务标题不能为空';
    }
    if (task.title.length > MAX_TITLE_LENGTH) {
      return `任务标题不能超过${MAX_TITLE_LENGTH}个字符`;
    }
    if (!categories.value.includes(task.category)) {
      return '无效的任务分类';
    }
    if (!['low', 'medium', 'high'].includes(task.priority)) {
      return '无效的优先级';
    }
    if (tasks.value.some((t) => t.title === task.title && t.category === task.category)) {
      return '该分类下已存在相同标题的任务';
    }
    return null;
  }

  // Actions
  function addTask(task: Omit<Task, 'id' | 'createdAt'>): string | null {
    const error = validateTask(task);
    if (error) {
      return error;
    }

    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date(),
    };

    tasks.value.push(newTask);
    return null;
  }

  function removeTask(taskId: number): boolean {
    const index = tasks.value.findIndex((task) => task.id === taskId);
    if (index > -1) {
      tasks.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function toggleTaskStatus(taskId: number): boolean {
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
      const previousStatus = task.completed;
      try {
        task.completed = !task.completed;
        return true;
      } catch (error) {
        task.completed = previousStatus;
        console.error('Failed to toggle task status:', error);
        return false;
      }
    }
    return false;
  }

  function updateTaskPriority(taskId: number, priority: Task['priority']): boolean {
    if (!['low', 'medium', 'high'].includes(priority)) {
      return false;
    }

    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
      const previousPriority = task.priority;
      try {
        task.priority = priority;
        return true;
      } catch (error) {
        task.priority = previousPriority;
        console.error('Failed to update task priority:', error);
        return false;
      }
    }
    return false;
  }

  function setActiveCategory(category: string) {
    if (category === '全部' || categories.value.includes(category)) {
      activeCategory.value = category;
    }
  }

  // 生成示例数据
  function generateSampleTasks() {
    if (tasks.value.length === 0) {
      const sampleTasks: Omit<Task, 'id' | 'createdAt'>[] = [
        { title: '完成项目文档', completed: false, priority: 'high', category: '工作' },
        { title: '学习 Vue3 新特性', completed: false, priority: 'medium', category: '学习' },
        { title: '健身', completed: true, priority: 'low', category: '生活' },
        { title: '团队会议', completed: false, priority: 'high', category: '工作' },
        { title: '阅读技术博客', completed: false, priority: 'medium', category: '学习' },
      ];

      sampleTasks.forEach((task) => addTask(task));
    }
  }

  // 初始化时加载数据
  loadFromStorage();

  return {
    // 状态
    tasks,
    categories,
    activeCategory,
    // Getters
    filteredTasks,
    tasksByPriority,
    completedCount,
    incompletedCount,
    // Actions
    addTask,
    removeTask,
    toggleTaskStatus,
    updateTaskPriority,
    setActiveCategory,
    generateSampleTasks,
  };
});
