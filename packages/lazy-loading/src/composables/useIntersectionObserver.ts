import { Ref, onMounted } from 'vue';

/**
 * 自定义 Hook：useIntersectionObserver
 * 用于监听某个 DOM 元素是否进入视口（viewport），即是否出现在用户可视区域内。
 * 在浏览器中滚动页面时，只有一部分内容能看到，那一部分就是“视口”。
 * 页面中元素进入这个区域，才对用户可见。
 *
 * @param elementRef - 需要观察的 DOM 元素的 ref 引用
 * @param callback - IntersectionObserver 回调函数，触发时提供 entries 和 observer
 * @param options - IntersectionObserver 配置项，可选，默认值如下：
 *                  - root: null（表示相对于视口）
 *                  - rootMargin: '0px'（边距）
 *                  - threshold: 0（触发回调的可见度比例）
 *
 * @returns { stop: Function } 提供停止观察的方法
 */
export function useIntersectionObserver(
  elementRef: Ref<Element | null>, // 被观察的 DOM 元素 ref
  callback: IntersectionObserverCallback, // 触发回调
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  },
) {
  let observer: IntersectionObserver | null = null; // 记录当前的 IntersectionObserver 实例

  // 在组件挂载后创建 IntersectionObserver 并开始观察
  onMounted(() => {
    if (!elementRef.value) return; // 若 ref 尚未绑定到 DOM 元素，直接返回

    observer = new IntersectionObserver(callback, options); // 创建观察器
    observer.observe(elementRef.value); // 开始观察目标元素
  });

  // 提供一个停止观察的方法，通常在组件卸载时调用以清理资源
  const stop = () => {
    if (observer) {
      observer.disconnect(); // 停止观察所有元素
      observer = null; // 清空引用
    }
  };

  return {
    stop, // 返回 stop 方法供外部调用
  };
}
