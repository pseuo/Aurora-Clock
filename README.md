# Aurora Clock｜极光时钟

基于 React 和 Vite 打造的实时数字时钟与桌面时间工具。

项目以大字号时间展示为核心，融合玻璃拟态界面、动态边框高光与鼠标聚光交互，并配备 CSS 驱动的 Aurora 极光背景、世界时钟、天气氛围和 PWA 支持。既适合全屏展示和日常桌面使用，也可安装为轻量级独立时钟应用。

## Features

- 实时显示本地时间，按秒更新。
- 支持 12/24 小时制切换，并保存用户偏好。
- 支持中文和英文界面切换，并保存用户偏好。
- 支持完整、简洁、仅星期和隐藏四种日期显示格式。
- 显示日期、当前时区缩写、天气状态和在线状态。
- 根据当前时间自动切换 Morning、Day、Evening、Night 四套日夜主题。
- 支持手动固定主题：Auto、Morning、Day、Evening、Night。
- Apple glass 风格玻璃卡片和高对比时间排版。
- 鼠标跟随 spotlight 高光效果。
- 动态 BorderGlow 边框光效。
- 基于 CSS 多层渐变和动画的 Aurora 极光背景。
- 支持背景强度：柔和、标准、鲜明。
- 支持动态/静态极光模式。
- 支持世界时钟展示、自定义城市选择、城市搜索、常用预设、数量限制和拖拽排序。
- 内置 24 个世界城市，覆盖亚洲、欧洲、美洲、大洋洲和非洲等时区。
- 内置跨时区会议规划器，可比较两个城市的当地时间和 09:00-18:00 工作时间重叠。
- 天气氛围默认关闭，用户主动开启后才请求定位。
- 天气数据来自 Open-Meteo，用于调整背景氛围，不影响核心时钟功能。
- 定位失败时支持通过城市名称手动设置天气位置。
- 支持桌面模式，隐藏辅助信息以突出主时钟。
- 支持标准、纯黑夜间和极简大字三种展示模式，并提供自动位移防烧屏和多屏/横屏布局选项。
- 纯黑夜间模式移除极光、网格、光斑、边框光效和玻璃效果，提供真正的黑色展示底面。
- 支持全屏模式，全屏后控制 UI 自动隐藏，鼠标移动或触摸时恢复。
- 支持倒计时、番茄钟和页面内闹钟；倒计时状态在切换或关闭设置时保持。
- 页面内闹钟配置会保存到偏好设置；它不是系统闹钟，页面关闭、浏览器被冻结或设备休眠时不能保证提醒。可主动启用浏览器通知作为页面仍在运行时的补充提醒。
- 支持导入 ICS 日历文件并显示下一个日历事件。
- 支持偏好设置 JSON 导出、导入、迁移码复制和恢复默认。
- 支持快捷键：`F` 全屏、`T` 切换主题、`L` 切换语言、`H` 切换小时制、`W` 展开或收起世界时钟、`?` 打开帮助。
- 设置面板支持 `Esc` 关闭、点击外部关闭，并在打开时自动聚焦第一个控件。
- PWA 支持：安装入口会根据浏览器支持情况显示可用状态，安装后状态会自动同步。
- PWA 支持全屏显示和基础离线缓存。
- Service Worker 发现新版本时会提示刷新更新。
- 增加 Error Boundary，视觉特效出错时不影响主时钟显示。
- 支持 `prefers-reduced-motion`，在用户开启减少动态时降低动画干扰。
- 会根据屏幕尺寸、减少动态、节省流量、设备内存和 CPU 线索显示性能提示，帮助选择更省资源的静态极光模式。
- 已加入系统占用优化，降低长时间运行时的 CPU、GPU 和内存压力。

## Preview

项目启动后默认展示主时钟、设置入口、日期、时区、天气状态和可选世界时钟。视觉层级由深色背景、CSS 极光、模糊光斑、网格、玻璃卡片和边框高光共同组成。设置面板按外观、时间、世界时钟、天气、桌面工具和应用六个分区组织。

