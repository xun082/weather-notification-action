function generateWeatherEmailHTML(weatherData) {
  // 生成预报信息HTML
  const forecastHTML = generateForecastHTML(weatherData.forecast);

  return `<!DOCTYPE html>
  <html lang="zh-CN">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🌤️ ${weatherData.province}${weatherData.city}天气预报</title>
      <style>
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
              background: white;
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              margin: 20px 0;
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f0f0f0;
          }
          .header h1 {
              color: #2c3e50;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
          }
          .location {
              color: #7f8c8d;
              font-size: 16px;
              margin-top: 5px;
          }
          .current-weather {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: linear-gradient(135deg, #74b9ff, #0984e3);
              color: white;
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 25px;
          }
          .current-info {
              flex: 1;
          }
          .temperature {
              font-size: 48px;
              font-weight: bold;
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .weather-desc {
              font-size: 18px;
              margin: 5px 0;
              opacity: 0.9;
          }
          .weather-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 15px;
              margin: 25px 0;
          }
          .detail-item {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border-left: 4px solid #3498db;
          }
          .detail-label {
              font-size: 12px;
              color: #7f8c8d;
              text-transform: uppercase;
              margin-bottom: 5px;
          }
          .detail-value {
              font-size: 18px;
              font-weight: bold;
              color: #2c3e50;
          }
          .forecast-section {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
          }
          .forecast-section h3 {
              color: #2c3e50;
              text-align: center;
              margin-bottom: 20px;
          }
          .forecast-container {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
              justify-content: space-around;
          }
          .forecast-item {
              background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
              padding: 15px;
              border-radius: 10px;
              text-align: center;
              flex: 1;
              min-width: 120px;
              color: #2c3e50;
          }
          .forecast-date {
              margin-bottom: 10px;
          }
          .date {
              font-size: 14px;
              font-weight: bold;
          }
          .weekday {
              font-size: 12px;
              opacity: 0.8;
          }
          .temp-range {
              font-size: 16px;
              font-weight: bold;
              margin: 5px 0;
          }
          .wind-info {
              font-size: 12px;
              opacity: 0.8;
          }
          .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #7f8c8d;
              font-size: 14px;
          }
          .report-time {
              background: #e8f4fd;
              padding: 10px;
              border-radius: 6px;
              margin: 15px 0;
              text-align: center;
              font-size: 14px;
              color: #2980b9;
          }
          @media (max-width: 480px) {
              .current-weather {
                  flex-direction: column;
                  text-align: center;
              }
              .weather-details {
                  grid-template-columns: 1fr;
              }
              .forecast-container {
                  flex-direction: column;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🌤️ ${weatherData.province}${weatherData.city}天气预报</h1>
              <div class="location">📍 ${weatherData.city} (${weatherData.adcode})</div>
          </div>
          
          <div class="current-weather">
              <div class="current-info">
                  <div class="temperature">${weatherData.temperature}°C</div>
                  <div class="weather-desc">☁️ ${weatherData.weather}</div>
              </div>
          </div>
          
          <div class="weather-details">
              <div class="detail-item">
                  <div class="detail-label">💧 湿度</div>
                  <div class="detail-value">${weatherData.humidity}%</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">🌬️ 风向</div>
                  <div class="detail-value">${weatherData.windDirection}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">💨 风力</div>
                  <div class="detail-value">${weatherData.windPower}级</div>
              </div>
          </div>
          
          <div class="report-time">
              ⏰ 数据更新时间: ${weatherData.reportTime}
          </div>
          
          ${forecastHTML}
      </div>
      
      <div class="footer">
          <p>🤖 由 GitHub Actions 自动发送 | 数据来源: 高德地图</p>
          <p>祝您度过美好的一天！ 🌈</p>
      </div>
  </body>
  </html>`;
}

// 生成预报信息HTML的辅助函数
function generateForecastHTML(forecast) {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return "";
  }

  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  let forecastHTML = `
      <div class="forecast-section">
          <h3>📅 未来3天天气预报</h3>
          <div class="forecast-container">`;

  forecast.slice(0, 3).forEach((day) => {
    const date = new Date(day.date);
    const weekday = weekdays[date.getDay()];

    forecastHTML += `
              <div class="forecast-item">
                  <div class="forecast-date">
                      <div class="date">${day.date}</div>
                      <div class="weekday">${weekday}</div>
                  </div>
                  <div class="forecast-weather">
                      <div class="weather-desc">${day.dayweather}</div>
                      <div class="temp-range">${day.nighttemp}°C - ${day.daytemp}°C</div>
                      <div class="wind-info">${day.daywind} ${day.daypower}级</div>
                  </div>
              </div>`;
  });

  forecastHTML += `
          </div>
      </div>`;

  return forecastHTML;
}

module.exports = {
  generateWeatherEmailHTML,
};
