# 📋 使用示例

本文档包含各种使用场景的详细示例。

## 🎯 基础示例

### 1. 最简单的使用方式

```yaml
name: Daily Weather

on:
  schedule:
    - cron: "0 8 * * *" # 每天早上8点

jobs:
  weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "your@email.com"
```

### 2. 使用 OpenWeatherMap

```yaml
name: International Weather

on:
  schedule:
    - cron: "0 12 * * *" # 每天中午12点

jobs:
  weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          weather_provider: "openweather"
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: "London,UK"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "london@example.com"
```

## 🌍 多城市示例

### 3. 多个城市不同时间

```yaml
name: Multi-City Weather

on:
  schedule:
    - cron: "0 0 * * *" # UTC 0点 = 北京时间8点
    - cron: "0 4 * * *" # UTC 4点 = 北京时间12点
    - cron: "0 8 * * *" # UTC 8点 = 北京时间16点

jobs:
  beijing-morning:
    if: github.event.schedule == '0 0 * * *'
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.BEIJING_EMAILS }}
          sender_name: "北京天气早报"
          email_subject: "🌅 北京早安天气"

  shanghai-noon:
    if: github.event.schedule == '0 4 * * *'
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "上海"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.SHANGHAI_EMAILS }}
          sender_name: "上海天气播报"
          email_subject: "🏙️ 上海午间天气"

  shenzhen-evening:
    if: github.event.schedule == '0 8 * * *'
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "440300" # 深圳城市编码
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.SHENZHEN_EMAILS }}
          sender_name: "深圳天气晚报"
          email_subject: "🌆 深圳傍晚天气"
```

### 4. 国内外城市组合

```yaml
name: Global Weather Network

on:
  schedule:
    - cron: "0 6 * * *" # 每天早上6点

jobs:
  # 国内城市使用高德地图
  domestic-cities:
    strategy:
      matrix:
        city:
          [
            { name: "北京", code: "110000", emails: "beijing@company.com" },
            { name: "上海", code: "310000", emails: "shanghai@company.com" },
            { name: "深圳", code: "440300", emails: "shenzhen@company.com" },
            { name: "杭州", code: "330100", emails: "hangzhou@company.com" },
          ]
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          weather_provider: "amap"
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: ${{ matrix.city.code }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ matrix.city.emails }}
          sender_name: "${{ matrix.city.name }}天气助手"

  # 国外城市使用OpenWeatherMap
  international-cities:
    strategy:
      matrix:
        city:
          [
            { name: "New York,US", emails: "ny@company.com" },
            { name: "London,UK", emails: "london@company.com" },
            { name: "Tokyo,JP", emails: "tokyo@company.com" },
            { name: "Sydney,AU", emails: "sydney@company.com" },
          ]
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          weather_provider: "openweather"
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: ${{ matrix.city.name }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ matrix.city.emails }}
          sender_name: "Global Weather Service"
```

## 🎛️ 高级配置示例

### 5. 动态参数配置

```yaml
name: Dynamic Weather Service

on:
  workflow_dispatch:
    inputs:
      cities:
        description: "城市列表(JSON格式)"
        required: true
        default: '[{"name":"北京","code":"110000"},{"name":"上海","code":"310000"}]'
      notification_time:
        description: "通知类型"
        type: choice
        options:
          - morning
          - noon
          - evening
        default: "morning"
      provider:
        description: "数据源"
        type: choice
        options:
          - amap
          - openweather
        default: "amap"

jobs:
  dynamic-weather:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        city: ${{ fromJson(github.event.inputs.cities) }}

    steps:
      - name: Set notification content
        id: content
        run: |
          case "${{ github.event.inputs.notification_time }}" in
            morning)
              echo "subject=🌅 早安天气" >> $GITHUB_OUTPUT
              echo "sender=早安天气助手" >> $GITHUB_OUTPUT
              ;;
            noon)
              echo "subject=☀️ 午间天气" >> $GITHUB_OUTPUT
              echo "sender=午间天气播报" >> $GITHUB_OUTPUT
              ;;
            evening)
              echo "subject=🌆 晚安天气" >> $GITHUB_OUTPUT
              echo "sender=晚安天气助手" >> $GITHUB_OUTPUT
              ;;
          esac

      - uses: xun082/weather-notification-action@v2
        with:
          weather_provider: ${{ github.event.inputs.provider }}
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: ${{ matrix.city.code || matrix.city.name }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.DYNAMIC_EMAILS }}
          sender_name: ${{ steps.content.outputs.sender }}
          email_subject: "${{ steps.content.outputs.subject }} - ${{ matrix.city.name }}"
```

