# 渲染优化示例

本子项目演示如何通过 Vue `<KeepAlive>` 组件与组件级缓存技术，避免重复渲染带来的性能损耗。

## 关键点

1. **组件缓存**：使用 `<KeepAlive>` 对动态组件进行包裹，使得已经渲染过的组件实例被缓存，下次切换回来时直接复用，避免重新执行 `setup`、`onMounted` 等生命周期。
2. **开关控制**：通过开关（`ElSwitch`）动态启用 / 停用缓存，以直观对比性能差异。
3. **大型渲染任务**：构造大表格与 Canvas 绘图，模拟渲染开销，便于观察缓存效果。

操作步骤：
打开浏览器控制台。
在「用户列表」和「图表视图」间反复切换，观察 mounted / unmounted 日志和 Heavy Chart 的耗时输出。
「缓存开启」时：Heavy Chart 只 mounted 一次，后续切换瞬时完成；
「缓存关闭」时：每次切回 Heavy Chart 都会重新 mounted，可见明显卡顿并打印新的耗时日志。

## 运行

```bash
pnpm install
pnpm dev
```

浏览器打开 http://localhost:5173 观察不同场景下的渲染性能差距。

## 目录结构

```
render-optimization/
 ├── index.html          # 入口 HTML
 ├── tsconfig.json       # TypeScript 配置
 ├── vite.config.ts      # Vite 构建配置
 └── src/
     ├── App.vue         # 主组件
     ├── main.ts         # 应用入口
     ├── env.d.ts        # 类型声明
     └── components/
         ├── UserList.vue    # 大列表示例
         └── HeavyChart.vue  # Canvas 绘图示例
``` 

执行 pnpm --filter @vue-monorepo/render-optimization dev 即可单独启动并查看效果