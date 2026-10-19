# Northstar Public Website

Northstar / NS 的对外介绍页，纯静态 HTML、CSS 和 JavaScript，无构建步骤。

## 本地预览

直接在浏览器打开 `index.html`。所有资源都使用相对路径，支持本地文件和 GitHub Pages 项目路径。

## GitHub Pages

在 `godcin/ns` 的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
将本分支合入 `main` 后，`pages.yml` 整理并发布对外页面；也可从 Actions 手动运行该工作流。
网址为 `https://godcin.com/`。工作流不发布内部介绍目录或产品源码。

## 产品介绍

公开介绍位于 `https://godcin.com/product/`，首页导航、能力卡片及页尾提供入口。`product/` 采用总分总的十二篇结构：

1. 产品概述与核心价值
2. 卡片交互、流程治理、知识与版本一致性
3. 外部 Agent 委派、执行恢复、恢复点与回滚
4. 架构扩展、结果核验与诊断
5. 线上问题定位与可靠性（规划），以及总结与分期展望

既有文件地址保留，阅读序号与上下页导航按上述顺序统一。作者信息仅在首页显示。

这些页面共用 `product/intro.css` 与 `product/intro.js`，提供桌面侧栏、手机可展开目录及上下页导航；关闭 JavaScript 时目录仍可直接使用。每篇提供 canonical、Open Graph 和 Twitter Card 元信息，复用现有公开分享封面。技术文案按知识库与现有代码实现核对，区分当前机制、实验性阶段和规划方向。图片复用现有公开录像封面，不上传原始视频或私有源码。

首页将真实视频、示例工作台、研发流程、工程能力和未来方向依次展开。QA、发布检查与复盘等环节保留实验性标记；LlamaIndex RAG、知识图谱、多人协作、多产品代码与知识管理以及线上故障协同明确列为规划。

## PM 产品交互流程演示视频

首页的 PM 演示使用真实 Northstar Desktop 会话录像，展示 `media-harbor` 从需求调研、逐项确认、补充约束，到 PRD 生成、评审修订和 PM 签核的过程。公开版本时长 29:42，分辨率 1920 × 1080。点击真实封面、观看入口或章节时间，在 B 站观看对应视频。

- 视频：https://www.bilibili.com/video/BV1XupR6NEgL/
- 封面：`assets/video/pm-product-workflow-poster.webp`，从录像中提取真实画面。

仓库只提交页面、链接和真实封面；原始 `.mov` 和本地生成的 MP4 保留在本地，由 `.gitignore` 排除，不随网站发布。

## Dev 技术交互流程演示视频

技术演示接续 PM 签核后的需求，包含技术调研、TD 编写与评审、需求异议收口、同步 TD、再评审与技术收敛，以及实现步骤确认。

- 视频：https://www.bilibili.com/video/BV16Qp962E1v/
- 封面：`assets/video/dev-technical-workflow-poster.webp`，从真实录像的实现步骤确认界面提取。

## Dev AI 编码与验收演示视频

新版录像接续 `media-harbor` 的技术设计，展示确认生成代码、Agent 实现与自检、本地体验、截图反馈修复及交互优化，再提交 Northstar 独立验收。首次验收遇到体验服务占用端口，定位处理并重新验收后通过，最后回到主会话的“提交代码评审”入口。

- 视频：https://www.bilibili.com/video/BV1DBp26GEew/
- B 站播放器时长：51:05（接口返回 3065 秒）；本地原片 51:04.1，1920 × 1080。
- 封面：`assets/video/dev-coding-acceptance-poster.webp`，从新版真实录像 51:00 的提交代码评审卡片提取。

章节按新版原片逐项核对：

- 00:00 确认生成代码。
- 01:30 AI 编码与运行自检。
- 22:40 运行并体验本地页面。
- 24:10 截图反馈与目录修复。
- 33:50 HEIC 预览与照片浏览。
- 41:00 打磨布局与待打印交互。
- 47:00 提交编码验收。
- 48:05 定位验收失败并重试。
- 50:30 验收通过，衔接代码评审。

录像终点是编码验收通过、出现提交代码评审入口，尚未展示代码评审执行、Dev 签核或最终 QA 质量签核。页面章节使用视频相对时间，不使用录屏菜单栏的系统时间。原始 MOV 与本地 MP4 继续由 `.gitignore` 排除。

## Dev 代码评审演示视频

第四段录像接续编码验收结果，展示首轮十三项问题的评审与修复，独立验收通过后自动再评审，再处理第二轮五项问题。运行体验后，独立验收因体验服务占用端口而失败；迁移体验服务、释放验收端口并重新检查后，修复通过 NS 验收，由人确认修复结果、完成 Dev 签核并移交 QA，最后查看交付代码。

- 视频：https://www.bilibili.com/video/BV1chnJ6jEdZ/
- B 站播放器时长：33:04（2026-10-19 重新查询接口返回 1984 秒）。
- 本地原片：`代码评审.mov`，修改时间 2026-10-19 20:20:15（Asia/Shanghai）；`ffprobe` 实测 1982.966667 秒，即 33:02.967（约 33:03），1920 × 1080、30 fps。
- 封面：`assets/video/dev-code-review-signoff-poster.webp`，取自新版真实录像 29:55 的修复结果确认卡，包含待确认代码版本与五项必修问题。

首页章节按新版录像相对时间重新核对：