## Requirements

- Node.js `>= 22.13.0`
- npm `>= 10.9.0`
- Chromium（仅运行端到端测试时需要；CI 会自动安装）

## Getting Started

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

运行测试：

```bash
npm test
```

运行覆盖率和端到端测试：

```bash
npm run test:coverage
npm run test:e2e
```

本地预览生产构建：

```bash
npm run preview
```

代码检查：

```bash
npm run lint
```

格式化：

```bash
npm run format
```

在 Windows PowerShell 中，如果 `npm run build`、`npm run lint` 被执行策略拦截，可以改用：

```bash
npm.cmd run build
npm.cmd run lint
```

## Scripts

| 命令                    | 说明                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run dev`           | 启动 Vite 开发服务器，并监听 `0.0.0.0`                               |
| `npm run build`         | 生成生产构建到 `dist/`，并为 Service Worker 写入预缓存资源和构建版本 |
| `npm run preview`       | 本地预览生产构建                                                     |
| `npm run lint`          | 运行 ESLint 检查                                                     |
| `npm test`              | 使用 Vitest 运行单元测试和组件测试                                   |
| `npm run test:coverage` | 运行 Vitest 并检查覆盖率门槛                                         |
| `npm run test:e2e`      | 构建后使用 Playwright 验证关键浏览器流程                             |
| `npm run format`        | 使用 Prettier 格式化项目                                             |
| `npm run format:check`  | 检查 Prettier 格式，不修改文件                                       |

## Quality Gates

- `.github/workflows/ci.yml` 会在每个 Pull Request 及 GitHub Pages 发布前运行格式检查、ESLint、覆盖率、生产构建与 Playwright 端到端测试；任一检查失败都会阻止发布。
- 覆盖率门槛由 `vitest.config.js` 管理；变更应同时补充行为测试，不能通过降低门槛绕过回归。
- Playwright 覆盖展示模式与设置持久化、全屏、离线应用壳、更新提示，以及偏好导入导出。
- 无障碍变更必须在合并前验证键盘可达性、可见焦点、语义化名称/角色、焦点陷阱和焦点恢复；新交互应补充对应自动化测试，并以浏览器或屏幕阅读器做人工复核。

## Privacy And Boundaries

- 偏好、倒计时与页面内闹钟配置仅保存在本机浏览器的 `localStorage`；导出的 JSON 和迁移码由用户自行保存，不会上传到本项目服务端。
- 天气默认关闭。仅在用户主动启用天气或搜索手动城市时，浏览器位置或城市查询会发送给 Open-Meteo；项目不内置分析、广告或账户服务。
- 页面内闹钟不是操作系统闹钟。页面关闭、浏览器后台冻结、设备休眠或通知权限被拒绝时，不能保证声音或通知送达。
- 离线能力只缓存已成功加载的应用壳和静态资源，首次访问和新版本更新仍需联网。天气查询、安装提示和任何未缓存资源离线时会降级，不会提供离线同步或后台数据刷新。
- ICS 导入仅在当前会话保留下一个事件；重复事件、例外规则和持久化不支持，单个文件最大 1 MiB。导入内容与偏好 JSON 都会在写入状态前验证。

## GitHub Pages Deployment

项目已包含 GitHub Pages 自动部署配置：

- `.github/workflows/deploy.yml`：推送到 `main` 后先运行完整质量门禁，再构建并部署 `dist/`。
- `vite.config.js`：使用 `base: './'`，支持部署到 `https://用户名.github.io/仓库名/` 这类子路径。
- PWA 相关路径已使用相对路径，`manifest.webmanifest`、`icon.svg` 和 `sw.js` 在 GitHub Pages 下可正常加载。

首次发布步骤：

