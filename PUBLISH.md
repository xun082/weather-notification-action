# 📦 发布指南

本文档说明如何将这个 Weather Notification Action 发布到 GitHub 并提供给其他用户使用。

## 🚀 发布到 GitHub

### 1. 准备发布

#### 构建 Action

```bash
# 安装依赖
npm install

# 构建Action（将src文件打包成dist/index.js）
npm run build

# 验证构建结果
npm run package-check
```

#### 检查必需文件

确保以下文件存在且配置正确：

- ✅ `action.yml` - Action 定义文件
- ✅ `dist/index.js` - 构建后的主文件
- ✅ `README.md` - 详细文档
- ✅ `package.json` - 依赖配置
- ✅ `LICENSE` - 许可证文件

### 2. 创建 Release

#### 通过 GitHub Web 界面

1. 进入你的 GitHub 仓库
2. 点击右侧的 "Releases"
3. 点击 "Create a new release"
4. 填写信息：

   - **Tag version**: `v2.0.0`
   - **Release title**: `🌤️ Weather Notification Action v2.0.0`
   - **Description**:

     ````markdown
     ## 🌤️ Weather Notification Action v2.0.0

     ### ✨ 新功能

     - 🌍 支持高德地图和 OpenWeatherMap 双数据源
     - 🏙️ 智能城市识别（中英文+城市编码）
     - 📧 精美的 HTML 邮件模板
     - 🔧 灵活的参数配置
     - 📊 详细的输出信息

     ### 📦 使用方法

     ```yaml
     - uses: xun082/weather-notification-action@v2
       with:
         weather_provider: "amap"
         amap_api_key: ${{ secrets.AMAP_API_KEY }}
         smtp_user: ${{ secrets.SMTP_USER }}
         smtp_pass: ${{ secrets.SMTP_PASS }}
         recipient_emails: "your@email.com"
     ```
     ````

     ### 📋 完整文档

     查看 [README.md](README.md) 获取详细使用说明。

     ```

     ```

#### 通过命令行

```bash
# 创建并推送tag
git tag v2.0.0
git push origin v2.0.0

# 或使用GitHub CLI
gh release create v2.0.0 \
  --title "🌤️ Weather Notification Action v2.0.0" \
  --notes-file RELEASE_NOTES.md
```

### 3. 自动化发布

使用 `.github/workflows/release.yml` 实现自动发布：

```bash
# 创建tag时自动构建和发布
git tag v2.0.1
git push origin v2.0.1
```

## 🌟 发布到 GitHub Marketplace

### 1. 准备 Marketplace 发布

#### 创建 Marketplace 配置

确保 `action.yml` 包含完整的 branding 配置：

```yaml
name: "Weather Notification Action"
description: "🌤️ 功能强大的天气通知Action，支持高德地图和OpenWeatherMap双数据源"
author: "Your Name"

branding:
  icon: "cloud" # 选择合适的Feather图标
  color: "blue" # 选择主题色
```

#### 验证 Action

1. **测试本地 Action**：

   ```yaml
   steps:
     - uses: ./ # 测试本地Action
       with:
         # ... 参数
   ```

2. **验证所有输入输出**：
   - 确保所有 inputs 都有合理的默认值或 required 设置
   - 确保所有 outputs 都正确设置

### 2. 发布到 Marketplace

#### 通过 GitHub Web 界面

1. 进入仓库的 Release 页面
2. 创建新 Release 时，勾选 "Publish this Action to the GitHub Marketplace"
3. 选择分类（例如："Continuous integration"）
4. 添加标签（例如："weather", "email", "notification"）

#### 发布要求

- ✅ 必须有开源许可证（推荐 MIT）
- ✅ README.md 必须包含使用示例
- ✅ action.yml 必须包含完整的描述和 branding
- ✅ 不能包含敏感信息或恶意代码

### 3. 发布检查清单

#### 代码质量

- [ ] 所有依赖都已正确声明
- [ ] 构建后的 dist/目录已提交
- [ ] 没有硬编码的敏感信息
- [ ] 错误处理完善

#### 文档质量

- [ ] README.md 包含清晰的使用示例
- [ ] 所有参数都有详细说明
- [ ] 包含故障排除指南
- [ ] 有完整的输入输出说明

#### 测试覆盖

- [ ] 基本功能测试通过
- [ ] 错误情况处理正确
- [ ] 不同参数组合都能工作
- [ ] 在不同操作系统上测试（如需要）

## 📈 版本管理

### 版本号规范

遵循语义化版本（Semantic Versioning）：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

示例：

- `v1.0.0` - 首个稳定版本
- `v1.1.0` - 新增功能（向下兼容）
- `v1.1.1` - 修复问题
- `v2.0.0` - 重大更改（可能不兼容）

### Tag 策略

```bash
# 发布主要版本
git tag v2.0.0
git push origin v2.0.0

# 同时创建主版本号tag（用户可以使用@v2）
git tag v2
git push origin v2

# 发布修订版本时，更新主版本tag
git tag -f v2
git push -f origin v2
```

### 分支策略

- `main` - 稳定版本，对应最新 release
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复分支

## 🔄 更新和维护

### 定期维护

1. **依赖更新**：

   ```bash
   npm audit
   npm update
   npm run build
   ```

2. **安全检查**：

   ```bash
   npm audit --audit-level high
   ```

3. **文档更新**：
   - 确保 README.md 与最新功能同步
   - 更新示例代码
   - 添加新的故障排除指南

### 用户反馈处理

1. **Issue 处理**：

   - 及时回复用户问题
   - 分类标记（bug/enhancement/question）
   - 提供详细的解决方案

2. **功能请求**：
   - 评估可行性
   - 与用户讨论实现方案
   - 规划到合适的版本

## 📊 监控和分析

### 使用统计

通过以下方式了解 Action 的使用情况：

1. **GitHub Insights**：查看仓库的统计信息
2. **Release 下载量**：监控不同版本的采用情况
3. **Issue 和讨论**：了解用户需求和问题

### 性能监控

```yaml
# 添加性能监控到Action中
- name: Monitor Performance
  run: |
    echo "执行时间: $(date)"
    echo "内存使用: $(free -h)"
```

## 🎯 推广策略

### 1. 文档优化

- 编写详细的使用指南
- 提供多种使用场景示例
- 录制演示视频

### 2. 社区推广

- 在相关技术论坛分享
- 写技术博客介绍使用方法
- 参与 GitHub 社区讨论

### 3. SEO 优化

- 使用合适的标签和关键词
- 优化 README.md 的结构
- 添加徽章和图标

## 📄 发布模板

### Release Notes 模板

````markdown
## 🌤️ Weather Notification Action v2.x.x

### ✨ 新功能

- 新增的功能描述

### 🐛 问题修复

- 修复的问题描述

### 🔧 改进

- 性能或体验改进

### 📋 使用方法

```yaml
- uses: xun082/weather-notification-action@v2.x.x
  with:
    # 参数示例
```
````

### 💔 破坏性变更

- 不兼容的变更说明

### 📖 文档

- [完整文档](README.md)
- [使用示例](USAGE_EXAMPLES.md)
- [故障排除](README.md#故障排除)

````

## 🎉 发布完成

发布完成后，用户就可以通过以下方式使用你的Action：

```yaml
# 使用最新版本
- uses: xun082/weather-notification-action@v2

# 使用特定版本
- uses: xun082/weather-notification-action@v2.0.0

# 使用开发版本（不推荐生产环境）
- uses: xun082/weather-notification-action@main
````

🎊 恭喜！你的 Weather Notification Action 现在可以被全世界的开发者使用了！
