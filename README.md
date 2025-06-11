# 🌤️ Weather Notification Action

[![GitHub Release](https://img.shields.io/github/v/release/YOUR_USERNAME/weather-notification-action)](https://github.com/YOUR_USERNAME/weather-notification-action/releases)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Weather%20Notification-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEafKoEMHuxg6yDYyYMIhgO7m0YdOjgH8eygK+DC4FYU+nHk=)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔔 **使用说明**: 这是一个可复用的 GitHub Action。其他开发者可以在他们的仓库中直接使用，无需 fork 或复制代码。只需在 workflow 中引用此 Action 并传入相应参数即可。

一个功能强大的 GitHub Action，自动发送天气信息到指定邮箱。支持高德地图和 OpenWeatherMap 双数据源，提供精美的 HTML 邮件模板。

## ✨ 功能特性

- 🌍 **双数据源**: 支持高德地图（国内推荐）和 OpenWeatherMap（国际）
- 🏙️ **智能城市识别**: 支持中英文城市名和城市编码
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
        uses: YOUR_USERNAME/weather-notification-action@v2
        with:
          # 天气API配置（至少配置一个）
          weather_provider: "amap" # 或 'openweather'
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          # openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}

          # 城市配置
          city: "Beijing" # 或城市编码如 '110000'

          # 邮件服务器配置
          smtp_host: "smtp.gmail.com"
          smtp_port: "587"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}

                  # 收件人配置（请替换为你的真实邮箱）
        recipient_emails: "your-email@gmail.com,friend@qq.com"

          # 可选配置
          sender_name: "天气助手"
          email_subject: "今日天气预报 🌤️"
```

### 高级用法示例

```yaml
name: Multi-City Weather Notification

on:
  schedule:
    - cron: "0 8 * * *" # 每天早上8点

jobs:
  # 北京天气（使用高德地图）
  beijing-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Send Beijing Weather
        uses: YOUR_USERNAME/weather-notification-action@v2
        with:
          weather_provider: "amap"
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.BEIJING_RECIPIENTS }}
          sender_name: "北京天气助手"

  # 纽约天气（使用OpenWeatherMap）
  newyork-weather:
    runs-on: ubuntu-latest
    steps:
      - name: Send New York Weather
        uses: YOUR_USERNAME/weather-notification-action@v2
        with:
          weather_provider: "openweather"
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: "New York,US"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.NY_RECIPIENTS }}
          sender_name: "NY Weather Bot"
```

### 动态参数示例

```yaml
name: Dynamic Weather Notification

on:
  workflow_dispatch:
    inputs:
      city:
        description: "城市名称"
        required: true
        default: "Beijing"
      emails:
        description: "收件人邮箱（用逗号分隔）"
        required: true
      provider:
        description: "数据源"
        type: choice
        options:
          - amap
          - openweather
        default: "amap"

jobs:
  send-weather:
    runs-on: ubuntu-latest

    steps:
      - name: Send Weather Notification
        uses: YOUR_USERNAME/weather-notification-action@v2
        with:
          weather_provider: ${{ github.event.inputs.provider }}
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: ${{ github.event.inputs.city }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ github.event.inputs.emails }}
```

## 📋 输入参数

### 必需参数

| 参数名             | 描述                         | 示例                           |
| ------------------ | ---------------------------- | ------------------------------ |
| `smtp_user`        | 发送邮箱地址                 | `your-email@gmail.com`         |
| `smtp_pass`        | 邮箱密码或应用专用密码       | `${{ secrets.SMTP_PASS }}`     |
| `recipient_emails` | 收件人邮箱（多个用逗号分隔） | `your@gmail.com,friend@qq.com` |

### 天气 API 参数（至少配置一个）

| 参数名                | 描述                    | 默认值 |
| --------------------- | ----------------------- | ------ |
| `weather_provider`    | 天气数据提供商          | `amap` |
| `amap_api_key`        | 高德地图 API 密钥       | -      |
| `openweather_api_key` | OpenWeatherMap API 密钥 | -      |

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
  uses: YOUR_USERNAME/weather-notification-action@v2
  with:
    # ... 其他参数

- name: Check Result
  run: |
    echo "Status: ${{ steps.weather.outputs.status }}"
    echo "Message: ${{ steps.weather.outputs.message }}"
    echo "Recipients: ${{ steps.weather.outputs.recipients_count }}"
```

## 🔧 配置指南

### 1. 获取天气 API 密钥

#### 高德地图 API（推荐国内用户）

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账户
3. 进入控制台 → 应用管理 → 创建新应用
4. 添加服务：选择"Web 服务 API"
5. 获取 API Key

#### OpenWeatherMap API（推荐国际用户）

1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 注册账户并获取免费的 API Key

### 2. 配置邮箱服务

#### Gmail 配置