### 6. 条件触发示例

```yaml
name: Conditional Weather Alerts

on:
  schedule:
    - cron: "0 */6 * * *" # 每6小时检查一次
  workflow_dispatch:

jobs:
  weather-check:
    runs-on: ubuntu-latest
    outputs:
      weather_data: ${{ steps.weather.outputs.weather_data }}
      should_alert: ${{ steps.check.outputs.alert }}

    steps:
      - name: Get Weather Data
        id: weather
        uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "admin@company.com"

      - name: Check Weather Conditions
        id: check
        run: |
          weather_data='${{ steps.weather.outputs.weather_data }}'
          temperature=$(echo $weather_data | jq -r '.temperature')

          # 如果温度低于0度或高于35度，发送警报
          if [ $temperature -lt 0 ] || [ $temperature -gt 35 ]; then
            echo "alert=true" >> $GITHUB_OUTPUT
          else
            echo "alert=false" >> $GITHUB_OUTPUT
          fi

  extreme-weather-alert:
    needs: weather-check
    if: needs.weather-check.outputs.should_alert == 'true'
    runs-on: ubuntu-latest

    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.ALERT_EMAILS }}
          sender_name: "⚠️ 天气预警系统"
          email_subject: "🚨 极端天气警报 - 北京"
```

## 📧 不同邮件服务示例

### 7. 使用 QQ 邮箱

```yaml
name: QQ Mail Weather

on:
  schedule:
    - cron: "0 9 * * *"

jobs:
  qq-weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "广州"
          smtp_host: "smtp.qq.com"
          smtp_port: "587"
          smtp_user: ${{ secrets.QQ_EMAIL }}
          smtp_pass: ${{ secrets.QQ_AUTH_CODE }} # QQ邮箱授权码
          recipient_emails: "friends@qq.com,family@qq.com"
          sender_name: "QQ天气助手"
```

### 8. 使用 163 邮箱

```yaml
name: 163 Mail Weather

on:
  schedule:
    - cron: "0 7 * * *"

jobs:
  netease-weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "南京"
          smtp_host: "smtp.163.com"
          smtp_port: "587"
          smtp_user: ${{ secrets.NETEASE_EMAIL }}
          smtp_pass: ${{ secrets.NETEASE_PASSWORD }}
          recipient_emails: "colleagues@163.com"
          sender_name: "网易天气播报"
```

### 9. 使用 Outlook/Hotmail

```yaml
name: Outlook Weather

on:
  schedule:
    - cron: "0 10 * * *"

jobs:
  outlook-weather:
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          weather_provider: "openweather"
          city: "Seattle,US"
          smtp_host: "smtp-mail.outlook.com"
          smtp_port: "587"
          smtp_user: ${{ secrets.OUTLOOK_EMAIL }}
          smtp_pass: ${{ secrets.OUTLOOK_PASSWORD }}
          recipient_emails: "team@outlook.com"
          sender_name: "Outlook Weather Bot"
```

## 🔄 错误处理和重试示例

### 10. 带错误处理的健壮配置

