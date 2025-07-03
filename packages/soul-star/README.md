# Soul Star

> 一个基于 Vue 3 + Vite 的实验性子应用，用来快速验证或展示新奇想法（UI 动效、组件交互、性能测试等）。如同夜空中的"灵魂之星"，每一次闪耀都记录一次灵感。

## 项目目标

1. **小而美**：保持代码简洁可读，便于团队或个人随时接手。  
2. **灵活可拓展**：可按需添加路由、模块或微组件，专注实验功能本身。  
3. **可视化/动效**：鼓励使用 Canvas / WebGL / SVG / CSS 动效等技术手段，探索交互与性能边界。

## 快速开始

```bash
# 安装依赖（在 monorepo 根目录）
pnpm install

# 启动开发服务器
pnpm --filter @vue-monorepo/soul-star dev

# 构建生产包
pnpm --filter @vue-monorepo/soul-star build

# 运行单元测试
pnpm --filter @vue-monorepo/soul-star test
```

打开浏览器访问 `http://localhost:5173`（端口以 Vite 输出为准），即可查看效果。

## 目录结构

```
packages/soul-star/
├── index.html          # Vite 入口 HTML
├── vite.config.ts      # 构建配置
├── tsconfig.json       # TS 配置，继承 monorepo 公共配置
├── package.json        # 子项目依赖与脚本
├── README.md           # 项目说明（当前文件）
└── src/
    ├── App.vue         # 根组件
    ├── main.ts         # 入口文件
    ├── env.d.ts        # 类型声明
    └── components/     # (可选) 组件目录
        └── ...
```

## 技术栈

- **核心框架**: Vue 3 + `<script setup>`  
- **构建工具**: Vite  
- **组件库**: Element Plus（按需）  
- **语言 & 工具**: TypeScript、Vitest

## 规划中的功能示例

| 功能 | 说明 |
| --- | --- |
| 星轨动画 | 使用 Canvas 渲染星空及流星轨迹，演示 requestAnimationFrame 与性能优化 |
| 自定义指令 `v-observe-visibility` | 基于 IntersectionObserver 的可见性检测，配合动画触发 |
| ECharts 图表实验 | 集成 ECharts，探索大数据量渲染及懒加载 |
| 性能分析实验 | 引入 web-vitals 或 Performance API，记录页面关键指标 |

> 以上为初步设想，灵感不断演进，可自由调整、增删。

## 贡献指南

1. **分支命名**：`feature/xxx`、`fix/xxx`、`docs/xxx` 等。  
2. **提交规范**：遵循仓库根目录的 Commitlint 规则（`pnpm commit`）。  
3. **代码规范**：执行 `pnpm lint` 检查；必要时 `pnpm lint:fix` 自动修复。  
4. **PR 描述**：简明扼要，若涉及 UI / 性能，对比截图或性能报告 + 说明。

## 完整初始化脚本（参考）

若需在其他仓库快速生成同名子项目，可直接复制下方脚本一次性执行：

```bash
# 保证当前在 monorepo 根目录
mkdir -p packages/soul-star && cd packages/soul-star

# 1) 写入 package.json
cat > package.json <<'EOF'
{
  "name": "@vue-monorepo/soul-star",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
EOF

# 2) 安装依赖（子包作用域）
pnpm add vue element-plus @element-plus/icons-vue
pnpm add -D vite @vitejs/plugin-vue typescript vue-tsc vitest

# 3) TS & Vite 等配置
cat > tsconfig.json <<'EOF'
{
  "extends": "../../core/ts-config/tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "jsx": "preserve",
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
EOF

cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  build: { outDir: 'dist', sourcemap: false }
});
EOF

# 4) 基础源码文件
mkdir -p src
cat > src/env.d.ts <<'EOF'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const c: DefineComponent<{}, {}, any>;
  export default c;
}
EOF

cat > src/main.ts <<'EOF'
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
createApp(App).use(ElementPlus).mount('#app');
EOF

cat > src/App.vue <<'EOF'
<template>
  <div>Hello Soul Star!</div>
</template>
<script setup lang="ts"></script>
EOF

cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
  <head><meta charset="UTF-8" /><title>Soul Star</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.ts"></script></body>
</html>
EOF

# 5) 回到根目录并安装工作区依赖
dcd ../../ && pnpm install

# 6) 运行
pnpm --filter @vue-monorepo/soul-star dev
```

以上脚本做了：创建目录 ➜ 生成 `package.json` ➜ 安装依赖 ➜ 写入 TS/Vite 配置 ➜ 初始化源码 ➜ 回根目录链接依赖 ➜ 启动。复制粘贴即可完成项目骨架。

Enjoy hacking ⭐️