1. 开启两步验证
2. 生成应用专用密码：[Google 应用密码设置](https://support.google.com/accounts/answer/185833)
3. 使用应用专用密码作为 `smtp_pass`

#### 其他邮箱配置

| 邮箱服务 | SMTP 地址               | 端口  | 说明               |
| -------- | ----------------------- | ----- | ------------------ |
| QQ 邮箱  | `smtp.qq.com`           | `587` | 需要获取授权码     |
| 163 邮箱 | `smtp.163.com`          | `587` | 使用客户端授权密码 |
| Outlook  | `smtp-mail.outlook.com` | `587` | 使用账户密码       |

### 3. 配置 GitHub Secrets

在仓库设置中进入 `Settings` → `Secrets and variables` → `Actions`，添加以下 Secrets：

```
AMAP_API_KEY=your_amap_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🏙️ 城市配置

### 高德地图支持的格式

- **中文城市名**: `北京`, `上海`, `深圳`, `广州`
- **英文城市名**: `Beijing`, `Shanghai`, `Shenzhen`, `Guangzhou`
- **6 位城市编码**: `110000`（北京）, `440300`（深圳）

#### 常用城市编码

| 城市 | 编码     | 城市 | 编码     |
| ---- | -------- | ---- | -------- |
| 北京 | `110000` | 上海 | `310000` |
| 深圳 | `440300` | 广州 | `440100` |
| 杭州 | `330100` | 南京 | `320100` |
| 成都 | `510100` | 武汉 | `420100` |
| 西安 | `610100` | 重庆 | `500000` |

### OpenWeatherMap 支持的格式

- **英文城市名**: `Beijing`, `Shanghai`, `London`
- **城市,国家**: `London,UK`, `New York,US`

## 📧 邮件预览

### 高德地图版本邮件特色

- 🎨 现代化的渐变背景设计
- ✨ 闪光动画效果
- 📊 包含省份、城市、更新时间
- 📅 未来几天天气预报
- 🎯 中文显示优化

### OpenWeatherMap 版本邮件特色

- 🌐 国际化数据格式
- 📈 丰富的气象数据（气压、能见度等）
- 🌅 精确的日出日落时间
- 📱 响应式设计

## 🔍 故障排除

### 常见问题

**1. Action 执行失败**

- ✅ 检查所有必需参数是否已配置
- ✅ 确认 Secrets 名称拼写正确
- ✅ 查看 Action 日志获取详细错误信息

**2. 邮件发送失败**

- ✅ 检查 SMTP 配置是否正确
- ✅ 确认邮箱密码或应用专用密码有效
- ✅ 检查邮箱是否开启 SMTP 服务

**3. 天气数据获取失败**

- ✅ 检查 API 密钥是否有效
- ✅ 确认城市名称拼写正确
- ✅ 检查 API 调用次数是否超限

### 调试技巧

1. **使用手动触发**：通过 `workflow_dispatch` 测试配置
2. **查看 Action 摘要**：在 Actions 页面查看详细的执行摘要
3. **逐步排查**：先确保天气 API 正常，再检查邮件配置

## 🆚 数据源对比

| 特性           | 高德地图 API       | OpenWeatherMap |
| -------------- | ------------------ | -------------- |
| **国内准确性** | ⭐⭐⭐⭐⭐         | ⭐⭐⭐         |
| **国际覆盖**   | ⭐⭐⭐             | ⭐⭐⭐⭐⭐     |
| **中文支持**   | ⭐⭐⭐⭐⭐         | ⭐⭐⭐         |
| **免费额度**   | 30 万次/月         | 1000 次/天     |
| **数据丰富度** | ⭐⭐⭐⭐           | ⭐⭐⭐⭐⭐     |
| **访问速度**   | ⭐⭐⭐⭐⭐（国内） | ⭐⭐⭐（国内） |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个 Action！

### 开发流程

1. Fork 这个仓库
2. 创建功能分支
3. 提交你的更改
4. 创建 Pull Request

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/weather-notification-action.git
cd weather-notification-action

# 安装依赖
npm install

# 构建Action
npm run build

# 本地测试
npm run test
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [高德地图开放平台](https://lbs.amap.com/) - 国内天气数据
- [OpenWeatherMap](https://openweathermap.org/) - 国际天气数据
- [GitHub Actions](https://github.com/features/actions) - 自动化平台

---

⭐ 如果这个 Action 对你有帮助，请给个 Star 支持一下！

## 📚 完整文档

- 🚀 [快速开始指南](QUICK_START.md) - 5 分钟快速设置
- 📖 [详细使用指南](HOW_TO_USE.md) - 完整配置说明
- 📋 [使用示例集合](USAGE_EXAMPLES.md) - 12 种使用场景
- ⭐ [功能特性说明](FEATURES.md) - 所有功能介绍
- 📦 [发布指南](PUBLISH.md) - 开发者发布指南

## 📞 技术支持

### 遇到问题？

1. 📖 先查看 [快速开始指南](QUICK_START.md) 和 [故障排除](#故障排除)
2. 🔍 搜索 [已知问题](https://github.com/YOUR_USERNAME/weather-notification-action/issues)
3. 💬 提交 [新问题](https://github.com/YOUR_USERNAME/weather-notification-action/issues/new)

### 需要帮助配置邮箱？

- Gmail: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#gmail-用户)
- QQ 邮箱: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#qq-邮箱用户)
- 163 邮箱: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#163-邮箱用户)

### 需要帮助配置天气 API？

- 高德地图: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#方案一高德地图推荐国内用户)
- OpenWeatherMap: 查看 [HOW_TO_USE.md](HOW_TO_USE.md#方案二openweathermap推荐国际用户)

我们会尽快回复并提供帮助！ 🤝
