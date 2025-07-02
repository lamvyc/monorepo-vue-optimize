# Vue 源码学习与实现

该子项目用于动手实现 Vue3 核心的轻量版功能，主要关注以下模块：

1. 响应式系统 (reactivity)
2. 计算属性 (computed)
3. 侦听器 (watchEffect / watch) – TODO

通过 TypeScript 编写，并配合 Vitest 进行单元测试，帮助加深对 Vue 内部工作机制的理解。

## 使用

```bash
# 安装依赖（在 monorepo 根目录）
pnpm install

# 运行测试 (watch 模式)
pnpm --filter @vue-monorepo/vue-source dev

# 构建输出 (生成 dist + 类型声明)
pnpm --filter @vue-monorepo/vue-source build
```

---

> 注意：本实现仅作学习用途，功能与性能与官方 Vue3 存在差异，请勿用于生产环境。 