# dsh-ext-master

DeepSeek Harness 的**文档预览扩展名管理**插件。当前支持 Markdown 后缀（默认把 `.mdc` 当作 Markdown），配置结构按预览类型分组，后续可继续加 `html`、`code` 等预览类型。

适配 DSH `0.2.1-rc.3`。不修改 `app.asar`，通过 DSH profile 的 bundle + client plugin 机制加载。

## 功能

- 内置预览只注册了 `md` / `markdown`；本插件在运行时把配置的后缀追加到对应预览定义。
- 默认 `previews.markdown: [mdc]`；也支持 `mdx` 等任意安全后缀。
- 后缀统一小写、去掉前导 `.`、去重，并校验为安全字符。
- 监听预览注册变化；即使目标预览定义晚于本插件注册也能补上。
- 配置通过 Host 注入页面的 `__DSH_DOCUMENT_PREVIEW_EXTENSIONS__` 传递。

## 安装

1. 把仓库放到 profile 的插件目录：

```bash
mkdir -p ~/.dsh/profiles/desktop/plugins
git clone https://github.com/maxid/dsh-ext-master.git \
  ~/.dsh/profiles/desktop/plugins/dsh-ext-master
```

2. 在 `~/.dsh/profiles/desktop/package.json` 声明依赖并选择 bundle：

```json
{
  "dependencies": {
    "dsh-ext-master": "link:./plugins/dsh-ext-master"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-ext-master"
      ]
    }
  }
}
```

保留你原有的 bundles，只在末尾追加 `dsh-ext-master`。

3. 建立 `node_modules` 链接（不经过 registry）：

```bash
ln -sfn ~/.dsh/profiles/desktop/plugins/dsh-ext-master \
  ~/.dsh/profiles/desktop/node_modules/dsh-ext-master
```

4. 刷新 DSH 页面。若 profile 的 HMR 未开启，重启 DSH。

## 配置

bundle 自带默认配置：

```yaml
previews:
  markdown:
    - mdc
```

要扩展更多后缀，在 `~/.dsh/profiles/desktop/cordis.patch.yml` 追加：

```yaml
- id: dsh-ext-master
  name: dsh-ext-master
  config:
    previews:
      markdown:
        - mdc
        - mdx
```

`previews` 的 key 对应预览定义 id 的最后一段（如 `markdown`、`html`）。后续新增预览类型时沿用同一结构：

```yaml
previews:
  markdown: [mdc, mdx]
  html: [xhtml]
```

改配置后刷新页面（扩展名在页面加载时注入）；仅改本插件 `lib/client.js` 时代码本身可被 DSH HMR 热重载。

## 结构

```text
lib/index.js        Host 插件：校验配置并通过 webserver/index-inject 注入页面
lib/client.js       Client 插件：按预览类型把后缀追加到对应预览定义
cordis.patch.yml    Bundle patch：插入 dsh-ext-master 行，默认 markdown: [mdc]
```

### 说明

DSH 的浏览器插件是预构建的 `lib/client.js`，使用 `window.__ModuleLoader__.load({ id, factory })` 协议；本仓库直接提供该产物，无构建步骤。

## 已知限制

- 文件树中的 `.mdc` 图标可能仍显示通用图标：前端 file-kind 映射在只读 bundle 内，插件无法覆盖；预览行为不受影响。
- 这是 profile 级扩展，不进入 DSH 安装包；DSH 升级后 profile 与插件仍然有效。
- 更彻底的做法是上游把 `mdc` 加入 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview` 的 `extensions`，并同步前端 file-kind 映射。

## License

MIT
