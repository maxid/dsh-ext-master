# Changelog

本仓库的 tag 与 [DeepSeek Harness 官方版本](https://github.com/deepseek-ai/deepseek-harness/releases)一一对应，命名沿用官方的 `dsh-v<版本>`。一个 tag 表示"该插件状态已在这个 DSH 版本上验证"。

## dsh-v0.2.1-rc.5 — 2026-11-02

适配 DSH `0.2.1-rc.5`，同时保留 `0.2.1-rc.3` 支持。

### 变更

- `engines.dsh` 由 `>=0.2.1-rc.3` 收紧为 `>=0.2.1-rc.3 <0.3.0-0`：覆盖 rc.5，同时让 DSH 在进入 0.3（含其 alpha/rc 预发布）时按 `engines.dsh` 明确提示不兼容，而不是静默出错。
- 版本 `0.2.0` → `0.2.1`。
- README 增加「版本对应（tag）」表与按 tag 安装的说明；新增本 CHANGELOG。

### 验证

- **DSH 0.2.1-rc.5**：把插件装进独立 profile，真实启动 Web 服务，确认 Host 半注入的 `globalThis.__DSH_DOCUMENT_PREVIEW_EXTENSIONS__` 为 `{"markdown":["mdc"]}`，且 `dsh-ext-master/client.js` 正常出现在 client bundle 图中并成功加载执行（`documentPreviews` patch 生效，含晚注册补丁）。
- **DSH 0.2.1-rc.3**：当前桌面版日常使用验证。
- 0.2.1-rc.4 与 rc.5 之间只有 ACP 诊断输出修复（见官方 release notes），行为与 rc.5 一致。

## dsh-v0.2.1-rc.3 — 2026-11-02

当前已发布状态（`0.2.0`）在 DSH `0.2.1-rc.3` 上的验证基线，作为 rc.3 对应的 tag。

- Host：`webserver/index-inject` 注入配置。
- Client：`documentPreviews` 注册表 patch。

## 0.2.0 — 2026-10-28

- 更名为 `dsh-ext-master`，预览扩展配置按预览类型分组（`previews.markdown: [mdc]` 等）。

## 0.1.x

- 初版：把可配置的 Markdown 后缀（默认 `.mdc`）追加到 DSH 文档预览定义。
