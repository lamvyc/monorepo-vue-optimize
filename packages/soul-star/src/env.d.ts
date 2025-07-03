/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 不再需要这个声明，已安装 @types/three
// declare module 'three' {
//   export * from 'three/src/Three';
// }
