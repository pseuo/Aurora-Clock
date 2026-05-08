# Aurora Clock｜极光时钟

一个基于 React 和 Vite 构建的 Apple glass 风格实时数字时钟。项目以大字号时间展示为核心，结合玻璃拟态卡片、动态边框高光、鼠标聚光交互、WebGL Aurora 极光背景、世界时钟、天气氛围和 PWA 能力，适合作为桌面时钟、全屏展示页或可安装的轻量时钟应用。

## Features

- 实时显示本地时间，按秒更新。
- 支持 12/24 小时制切换，并保存用户偏好。
- 支持中文和英文界面切换，并保存用户偏好。
- 显示日期、当前时区缩写和在线状态。
- 根据当前时间自动切换 Morning、Day、Evening、Night 四套日夜主题。
- 支持手动固定主题：Auto、Morning、Day、Evening、Night。
- Apple glass 风格玻璃卡片和高对比时间排版。
- 鼠标跟随 spotlight 高光效果。
- 动态 BorderGlow 边框光效。
- 基于 `ogl` 的 WebGL Aurora 极光背景。
- 支持背景强度：柔和、标准、鲜明。
- 支持动态/静态极光模式。
- 支持世界时钟展示和自定义城市选择。
- 内置城市：北京、东京、伦敦、纽约、洛杉矶、巴黎、悉尼、新加坡。
- 天气氛围默认关闭，用户主动开启后才请求定位。
- 天气数据来自 Open-Meteo，用于调整背景氛围，不影响核心时钟功能。
- 支持桌面模式，隐藏辅助信息以突出主时钟。
- 支持全屏模式，全屏后控制 UI 自动隐藏，鼠标移动或触摸时恢复。
- 支持快捷键：`F` 全屏、`T` 切换主题、`L` 切换语言、`H` 切换小时制、`W` 展开或收起世界时钟。
- 设置面板支持 `Esc` 关闭、点击外部关闭，并在打开时自动聚焦第一个控件。
- PWA 支持：可安装、全屏显示、基础离线缓存。
- Service Worker 发现新版本时会提示刷新更新。
- 增加 Error Boundary，视觉特效出错时不影响主时钟显示。
- 支持 `prefers-reduced-motion`，在用户开启减少动态时降低动画干扰。
- 已加入系统占用优化，降低长时间运行时的 CPU、GPU 和内存压力。

## Preview

项目启动后默认展示主时钟、设置入口、日期、时区、天气状态和可选世界时钟。视觉层级由深色背景、WebGL 极光、模糊光斑、网格、玻璃卡片和边框高光共同组成。

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

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器，并监听 `0.0.0.0` |
| `npm run build` | 生成生产构建到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run format` | 使用 Prettier 格式化项目 |

## GitHub Pages Deployment

项目已包含 GitHub Pages 自动部署配置：

- `.github/workflows/deploy.yml`：推送到 `main` 后自动安装依赖、构建并部署 `dist/`。
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

| 控件 | 说明 |
| --- | --- |
| `Auto` | 根据当前小时自动切换日夜主题 |
| `Morning`、`Day`、`Evening`、`Night` | 手动固定主题 |
| `12H/24H` | 切换小时制 |
| `Full` | 进入或退出全屏 |
| `中/EN` | 切换中文或英文界面 |
| `显示/隐藏世界时钟` | 展开或收起世界时钟卡片 |
| `开启天气氛围` | 请求定位权限，并根据本地天气调整背景 |
| `关闭天气氛围` | 停止天气定位和天气背景影响 |
| `背景强度` | 在柔和、标准、鲜明之间调整极光强度 |
| `极光动态` | 在动态和静态极光之间切换 |
| `桌面模式` | 隐藏辅助信息，适合投屏或长时间桌面显示 |
| `世界城市` | 选择需要显示的世界时钟城市 |

快捷键：

```text
F = Toggle fullscreen
T = Cycle theme
L = Toggle language
H = Toggle 12/24 hour time
W = Toggle world clocks
Esc = Close settings panel
```

偏好会集中写入 `localStorage` 的 `time-preferences` 对象，下次打开时自动恢复。

## Background Design

当前背景采用“高级极光风 + 日夜时间主题”的设计策略。

### Time Themes

| 时间段 | 主题 | 视觉方向 |
| --- | --- | --- |
| 05:00-10:59 | Morning | 暖金、青蓝、淡紫，偏清晨光感 |
| 11:00-16:59 | Day | 清透蓝、浅蓝、薄荷青，偏明亮科技感 |
| 17:00-19:59 | Evening | 橙色、紫色、青色，偏傍晚霓光感 |
| 20:00-04:59 | Night | 青色、浅蓝、紫色，偏深夜极光感 |

### Layer Structure

- `stage`：深色渐变底色和主题 CSS 变量。
- `aurora-field`：WebGL Aurora 主极光层。
- `decor-one`、`decor-two`、`decor-three`：辅助模糊光斑。
- `decor-grid`：低透明度科技网格。
- `stage::before`：轻量颗粒纹理。
- `stage::after`：暗角和纵向光感遮罩。
- `clock-glow::before`：时钟卡片背后的中心 halo，用于增强悬浮感。
- `weather-*`：天气氛围变量，用于叠加晴天、雨天、雾天、雪天等环境色。

## Weather Atmosphere

天气不会在页面加载时自动请求定位。用户点击 `开启天气氛围` 后，应用才会使用浏览器定位，并通过 Open-Meteo 免费接口读取当前温度和天气代码。

天气只影响背景氛围，不影响核心时钟功能：

- 晴天：偏清亮蓝色。
- 多云：偏低饱和灰蓝。
- 雨天：偏冷蓝。
- 雾天：提高柔雾感。
- 雪天：偏冰蓝。

如果用户拒绝定位、浏览器不支持定位或接口失败，页面会显示降级状态，并继续使用默认背景。如果设备离线，天气区域会显示离线模式，核心时钟和 PWA 离线缓存不受影响。

## Performance

项目包含针对长期运行场景的占用优化：

- 缓存 `Intl.DateTimeFormat`，避免每秒重复创建时间格式化器。
- WebGL Aurora 限制到约 `30FPS`，降低持续 GPU 占用。
- 页面不可见时跳过 Aurora 渲染，减少后台资源消耗。
- Aurora 关闭抗锯齿并限制 DPR，降低高分屏设备的像素填充压力。
- Aurora 颜色转换结果会缓存，避免每帧重复创建颜色对象。
- 鼠标 spotlight 和 BorderGlow 样式更新合并到 `requestAnimationFrame`，减少高频 DOM 写入。
- 全屏自动隐藏 UI 避免鼠标移动时重复触发无效 React 状态更新。
- 视觉特效通过 Error Boundary 降级，特效失败不影响主时钟可用性。

如果需要进一步降低占用，可以在设置面板中将 `极光动态` 切换为静态，或将 `背景强度` 调整为柔和。

## PWA

项目包含基础 PWA 文件：

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/icon.svg`

