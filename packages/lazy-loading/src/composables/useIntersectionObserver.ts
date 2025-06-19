import { Ref, onMounted } from 'vue'

export function useIntersectionObserver(
  elementRef: Ref<Element | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(callback, options)
    observer.observe(elementRef.value)
  })

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  return {
    stop
  }
} 