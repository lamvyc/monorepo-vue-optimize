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

## Git 配置与规范

### 配置说明
项目包含以下 Git 相关配置：

1. **完整的 .gitignore 配置**
   - 忽略依赖目录 (node_modules)
   - 忽略构建输出 (dist)
   - 忽略日志文件
   - 忽略编辑器配置
   - 忽略环境变量文件

2. **Commitlint 配置**
   - 强制规范提交信息格式
   - 集成在 Git hooks 中自动运行

3. **Husky Git Hooks**
   - commit-msg: 验证提交信息
   - pre-commit: 运行 lint-staged

4. **Lint-staged 配置**
   - 提交前自动格式化代码
   - 对不同文件类型使用对应的格式化工具：
     ```js
     // .lintstagedrc.js
     {
       '*.{js,jsx,ts,tsx,vue}': ['eslint --fix', 'prettier --write'],
       '*.{css,scss,less,styl,html}': ['prettier --write'],
       '*.{json,md}': ['prettier --write']
     }
     ```

5. **Commitizen 工具**
   - 提供交互式提交信息生成

### 提交代码
有两种方式可以提交代码：

1. **使用交互式提交工具**
   ```bash
   pnpm commit
   ```
   按照提示填写提交信息。

2. **直接使用 git commit**
   ```bash
   git commit -m "type: message"
   ```
   需要遵循提交规范。

### 提交类型
提交信息必须以下列类型之一开头：

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档变更 |
| style | 代码格式（不影响代码运行的变动） |
| refactor | 重构（既不是新增功能，也不是修改 bug 的代码变动） |
| perf | 性能优化 |
| test | 增加测试 |
| build | 构建系统或外部依赖变更 |
| ci | CI 配置变更 |
| chore | 其他修改（不修改 src 或测试文件） |
| revert | 回滚到上一个版本 |

### 提交信息格式
```
type: subject

body

footer
```

示例：
```bash
feat: 添加用户登录功能

- 实现用户名密码登录
- 添加登录表单验证
- 集成 JWT 认证

Closes #123 