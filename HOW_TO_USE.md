# 🚀 如何使用 Weather Notification Action

> 这是一个现成的 GitHub Action，你可以直接在自己的仓库中使用，无需复制代码。

## ⚠️ 重要提醒

**关于收件人邮箱：**

- 📧 你需要在配置中指定 **你自己的邮箱地址** 作为收件人
- 🔄 示例中的 `your@email.com` 等都是占位符，请替换为你的真实邮箱
- 🔒 建议使用 GitHub Secrets 来管理邮箱地址，保护隐私

## 👥 面向用户

**这个 Action 适合：**

- 希望收到定时天气通知的个人用户
- 需要为团队发送天气信息的组织
- 想要集成天气功能到 CI/CD 流程的开发者
- 希望监控特定城市天气的项目

## 🎯 使用方式

### 第一步：在你的仓库中创建 Workflow

1. 在你的 GitHub 仓库中创建目录 `.github/workflows/`
2. 在该目录下创建一个文件，例如 `daily-weather.yml`

### 第二步：配置 Workflow

```yaml
name: 每日天气通知

on:
  schedule:
    # 每天早上 8 点发送天气信息
    - cron: "0 8 * * *"
  workflow_dispatch: # 允许手动触发

jobs:
  send-weather:
    runs-on: ubuntu-latest

    steps:
      - name: 发送天气通知
        uses: xun082/weather-notification-action@v2
        with:
                  # 必需参数
        smtp_user: ${{ secrets.SMTP_USER }}
        smtp_pass: ${{ secrets.SMTP_PASS }}
        recipient_emails: "请替换为你的邮箱@example.com"

          # 天气 API（至少选择一个）
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          # openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}

          # 可选参数
          city: "北京"
          weather_provider: "amap"
          sender_name: "天气小助手"
```

### 第三步：配置 Secrets

在你的仓库设置中添加以下 Secrets：

1. 进入仓库 → `Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret` 添加：

**邮箱配置：**

- `SMTP_USER`: 你的发送邮箱地址
- `SMTP_PASS`: 邮箱密码或应用专用密码

**天气 API（选择一个）：**

- `AMAP_API_KEY`: 高德地图 API 密钥（推荐国内用户）
- `OPENWEATHER_API_KEY`: OpenWeatherMap API 密钥（推荐国际用户）

## 📧 邮箱配置详解

### Gmail 用户

1. **开启两步验证**
2. **生成应用专用密码**：
   - 进入 Google 账户设置
   - 安全性 → 两步验证 → 应用专用密码
   - 选择"邮件"和设备，生成密码
3. **配置 Secrets**：
   - `SMTP_USER`: `your@gmail.com`
   - `SMTP_PASS`: `生成的应用专用密码`

### QQ 邮箱用户

1. **开启 SMTP 服务**：
   - 登录 QQ 邮箱 → 设置 → 账户
   - 开启 POP3/SMTP 服务
   - 获取授权码
2. **配置 Workflow**：
   ```yaml
   smtp_host: "smtp.qq.com"
   smtp_port: "587"
   smtp_user: ${{ secrets.QQ_EMAIL }}
   smtp_pass: ${{ secrets.QQ_AUTH_CODE }}
   ```

### 163 邮箱用户

1. **开启客户端授权密码**
2. **配置 Workflow**：
   ```yaml
   smtp_host: "smtp.163.com"
   smtp_port: "587"
   smtp_user: ${{ secrets.NETEASE_EMAIL }}
   smtp_pass: ${{ secrets.NETEASE_PASSWORD }}
   ```

## 🌤️ 天气 API 配置详解

### 方案一：高德地图（推荐国内用户）

**优势：**

- 🇨🇳 国内数据最准确
- 🆓 免费额度大（30 万次/月）
- 🚀 访问速度快
- 🏙️ 支持中文城市名

**申请步骤：**

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账户
3. 创建应用 → 添加 Web 服务 API
4. 获取 Key

**城市配置：**

- 中文：`北京`、`上海`、`深圳`
- 英文：`Beijing`、`Shanghai`
- 编码：`110000`（北京）、`310000`（上海）

### 方案二：OpenWeatherMap（推荐国际用户）

**优势：**

- 🌍 全球覆盖广
- 📊 数据丰富（包含气压、能见度等）
- 🌅 精确日出日落时间

**申请步骤：**

1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 注册账户
3. 获取免费 API Key

**城市配置：**

- 城市名：`London`、`New York`
- 完整格式：`London,UK`、`New York,US`

## 🕐 定时配置

### 常用时间设置

```yaml
schedule:
  # 每天早上 8 点（UTC）
  - cron: "0 8 * * *"

  # 每天下午 2 点（UTC）
  - cron: "0 14 * * *"

  # 每周一早上 9 点
  - cron: "0 9 * * 1"

  # 每个月 1 号上午 10 点
  - cron: "0 10 1 * *"
```

