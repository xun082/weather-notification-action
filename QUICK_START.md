# ⚡ 快速开始指南

## 🎯 5 分钟设置天气通知

### 步骤 1：创建 Workflow 文件

在你的 GitHub 仓库中创建 `.github/workflows/weather.yml`：

```yaml
name: 每日天气通知

on:
  schedule:
    - cron: "0 0 * * *" # 北京时间早上8点
  workflow_dispatch: # 手动触发

jobs:
  weather:
    runs-on: ubuntu-latest
    steps:
      - uses: YOUR_USERNAME/weather-notification-action@v2
        with:
          # ⚠️ 必须修改：改为你的邮箱
          recipient_emails: "张三的邮箱@gmail.com"

          # ⚠️ 必须配置：邮件发送账户
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}

          # ⚠️ 必须配置：天气API
          amap_api_key: ${{ secrets.AMAP_API_KEY }}

          # 可选：自定义城市和发送者
          city: "北京"
          sender_name: "我的天气助手"
```

### 步骤 2：配置邮箱 Secrets

进入仓库 Settings → Secrets and variables → Actions，添加：

| Secret 名称 | 值                     | 说明               |
| ----------- | ---------------------- | ------------------ |
| `SMTP_USER` | `your-email@gmail.com` | 你的 Gmail 地址    |
| `SMTP_PASS` | `abcd efgh ijkl mnop`  | Gmail 应用专用密码 |

### 步骤 3：配置天气 API Secret

**选择一：高德地图（推荐国内用户）**

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册 → 创建应用 → 获取 Key
3. 添加 Secret：
   - Name: `AMAP_API_KEY`
   - Value: `你的高德API密钥`

**选择二：OpenWeatherMap（推荐国际用户）**

1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 注册 → 获取免费 API Key
3. 修改 workflow：
   ```yaml
   weather_provider: "openweather"
   openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
   city: "London,UK"
   ```
4. 添加 Secret：
   - Name: `OPENWEATHER_API_KEY`
   - Value: `你的OpenWeatherMap密钥`

## 📧 实际配置示例

### 个人用户示例

```yaml
# 张三的个人天气通知
recipient_emails: "zhangsan@gmail.com"
city: "深圳"
sender_name: "张三的天气助手"
email_subject: "深圳今日天气 🌤️"
```

### 团队用户示例

```yaml
# 公司团队天气通知
recipient_emails: "team-leader@company.com,member1@company.com,member2@company.com"
city: "上海"
sender_name: "团队天气播报"
email_subject: "上海办公室天气预报"
```

### 家庭用户示例

```yaml
# 家庭群天气通知
recipient_emails: "dad@gmail.com,mom@qq.com,son@163.com"
city: "杭州"
sender_name: "家庭天气助手"
email_subject: "今日杭州天气情况"
```

## 🕐 定时配置说明

| 时间           | Cron 表达式     | 说明       |
| -------------- | --------------- | ---------- |
| 北京时间 8:00  | `"0 0 * * *"`   | 每天早上   |
| 北京时间 18:00 | `"0 10 * * *"`  | 每天傍晚   |
| 工作日 8:00    | `"0 0 * * 1-5"` | 周一到周五 |

## ✅ 完成设置

设置完成后：

1. 手动触发测试：进入 Actions → 点击 "Run workflow"
2. 检查邮箱：几分钟后应该收到天气邮件
3. 查看日志：如果失败，在 Actions 页面查看错误信息

## 🔧 常见问题

**Q: 没收到邮件？**

- 检查邮箱地址是否正确
- 确认 Gmail 应用专用密码设置正确
- 查看 Actions 执行日志

**Q: API 调用失败？**

- 确认 API 密钥有效
- 检查城市名称拼写
- 验证 API 额度是否用完

**Q: 想要修改邮件内容？**

- 自定义 `sender_name` 和 `email_subject`
- 邮件模板会根据数据源自动优化

---

🎉 **完成！** 现在你应该能收到精美的天气通知邮件了！

需要更多配置选项？查看 [完整文档](README.md) 和 [使用示例](USAGE_EXAMPLES.md)。