```bash
git init
git add .
git commit -m "Deploy Aurora Clock to GitHub Pages"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

然后在 GitHub 仓库中开启 Pages：

1. 打开仓库 `Settings`。
2. 进入 `Pages`。
3. 在 `Build and deployment` 中将 `Source` 设置为 `GitHub Actions`。
4. 打开 `Actions` 页面，等待 `Deploy to GitHub Pages` 工作流完成。
5. 访问 Pages 地址：`https://你的用户名.github.io/你的仓库名/`。

后续更新只需要提交并推送到 `main`：

```bash
git add .
git commit -m "Update Aurora Clock"
git push
```

如果使用个人主页仓库，仓库名应为 `你的用户名.github.io`，访问地址为 `https://你的用户名.github.io/`。

## Controls

界面默认只显示一个轻量设置按钮，点击后展开控制面板。

| 控件                                 | 说明                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- |
| `Auto`                               | 根据当前小时自动切换日夜主题                                         |
| `Morning`、`Day`、`Evening`、`Night` | 手动固定主题                                                         |
| `12H/24H`                            | 切换小时制                                                           |
| `Full`                               | 进入或退出全屏                                                       |
| `中/EN`                              | 切换中文或英文界面                                                   |
| `显示/隐藏世界时钟`                  | 展开或收起世界时钟卡片                                               |
| `开启天气氛围`                       | 请求定位权限，并根据本地天气调整背景                                 |
| `关闭天气氛围`                       | 停止天气定位和天气背景影响                                           |
| `背景强度`                           | 在柔和、标准、鲜明之间调整极光强度                                   |
| `极光动态`                           | 在动态和静态极光之间切换                                             |
| `桌面模式`                           | 隐藏辅助信息，适合投屏或长时间桌面显示                               |
| `日期格式`                           | 选择完整、简洁、仅星期或隐藏日期                                     |
| `世界城市`                           | 搜索、选择、排序世界时钟城市，并设置显示数量                         |
| `跨时区会议`                         | 打开会议规划器，比较两个城市的时间和工作时间重叠                     |
| `桌面工具`                           | 使用倒计时、番茄钟和页面内闹钟；工具状态在设置分区间及关闭设置后保持 |
| `导入 ICS`                           | 导入日历文件并在主卡片显示下一个事件                                 |
| `偏好迁移`                           | 导出或导入 JSON，复制迁移码，或恢复默认设置                          |
| `安装应用`                           | 在浏览器支持安装时打开 PWA 安装提示                                  |

快捷键：

```text
F = Toggle fullscreen
T = Cycle theme
L = Toggle language
H = Toggle 12/24 hour time
W = Toggle world clocks
? = Open shortcut help
Esc = Close settings panel
```

偏好会集中写入 `localStorage` 的 `time-preferences` 对象，下次打开时自动恢复。

## Background Design

当前背景采用“高级极光风 + 日夜时间主题”的设计策略。

### Time Themes

| 时间段      | 主题    | 视觉方向                           |
| ----------- | ------- | ---------------------------------- |
| 05:00-10:59 | Morning | 暖金、青蓝、淡紫，偏清晨光感       |
| 11:00-16:59 | Day     | 清透蓝、浅蓝、薄荷青，偏明亮科技感 |
| 17:00-19:59 | Evening | 橙色、紫色、青色，偏傍晚霓光感     |
| 20:00-04:59 | Night   | 青色、浅蓝、紫色，偏深夜极光感     |

### Layer Structure

- `stage`：深色渐变底色和主题 CSS 变量。
- `aurora-field`：CSS Aurora 主极光层。
- `decor-one`、`decor-two`、`decor-three`：辅助模糊光斑。
- `decor-grid`：低透明度科技网格。
- `stage::before`：轻量颗粒纹理。
- `stage::after`：暗角和纵向光感遮罩。
- `clock-glow::before`：时钟卡片背后的中心 halo，用于增强悬浮感。
- `weather-*`：天气氛围变量，用于叠加晴天、雨天、雾天、雪天等环境色。

