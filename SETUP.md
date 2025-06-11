# ⚙️ 发布前设置指南

> 这个指南是给要发布这个 Action 的开发者看的，不是给使用者看的。

## 📝 发布前准备

### 1. 替换用户名占位符

在发布前，需要将所有文档中的 `YOUR_USERNAME` 替换为你的 GitHub 用户名：

```bash
# 批量替换所有文档中的占位符
sed -i 's/YOUR_USERNAME/你的GitHub用户名/g' README.md HOW_TO_USE.md USAGE_EXAMPLES.md PUBLISH.md package.json .github/workflows/release.yml
```

例如，如果你的 GitHub 用户名是 `john-doe`，运行：

```bash
sed -i 's/YOUR_USERNAME/john-doe/g' README.md HOW_TO_USE.md USAGE_EXAMPLES.md PUBLISH.md package.json .github/workflows/release.yml
```

### 2. 更新作者信息

编辑以下文件中的作者信息：

**package.json:**

```json
{
  "author": "你的名字或组织名"
}
```

**action.yml:**

```yaml
author: "你的名字或组织名"
```

**LICENSE:**

```
Copyright (c) 2024 你的名字或组织名
```

### 3. 构建 Action

```bash
# 安装依赖
npm install

# 构建 Action
npm run build

# 验证构建
npm run package-check
```

### 4. 提交代码

```bash
git add .
git commit -m "🌤️ 准备发布 Weather Notification Action v2.0.0"
git push origin main
```

### 5. 创建 Release

```bash
# 创建并推送 tag
git tag v2.0.0
git push origin v2.0.0

# 或者在 GitHub 网页上创建 Release
# 1. 进入仓库 Releases 页面
# 2. 点击 "Create a new release"
# 3. 选择 tag v2.0.0
# 4. 勾选 "Publish this Action to the GitHub Marketplace"
```

## 📋 发布检查清单

发布前确保：

- [ ] 所有 `YOUR_USERNAME` 已替换为实际用户名
- [ ] 作者信息已更新
- [ ] `dist/index.js` 文件已生成并提交
- [ ] 没有 `node_modules` 目录被提交
- [ ] 没有敏感信息（API 密钥等）在代码中
- [ ] README.md 包含清晰的使用说明
- [ ] action.yml 配置正确
- [ ] LICENSE 文件存在

## 🎉 发布完成

发布后，其他用户就可以通过以下方式使用你的 Action：

```yaml
- uses: 你的用户名/weather-notification-action@v2
  with:
    # 参数配置
```

## 🔄 更新版本

当需要发布新版本时：

1. 更新代码
2. 运行 `npm run build`
3. 更新 `package.json` 中的版本号
4. 提交代码
5. 创建新的 tag 和 release

```bash
# 例如发布 v2.1.0
git tag v2.1.0
git push origin v2.1.0
```

---

💡 **提示**：建议在发布前在自己的仓库中测试 Action 是否正常工作。