```yaml
name: Robust Weather Service

on:
  schedule:
    - cron: "0 8 * * *"
  workflow_dispatch:

jobs:
  weather-with-fallback:
    runs-on: ubuntu-latest

    steps:
      # 尝试使用高德地图
      - name: Try AMap Weather
        id: amap
        uses: xun082/weather-notification-action@v2
        continue-on-error: true
        with:
          weather_provider: "amap"
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.RECIPIENT_EMAILS }}

      # 如果高德地图失败，使用OpenWeatherMap作为备用
      - name: Fallback to OpenWeatherMap
        if: steps.amap.outputs.status != 'success'
        uses: xun082/weather-notification-action@v2
        with:
          weather_provider: "openweather"
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: "Beijing"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.RECIPIENT_EMAILS }}
          sender_name: "备用天气服务"
          email_subject: "📡 备用数据源天气预报"

      # 发送执行状态通知
      - name: Send Status Notification
        if: always()
        run: |
          if [ "${{ steps.amap.outputs.status }}" == "success" ]; then
            echo "高德地图天气服务正常运行"
          else
            echo "高德地图服务异常，已切换到备用数据源"
          fi
```

## 🧪 测试和调试示例

### 11. 测试工作流

```yaml
name: Test Weather Action

on:
  workflow_dispatch:
    inputs:
      test_mode:
        description: "测试模式"
        type: choice
        options:
          - quick
          - full
          - stress
        default: "quick"

jobs:
  quick-test:
    if: github.event.inputs.test_mode == 'quick'
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "110000"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "test@example.com"
          sender_name: "测试"

  full-test:
    if: github.event.inputs.test_mode == 'full'
    strategy:
      matrix:
        provider: ["amap", "openweather"]
        city: ["北京", "Shanghai", "London,UK"]
    runs-on: ubuntu-latest
    steps:
      - uses: xun082/weather-notification-action@v2
        continue-on-error: true
        with:
          weather_provider: ${{ matrix.provider }}
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          openweather_api_key: ${{ secrets.OPENWEATHER_API_KEY }}
          city: ${{ matrix.city }}
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "test@example.com"

  stress-test:
    if: github.event.inputs.test_mode == 'stress'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        run: [1, 2, 3, 4, 5]
    steps:
      - uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "Beijing"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: "stress-test@example.com"
          sender_name: "压力测试 #${{ matrix.run }}"
```

## 📊 监控和日志示例

### 12. 带监控的生产环境配置

```yaml
name: Production Weather Service

on:
  schedule:
    - cron: "0 8 * * *" # 每天早上8点

jobs:
  weather-service:
    runs-on: ubuntu-latest

    steps:
      - name: Send Weather Notification
        id: weather
        uses: xun082/weather-notification-action@v2
        with:
          amap_api_key: ${{ secrets.AMAP_API_KEY }}
          city: "北京"
          smtp_user: ${{ secrets.SMTP_USER }}
          smtp_pass: ${{ secrets.SMTP_PASS }}
          recipient_emails: ${{ secrets.RECIPIENT_EMAILS }}

      - name: Log Execution Results
        run: |
          echo "## 📊 执行报告" >> $GITHUB_STEP_SUMMARY
          echo "- **状态**: ${{ steps.weather.outputs.status }}" >> $GITHUB_STEP_SUMMARY
          echo "- **消息**: ${{ steps.weather.outputs.message }}" >> $GITHUB_STEP_SUMMARY
          echo "- **收件人数量**: ${{ steps.weather.outputs.recipients_count }}" >> $GITHUB_STEP_SUMMARY
          echo "- **执行时间**: $(date)" >> $GITHUB_STEP_SUMMARY

      - name: Send Monitoring Alert
        if: steps.weather.outputs.status != 'success'
        run: |
          curl -X POST "${{ secrets.WEBHOOK_URL }}" \
            -H "Content-Type: application/json" \
            -d '{
              "text": "🚨 天气通知服务执行失败",
              "attachments": [{
                "color": "danger",
                "fields": [{
                  "title": "错误信息",
                  "value": "${{ steps.weather.outputs.message }}"
                }]
              }]
            }'
```

这些示例涵盖了从简单到复杂的各种使用场景，可以根据具体需求选择合适的配置方式。
