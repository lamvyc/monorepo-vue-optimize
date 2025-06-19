# Vue3 Monorepo Optimizations

## 项目概述
构建一个基于 Vue3 的 Monorepo 项目，包含多个独立子项目，每个子项目演示一种前端优化技术。通过模块化组织，实现代码复用、独立开发和统一构建。

## 核心目标
- 提供可复用的 Vue3 优化实践案例
- 支持独立开发/测试单个优化模块
- 实现跨项目共享工具链（ESLint、构建配置等）
- 展示 Monorepo 在复杂项目中的管理优势

## 技术栈
- **Monorepo 管理**: PNPM Workspaces
- **框架**: Vue3 (Composition API + `<script setup>`)
- **构建工具**: Vite + Rollup
- **UI 框架**: Element Plus（按需加载）
- **状态管理**: Pinia
- **代码规范**: ESLint + Prettier + Husky
- **测试**: Vitest + Vue Test Utils
- **CI/CD**: GitHub Actions

## 项目结构
```
vue3-monorepo-optimizations/
├── packages/
│   ├── core/                   # 共享资源
│   │   ├── eslint-config/      # 统一ESLint配置
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   ├── ts-config/          # 公共TS配置
│   │   │   └── tsconfig.base.json
│   │   └── utils/              # 通用工具函数
│   │       ├── src/
│   │       │   └── index.ts
│   │       ├── tsconfig.json
│   │       └── package.json
│   └── optimization-perf-memo/  # 子项目1: 性能优化
│       ├── src/
│       │   ├── App.vue
│       │   └── main.ts
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── package.json
├── apps/
│   └── main-app/                # 主应用（集成所有优化案例）
│       ├── src/
│       │   ├── App.vue
│       │   └── main.ts
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD配置
├── .editorconfig
├── .eslintrc.js
├── .prettierrc.json
├── .gitignore
├── package.json                 # 根工作区配置
└── pnpm-workspace.yaml
```

## 优化案例子项目（示例）
- **性能优化**: 减少渲染开销 - `v-memo` 指令 + 虚拟滚动
- **懒加载**: 按需加载资源 - 动态导入 + Suspense + 路由懒加载
- **状态管理**: 高效状态更新 - Pinia + 状态分区 + Getters缓存
- **资源压缩**: 减小打包体积 - Vite插件(imagemin/compression)
- **渲染优化**: 避免重复渲染 - `<KeepAlive>` + 组件级缓存
- **网络优化**: 减少HTTP请求 - 资源预加载 + HTTP/2 Push

## 开发规范
### 组件规范：
- 所有组件使用 `<script setup>` 语法
- 组件命名前缀：[优化类型]-[功能名]（例：perf-memo-list）

### 代码质量：
```jsonc
// core/eslint-config/base.js
rules: {
  "vue/no-unused-components": "error",
  "vue/prefer-import-from-vue": "error",
  "vue/multi-word-component-names": "off"
}
``` 