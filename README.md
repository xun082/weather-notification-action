# 🌤️ Weather Notification Action

[![GitHub Release](https://img.shields.io/github/v/release/xun082/weather-notification-action)](https://github.com/xun082/weather-notification-action/releases)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Weather%20Notification-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEafKoEMHuxg6yDYyYMIhgO7m0YdOjgH8eygK+DC4FYU+nHk=)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔔 **使用说明**: 这是一个可复用的 GitHub Action。其他开发者可以在他们的仓库中直接使用，无需 fork 或复制代码。只需在 workflow 中引用此 Action 并传入相应参数即可。

一个简洁高效的 GitHub Action，自动发送天气信息到指定邮箱。基于高德地图数据源，提供精美的 HTML 邮件模板。

## ✨ 功能特性

- 🌍 **高德地图数据源**: 准确可靠的天气信息
- 🏙️ **灵活城市输入**: 支持城市名称和城市编码
- 📧 **多邮箱支持**: 支持同时发送到多个邮箱地址
- 🎨 **精美邮件**: 现代化的 HTML 邮件模板，包含详细天气信息
- 🔧 **灵活配置**: 可自定义邮件主题、发送者名称等
- 📊 **详细输出**: 提供执行状态、天气数据等输出
- 🛡️ **安全可靠**: 参数通过 GitHub Secrets 安全传递

## 🚀 快速开始

> 🚀 **5 分钟快速设置**：查看 [快速开始指南](QUICK_START.md) 了解如何在 5 分钟内配置好天气通知。
>
> 📖 **详细说明**：如果你是第一次使用这个 Action，建议查看 [完整使用指南](HOW_TO_USE.md)。

> ⚠️ **重要**：示例中的邮箱地址都是占位符，请替换为你自己的真实邮箱地址。

### 基本用法

在你的仓库中创建 `.github/workflows/weather-notification.yml` 文件：

```yaml
name: Daily Weather Notification

on:
  schedule:
    # 每天早上8点(UTC)发送天气信息
    - cron: "0 8 * * *"
  workflow_dispatch: # 支持手动触发

jobs:
  send-weather:
    runs-on: ubuntu-latest

    steps:
      - name: Send Weather Notification
        uses: xun082/weather-notification-action@v2.3
        with:
          # 天气API配置
          amap_api_key: ${{ secrets.AMAP_API_KEY }}

          # 城市配置
          city: "110000"

          # 邮件服务器配置
          smtp_host: "smtp.gmail.com"
          smtp_port: "587"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}

          # 收件人邮箱
          recipient_emails: "friend@qq.com"

          # 可选配置
          sender_name: "天气助手"
          email_subject: "今日天气预报 🌤️"
```

### 多城市天气示例

```yaml
name: Multi-City Weather Notification

on:
  schedule:
    - cron: "0 8 * * *" # 每天早上8点

jobs:
  # 北京天气
  beijing-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Send Beijing Weather
        uses: xun082/weather-notification-action@v2.3
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.BEIJING_RECIPIENTS }}
          sender_name: "北京天气助手"

  # 上海天气
  shanghai-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Send Shanghai Weather
        uses: xun082/weather-notification-action@v2.3
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "310000" # 使用城市编码
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.SH_RECIPIENTS }}
          sender_name: "上海天气助手"
```

### 动态参数示例

```yaml
name: Dynamic Weather Notification

on:
  workflow_dispatch:
    inputs:
      city:
        description: "城市名称或编码"
        required: true
        default: "Beijing"
      emails:
        description: "收件人邮箱（用逗号分隔）"
        required: true

jobs:
  send-weather:
    runs-on: ubuntu-latest

    steps:
      - name: Send Weather Notification
        uses: xun082/weather-notification-action@v2.3
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: ${{ github.event.inputs.city }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ github.event.inputs.emails }}
```

## 📋 输入参数

### 必需参数

| 参数名             | 描述                         | 示例                           |
| ------------------ | ---------------------------- | ------------------------------ |
| `amap_api_key`     | 高德地图 API 密钥            | `${{ secrets.AMAP_API_KEY }}`  |
| `smtp_user`        | 发送邮箱地址                 | `your-email@gmail.com`         |
| `smtp_pass`        | 邮箱密码或应用专用密码       | `${{ secrets.SMTP_PASS }}`     |
| `recipient_emails` | 收件人邮箱（多个用逗号分隔） | `your@gmail.com,friend@qq.com` |

### 可选参数

| 参数名          | 描述                     | 默认值           |
| --------------- | ------------------------ | ---------------- |
| `city`          | 城市名称或 6 位城市编码  | `Beijing`        |
| `smtp_host`     | SMTP 服务器地址          | `smtp.gmail.com` |
| `smtp_port`     | SMTP 端口                | `587`            |
| `sender_name`   | 发送者名称               | `天气通知助手`   |
| `email_subject` | 邮件主题（留空自动生成） | -                |

## 📤 输出结果

| 输出名             | 描述                           |
| ------------------ | ------------------------------ |
| `status`           | 执行状态 (`success`/`failure`) |
| `message`          | 执行结果消息                   |
| `weather_data`     | 天气数据 JSON 字符串           |
| `recipients_count` | 邮件发送的收件人数量           |

### 使用输出示例

```yaml
- name: Send Weather Notification
  id: weather
  uses: xun082/weather-notification-action@v2.3
  with:
    # ... 参数配置

- name: Check Result
  run: |
    echo "Status: ${{ steps.weather.outputs.status }}"
    echo "Message: ${{ steps.weather.outputs.message }}"
    echo "Recipients: ${{ steps.weather.outputs.recipients_count }}"
```

## 🔧 配置说明

### 1. 获取高德地图 API 密钥

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 创建应用，选择"Web 服务"类型
4. 获取 API Key

### 2. 配置邮箱服务

#### Gmail 配置

```yaml
smtp_host: "smtp.gmail.com"
smtp_port: "587"
smtp_user: "your-email@gmail.com"
smtp_pass: "your-app-password" # 使用应用专用密码
```

#### QQ 邮箱配置

```yaml
smtp_host: "smtp.qq.com"
smtp_port: "587"
smtp_user: "your-email@qq.com"
smtp_pass: "your-authorization-code" # 使用授权码
```

#### 163 邮箱配置

```yaml
smtp_host: "smtp.163.com"
smtp_port: "587"
smtp_user: "your-email@163.com"
smtp_pass: "your-authorization-code" # 使用授权码
```

### 3. 城市配置

支持以下几种城市输入方式：

- **中文城市名**: `北京`, `上海`, `广州`
- **英文城市名**: `Beijing`, `Shanghai`, `Guangzhou`
- **城市编码**: `110000`, `310000`, `440100`

常用城市编码：

- 北京: `110000`
- 上海: `310000`
- 广州: `440100`
- 深圳: `440300`
- 杭州: `330100`
- 南京: `320100`
- 成都: `510100`
- 武汉: `420100`

## 🔒 安全配置

请将敏感信息配置为 GitHub Secrets：

1. 在仓库页面，点击 `Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret`
3. 添加以下 Secrets：

| Secret 名称    | 描述              |
| -------------- | ----------------- |
| `AMAP_API_KEY` | 高德地图 API 密钥 |
| `SMTP_USER`    | 发送邮箱地址      |
| `SMTP_PASS`    | 邮箱密码/授权码   |

## 📧 邮件效果预览

邮件采用现代化的 HTML 模板，包含：

- 🏙️ 城市信息和位置
- 🌡️ 当前温度和天气状况
- 💧 湿度信息
- 🌬️ 风向和风力
- 📅 未来 3 天天气预报
- ⏰ 数据更新时间

邮件支持移动端自适应显示，在手机上也有良好的阅读体验。

## 🛠️ 故障排除

### 常见问题

1. **邮件发送失败**

   - 检查 SMTP 配置是否正确
   - 确认使用的是应用专用密码而不是登录密码
   - 检查邮箱是否开启了 SMTP 服务

2. **天气数据获取失败**

   - 检查高德地图 API 密钥是否有效
   - 确认城市名称或编码是否正确
   - 检查 API 配额是否充足

3. **Action 执行失败**
   - 查看 GitHub Actions 日志获取详细错误信息
   - 确认所有必需参数都已正确配置

### 调试技巧

- 使用 `workflow_dispatch` 手动触发测试
- 检查 Action 的摘要输出获取详细信息
- 查看 `outputs` 获取执行结果

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果遇到问题，请：

1. 查看 [Issues](https://github.com/xun082/weather-notification-action/issues) 页面
2. 创建新的 Issue 描述问题
3. 提供详细的错误信息和配置

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！

## 📚 完整文档

- 🚀 [快速开始指南](QUICK_START.md) - 5 分钟快速设置
- 📖 [详细使用指南](HOW_TO_USE.md) - 完整配置说明
- 📋 [使用示例集合](USAGE_EXAMPLES.md) - 12 种使用场景
- ⭐ [功能特性说明](FEATURES.md) - 所有功能介绍
- 📦 [发布指南](PUBLISH.md) - 开发者发布指南

## 📞 技术支持

### 遇到问题？

1. 📖 先查看 [快速开始指南](QUICK_START.md) 和 [故障排除](#故障排除)
2. 🔍 搜索 [已知问题](https://github.com/xun082/weather-notification-action/issues)
3. 💬 提交 [新问题](https://github.com/xun082/weather-notification-action/issues/new)

### 需要帮助配置邮箱？

- Gmail: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#gmail-用户)
- QQ 邮箱: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#qq-邮箱用户)
- 163 邮箱: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#163-邮箱用户)

### 需要帮助配置天气 API？

- 高德地图: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#方案一高德地图推荐国内用户)
- OpenWeatherMap: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#方案二openweathermap推荐国际用户)

我们会尽快回复并提供帮助！ 🤝