## Weather Atmosphere

天气不会在页面加载时自动请求定位。用户点击 `开启天气氛围` 后，应用才会使用浏览器定位，并通过 Open-Meteo 免费接口读取当前温度、体感温度、降水和天气代码。

天气只影响背景氛围，不影响核心时钟功能：

- 晴天：偏清亮蓝色。
- 多云：偏低饱和灰蓝。
- 雨天：偏冷蓝。
- 雾天：提高柔雾感。
- 雪天：偏冰蓝。

如果用户拒绝定位、浏览器不支持定位或接口失败，页面会显示降级状态，并提供城市名称搜索作为手动位置入口。应用会保存手动选择的位置。如果设备离线，天气区域会显示离线模式，核心时钟和 PWA 离线缓存不受影响。

## Performance

项目包含针对长期运行场景的占用优化：

- 缓存 `Intl.DateTimeFormat`，避免每秒重复创建时间格式化器。
- CSS Aurora 使用低频动画和多层渐变，降低持续 GPU 占用。
- 鼠标 spotlight 和 BorderGlow 样式更新合并到 `requestAnimationFrame`，减少高频 DOM 写入。
- 全屏自动隐藏 UI 避免鼠标移动时重复触发无效 React 状态更新。
- 视觉特效通过 Error Boundary 降级，特效失败不影响主时钟可用性。
- 小屏幕、减少动态、节省流量或低性能设备会显示性能提示；可手动将极光切换为静态以进一步降低资源占用。

如果需要进一步降低占用，可以在设置面板中将 `极光动态` 切换为静态，或将 `背景强度` 调整为柔和。

## PWA

项目包含基础 PWA 文件：

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/icon.svg`

在支持的浏览器中，可以将页面安装为桌面应用。PWA 使用 `fullscreen` display mode，适合当作桌面时钟使用。每次 `npm run build` 会根据当前构建产物生成预缓存列表。Service Worker 会缓存应用壳，提供基础离线能力，并在发现新版本时提示刷新更新。

## Project Structure

```text
src/
  main.jsx                    React 入口和 service worker 注册
  Clock.jsx                   时钟主组件、页面组合和主要交互
  clockTime.js                时间、日期和世界时钟格式化，并缓存 Intl formatter
  SettingsPanel.jsx           设置面板组件
  DeskTools.jsx               倒计时、番茄钟和本地闹钟
  MeetingPlanner.jsx          跨时区会议规划器
  EventInfoBar.jsx            ICS 日历事件展示
  calendarIcs.js              ICS 文件解析
  WeatherStatus.jsx           天气状态组件
  WorldClocks.jsx             世界时钟组件
  ErrorBoundary.jsx           视觉特效错误边界
  clockConfig.js              主题、语言、天气、城市和 Aurora 配置
  tailwind.css                Tailwind 主题、字体、动画和全局基础样式
  BorderGlow.jsx              动态边框高光组件
  SpotlightCard.jsx           鼠标聚光卡片组件
  reactbits/
    Aurora.jsx                基于 CSS 的 Aurora 背景组件
  hooks/
    useAppLifecycle.js        在线状态、PWA 安装提示和应用更新状态
    usePreferences.js         集中偏好存储
    useWeather.js             天气定位和 Open-Meteo 请求
    useFullscreenAutoHide.js  全屏自动隐藏 UI
  burnInShift.js              自动位移防烧屏计算
  meetingOverlap.js           跨时区工作时间重叠计算
public/
  icon.svg                    PWA 图标
  manifest.webmanifest        PWA manifest
  sw.js                       基础离线缓存 service worker
scripts/
  prepare-sw.mjs              根据构建产物生成 Service Worker 预缓存列表
test/
  setup.js                    Vitest 和 Testing Library 测试初始化
.github/
  workflows/
    deploy.yml                GitHub Pages 自动部署工作流