### 时区说明

- GitHub Actions 使用 UTC 时间
- 北京时间 = UTC + 8
- 如果想要北京时间上午 8 点执行，设置为 `"0 0 * * *"`（UTC 0 点）

## 📱 收件人配置详解

> ⚠️ **重要**：`recipient_emails` 是必需参数，请替换为你实际想要接收天气通知的邮箱地址。

### 配置方式

```yaml
# 单个收件人（请替换为你的真实邮箱）
recipient_emails: "zhangsan@gmail.com"

# 多个收件人（用逗号分隔，请替换为实际邮箱）
recipient_emails: "zhangsan@gmail.com,lisi@qq.com,wangwu@163.com"

# 团队邮箱示例
recipient_emails: "team-beijing@company.com,manager@company.com"

# 使用 Secrets 管理收件人列表（推荐）
recipient_emails: ${{ secrets.RECIPIENT_LIST }}
```

### 推荐做法

为了保护隐私和便于管理，建议将收件人列表设置为 Secret：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 创建新 Secret：
   - Name: `RECIPIENT_LIST`
   - Value: `your-email@gmail.com,friend@qq.com`
3. 在 workflow 中使用：
   ```yaml
   recipient_emails: ${{ secrets.RECIPIENT_LIST }}
   ```

## 🏙️ 多城市配置

```yaml
name: 多城市天气通知

on:
  schedule:
    - cron: "0 8 * * *"

jobs:
  beijing:
    runs-on: ubuntu-latest
    steps:
           - uses: xun082/weather-notification-action@v2
       with:
         city: "北京"
         recipient_emails: "请替换为北京团队的邮箱@company.com"
         smtp_user: ${{ secrets.SMTP_USER }}
         smtp_pass: ${{ secrets.SMTP_PASS }}
         amap_api_key: ${{ secrets.AMAP_API_KEY }}

  shanghai:
    runs-on: ubuntu-latest
    steps:
    - uses: xun082/weather-notification-action@v2
      with:
        city: "上海"
        recipient_emails: "请替换为上海团队的邮箱@company.com"
        smtp_user: ${{ secrets.SMTP_USER }}
        smtp_pass: ${{ secrets.SMTP_PASS }}
        amap_api_key: ${{ secrets.AMAP_API_KEY }}
```

## 🎛️ 高级配置示例

### 1. 带条件的天气警报

```yaml
name: 极端天气警报

on:
  schedule:
    - cron: "0 */6 * * *" # 每 6 小时检查

jobs:
  weather-alert:
    runs-on: ubuntu-latest
    steps:
      - name: 获取天气信息
        id: weather
        uses: xun082/weather-notification-action@v2
        with:
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.ALERT_EMAILS }}

      - name: 检查极端天气
        if: steps.weather.outputs.status == 'success'
        run: |
          # 可以根据天气数据添加自定义逻辑
          echo "天气检查完成"
```

### 2. 工作日天气通知

```yaml
name: 工作日天气

on:
  schedule:
    - cron: "0 8 * * 1-5" # 周一到周五

jobs:
  workday-weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          city: "深圳"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "team@company.com"
          sender_name: "工作日天气助手"
          email_subject: "今日通勤天气 🚗"
```

## 🔧 故障排除

### 常见问题

**1. 邮件发送失败**

- 检查邮箱密码是否正确
- 确认已开启 SMTP 服务
- 验证邮箱地址格式

**2. 天气数据获取失败**

- 检查 API 密钥是否有效
- 确认城市名称拼写
- 检查 API 调用限额

**3. Action 执行失败**

- 查看 Actions 页面的详细日志
- 确认所有必需的 Secrets 已配置
- 检查 YAML 语法是否正确

### 测试方法

1. **手动触发测试**：
   在 Actions 页面点击 "Run workflow" 手动运行

2. **查看执行日志**：
   点击失败的 workflow 查看详细错误信息

3. **逐步排查**：
   先确保邮箱配置正确，再检查天气 API

## 💡 使用建议

1. **选择合适的数据源**：

   - 国内用户：高德地图
   - 国外用户：OpenWeatherMap

2. **合理设置时间**：

   - 避开网络高峰期
   - 考虑收件人的时区

3. **保护敏感信息**：

   - 使用 GitHub Secrets 存储密码
   - 不要在代码中硬编码密钥

4. **监控 API 用量**：
   - 定期检查 API 调用次数
   - 避免超出免费额度

## 📞 获取帮助

如果遇到问题：

1. 📖 查看 [完整文档](README.md)
2. 🔍 搜索 [已知问题](https://github.com/xun082/weather-notification-action/issues)
3. 💬 提交 [新问题](https://github.com/xun082/weather-notification-action/issues/new)

---

🎉 **开始使用吧！** 按照上述步骤配置后，你就可以收到精美的天气通知邮件了！