- 00:00 发起代码评审。
- 06:40 修复首轮评审问题。
- 15:00 验收通过，自动再评审。
- 17:05 继续修复复评问题。
- 22:00 运行并体验修复结果。
- 25:15 定位验收失败并处理。
- 29:55 验收通过，确认修复结果。
- 30:56 完成 Dev 研发签核。
- 31:10 移交 QA，查看交付代码。

首轮问题清单可从 05:30 查看；14:00 展示首轮修复与自检结果，16:20 展示第二轮问题清单。页面章节使用视频相对时间，不使用录屏菜单栏的系统时间。

新版中，首轮修复验收通过后有自动再评审；第二轮修复验收通过后，核对五项必修问题的修复结果，再完成 Dev 签核。录像推进到 QA 测试计划阶段，随后查看代码仓库，尚未展示 QA 测试执行、质量签核或发布。原始 MOV 由 `.gitignore` 排除，不上传到仓库。

首页使用同一展示区切换 PM 产品、Dev 设计、Dev 编码和 Dev 评审四段演示，支持阶段标签、左右箭头、标签键盘导航及触屏横向滑动。每段保留独立标题、真实封面、B 站观看入口和章节链接。480px 及以下屏幕将标签放在一行、箭头放在下一行，避免四个标签被挤压。

## 可选 Viewer 视频

将视频放入 `assets/`，在 `site-config.js` 中设置相对路径：

```js
window.NORTHSTAR_SITE = Object.freeze({ demoVideo: "assets/northstar-demo.mp4" });
```

也可使用 HTTPS 视频地址。配置后，Viewer 演示区使用原生视频播放器和现有封面；播放失败时显示错误并恢复角色截图。
空配置默认展示 PM / Dev / QA 的 Viewer 截图。此配置不影响独立的 PM 交互流程录像。

## 演示图片

页面内的 Viewer 截图使用隔离的示例项目数据，仅用于说明界面结构，不代表线上服务或真实用户验收记录。
已生成的图片位于 `assets/`，页面运行时不请求项目服务或用户数据。

## 链接预览

首页在静态 HTML 的 `<head>` 中提供 Open Graph 和 Twitter Card 信息，供支持链接预览的聊天与社交平台抓取，不依赖 JavaScript。分享图为公开的 `assets/northstar-share-f0084951f0eb.jpg`，1200 × 630，使用真实 Desktop 录像封面。OG、Twitter 和 `image_src` 使用相同图片；文件名包含内容哈希，原始地址 `assets/northstar-share.jpg` 保留以兼容已分享的链接。

同时提供方形 `assets/northstar-icon.png`、PNG/ICO 网站图标和 Apple Touch Icon，兼容不读取 OG 图片或不支持 SVG 图标的客户端。以上资源均由现有 Northstar 图标生成。微信是否采用这些图标由客户端决定；它们不会改变微信聊天卡片的点击行为。

重新生成分享图：

```sh
NORTHSTAR_CHROMIUM="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node website/scripts/generate-share-assets.cjs
```

生成工具沿用 Viewer 图片脚本的 `NORTHSTAR_AGENT_ROOT` 与 `NORTHSTAR_PLAYWRIGHT_MODULE` 配置，仅在本地生成资源，网站运行无需这些依赖。

更新封面后，将生成日志中的版本化图片地址同步到首页的 OG、Twitter、`image_src` 和静态微博分享链接。新地址可避免复用旧图片 URL 的缓存，但微信是否采用图片仍需实际分享验证，不能据此认定抓取问题已修复。

微信聊天直接粘贴普通网址可能只显示文本链接。页面元信息无法强制微信生成卡片；需要先在微信内打开网页，再使用右上角分享入口试验。定制微信分享内容通常需要有相应权限的公众号、JS 接口安全域名、微信 JS-SDK 和服务端签名，当前静态站点尚未接入。各平台会缓存预览，已经发送的消息不一定会随网站更新。

分享标题使用“Northstar · 对话驱动的 AI 研发协作平台”。微信朋友圈的 `updateTimelineShareData` 接口没有 `desc` 字段，但支持通过 `imgUrl` 配置缩略图；Mac 微信原生分享入口是否采用网页简介由客户端决定。好友分享接口 `updateAppMessageShareData` 提供 `desc`，详见 [微信 JS-SDK 使用说明](https://developers.weixin.qq.com/doc/service/guide/h5/jssdk.html)。

## 分享入口

首页底部提供 X、Reddit、Facebook、微博的公开分享入口，以及微信二维码和复制链接工具。平台链接使用首页的 canonical 地址，JS 启用时从 OG 元信息读取标题、简介和图片；微信二维码也只编码 `https://godcin.com/`，不会携带当前页面的查询参数或章节位置。复制受浏览器限制时，弹窗保留可选中的网站地址。

分享入口不自动发布内容，也不加载平台追踪脚本。分享页可能需要登录，最终卡片样式由平台决定；微信二维码帮助在手机上打开网站，不会强制改变 Mac 或朋友圈卡片的布局。

品牌图标和二维码来源、生成方式见 `assets/share/README.md`，生成脚本为 `scripts/generate-share-controls.cjs`。

## 图标

`vendor/lucide.min.js` 为本地固定版本的 Lucide 0.468.0，ISC 许可证见 `vendor/lucide-LICENSE`。页面无需访问第三方 CDN。