在支持的浏览器中，可以将页面安装为桌面应用。PWA 使用 `fullscreen` display mode，适合当作桌面时钟使用。Service Worker 会缓存应用壳，提供基础离线能力，并在发现新版本时提示刷新更新。

## Project Structure

```text
src/
  main.jsx                    React 入口和 service worker 注册
  Clock.jsx                   时钟主组件、时间计算和页面组合
  SettingsPanel.jsx           设置面板组件
  WeatherStatus.jsx           天气状态组件
  WorldClocks.jsx             世界时钟组件
  ErrorBoundary.jsx           视觉特效错误边界
  clockConfig.js              主题、语言、天气、城市和 Aurora 配置
  styles.css                  全局布局、背景、玻璃卡片和响应式样式
  styles-polish.css           视觉细节增强
  styles-control-center.css   设置面板样式
  styles-atmosphere.css       天气氛围样式
  styles-feedback.css         Toast 和更新提示样式
  styles-responsive-extra.css 移动端和窄屏补充样式
  BorderGlow.jsx              动态边框高光组件
  BorderGlow.css              边框高光样式
  SpotlightCard.jsx           鼠标聚光卡片组件
  SpotlightCard.css           聚光卡片样式
  reactbits/
    Aurora.jsx                基于 ogl 的 WebGL Aurora 组件
    Aurora.css                Aurora 容器样式
  hooks/
    usePreferences.js         集中偏好存储
    useWeather.js             天气定位和 Open-Meteo 请求
    useFullscreenAutoHide.js  全屏自动隐藏 UI
public/
  icon.svg                    PWA 图标
  manifest.webmanifest        PWA manifest
  sw.js                       基础离线缓存 service worker
.github/
  workflows/
    deploy.yml                GitHub Pages 自动部署工作流
vite.config.js                 Vite 配置，包含 GitHub Pages 相对路径 base
dist/                         生产构建输出
```

## Key Files

- `src/Clock.jsx`：负责时钟页面组合、时间计算、主题判断和主要交互。
- `src/clockConfig.js`：负责主题配置、语言文案、世界城市、天气映射和快捷函数。
- `src/SettingsPanel.jsx`：负责设置面板、快捷键提示、背景强度、天气入口和城市选择。
- `src/WeatherStatus.jsx`：负责天气状态展示和图标变化。
- `src/hooks/usePreferences.js`：负责 `time-preferences` 集中偏好存储。
- `src/hooks/useWeather.js`：负责用户主动开启后的定位和天气请求。
- `src/hooks/useFullscreenAutoHide.js`：负责全屏模式 UI 自动隐藏。
- `src/reactbits/Aurora.jsx`：负责 WebGL shader 极光背景。
- `src/BorderGlow.jsx`：负责时钟卡片边框光效。
- `src/SpotlightCard.jsx`：负责鼠标聚光交互。
- `public/manifest.webmanifest`：定义 PWA 安装信息。
- `public/sw.js`：缓存应用壳，提供基础离线能力。
- `vite.config.js`：配置 Vite React 插件和相对路径构建。
- `.github/workflows/deploy.yml`：配置 GitHub Pages 自动部署流程。

## Tech Stack

- React
- Vite
- OGL
- Lucide React
- CSS custom properties
- Service Worker

## Customization

修改日夜主题和极光配色：

- React 配置：调整 `src/clockConfig.js` 中的 `glowColors`、`auroraBaseConfig` 和 `intensityConfig`。
- CSS 变量：调整 `src/styles.css` 中的 `.theme-morning`、`.theme-day`、`.theme-evening`、`.theme-night`。

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

- 背景不是静态图片，而是由 WebGL、CSS 渐变、光斑、网格和纹理共同组成。
- 主体卡片保持高对比，避免动态背景干扰时间读取。
- 极光动画速度被刻意压低，目标是“可感知但不抢戏”。
- 日夜主题通过 CSS 变量和 React 配色配置协同完成，便于后续扩展。
- 天气、PWA 和视觉特效都以渐进增强为原则，失败时不影响主时钟功能。

## Build Status

当前验证命令已通过：

```bash
npm.cmd run lint
npm.cmd run build
```

## License

This project is open source under the MIT License.

You may use, copy, modify, distribute, sublicense, and sell copies of this software, provided that the copyright notice and license notice are included in all copies or substantial portions of the software.

Copyright (c) 2026 Aurora Clock contributors. See `LICENSE` for details.