vite.config.js                 Vite 配置，包含 GitHub Pages 相对路径 base
dist/                         生产构建输出
```

## Key Files

- `src/Clock.jsx`：负责时钟页面组合、主题判断、快捷键、日历导入和主要交互。
- `src/clockTime.js`：负责本地时间、日期和世界时钟的格式化，并复用 `Intl.DateTimeFormat` 实例。
- `src/clockConfig.js`：负责主题配置、语言文案、世界城市、天气映射和快捷函数。
- `src/SettingsPanel.jsx`：负责设置面板、视觉、时间、城市、天气、工具、PWA 和偏好迁移设置。
- `src/DeskTools.jsx`：负责倒计时、番茄钟和当前页面内的本地闹钟。
- `src/MeetingPlanner.jsx`：负责两个城市的时间和工作时间重叠计算。
- `src/EventInfoBar.jsx`：负责显示导入的下一个 ICS 事件。
- `src/calendarIcs.js`：负责解析带时区、UTC 和全天事件的 ICS 内容。
- `src/WeatherStatus.jsx`：负责天气状态展示和图标变化。
- `src/hooks/usePreferences.js`：负责 `time-preferences` 集中偏好存储。
- `src/hooks/useAppLifecycle.js`：负责在线状态、PWA 安装提示、安装状态和应用更新事件。
- `src/hooks/useWeather.js`：负责用户主动开启后的定位和天气请求。
- `src/hooks/useFullscreenAutoHide.js`：负责全屏模式 UI 自动隐藏。
- `src/reactbits/Aurora.jsx`：负责 CSS Aurora 背景层。
- `src/BorderGlow.jsx`：负责时钟卡片边框光效。
- `src/SpotlightCard.jsx`：负责鼠标聚光交互。
- `public/manifest.webmanifest`：定义 PWA 安装信息。
- `public/sw.js`：缓存应用壳，提供基础离线能力。
- `vite.config.js`：配置 Vite React 插件和相对路径构建。
- `.github/workflows/deploy.yml`：配置 GitHub Pages 自动部署流程。

## Tech Stack

- React
- Vite
- Lucide React
- CSS custom properties and animations
- Vitest
- Service Worker

## Customization

修改日夜主题和极光配色：

- React 配置：调整 `src/clockConfig.js` 中的 `themeVisuals` 和 `intensityConfig`。
- 全局样式与动画：调整 `src/tailwind.css` 中的 `@theme`、`@keyframes` 和基础样式。

修改世界城市：

- 调整 `src/clockConfig.js` 中的 `worldClocks`。
- 默认选中城市由 `src/hooks/usePreferences.js` 中的 `selectedWorldCities` 控制。

修改天气映射：

- 调整 `src/clockConfig.js` 中的 `weatherCodeMap`。

修改 Aurora 强度：

- `amplitude`：控制极光高度和起伏强度。
- `blend`：控制极光混合范围。
- `speed`：控制极光运动速度。

示例：

```jsx
<Aurora
  colorStops={["#67ffe4", "#b7dbff", "#8b5cf6"]}
  blend={0.78}
  amplitude={1.45}
  speed={0.5}
/>
```

## Design Notes

- 背景不是静态图片，而是由 CSS Aurora 渐变、光斑、网格和纹理共同组成。
- 主体卡片保持高对比，避免动态背景干扰时间读取。
- 极光动画速度被刻意压低，目标是“可感知但不抢戏”。
- 日夜主题通过 CSS 变量和 React 配色配置协同完成，便于后续扩展。
- 天气、PWA 和视觉特效都以渐进增强为原则，失败时不影响主时钟功能。

## Build Status

当前验证命令已通过：

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:coverage
npm.cmd run build
npx.cmd playwright test
```

## License

This project is open source under the MIT License.

You may use, copy, modify, distribute, sublicense, and sell copies of this software, provided that the copyright notice and license notice are included in all copies or substantial portions of the software.

Copyright (c) 2026 Aurora Clock contributors. See `LICENSE` for details.
