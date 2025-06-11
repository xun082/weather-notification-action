const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 配置信息
const config = {
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  weather: {
    provider: process.env.WEATHER_PROVIDER || "amap", // 'amap' 或 'openweather'
    amapApiKey: process.env.AMAP_API_KEY,
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    city: process.env.CITY || "Beijing",
    cityCode: process.env.CITY_CODE || "110000", // 高德地图城市编码
  },
  emails: process.env.RECIPIENT_EMAILS || "",
};

// 城市编码映射表（常用城市）
const cityCodeMap = {
  // 直辖市
  北京: "110000",
  Beijing: "110000",
  上海: "310000",
  Shanghai: "310000",
  天津: "120000",
  Tianjin: "120000",
  重庆: "500000",
  Chongqing: "500000",

  // 省会城市
  广州: "440100",
  Guangzhou: "440100",
  深圳: "440300",
  Shenzhen: "440300",
  杭州: "330100",
  Hangzhou: "330100",
  南京: "320100",
  Nanjing: "320100",
  武汉: "420100",
  Wuhan: "420100",
  成都: "510100",
  Chengdu: "510100",
  西安: "610100",
  "Xi'an": "610100",
  郑州: "410100",
  Zhengzhou: "410100",
  济南: "370100",
  Jinan: "370100",
  沈阳: "210100",
  Shenyang: "210100",
  长春: "220100",
  Changchun: "220100",
  哈尔滨: "230100",
  Harbin: "230100",
  石家庄: "130100",
  Shijiazhuang: "130100",
  太原: "140100",
  Taiyuan: "140100",
  呼和浩特: "150100",
  Hohhot: "150100",
  南宁: "450100",
  Nanning: "450100",
  昆明: "530100",
  Kunming: "530100",
  贵阳: "520100",
  Guiyang: "520100",
  拉萨: "540100",
  Lhasa: "540100",
  兰州: "620100",
  Lanzhou: "620100",
  西宁: "630100",
  Xining: "630100",
  银川: "640100",
  Yinchuan: "640100",
  乌鲁木齐: "650100",
  Urumqi: "650100",
  海口: "460100",
  Haikou: "460100",
  福州: "350100",
  Fuzhou: "350100",
  长沙: "430100",
  Changsha: "430100",
  南昌: "360100",
  Nanchang: "360100",
  合肥: "340100",
  Hefei: "340100",
};

// 获取城市编码
function getCityCode(cityName) {
  // 如果直接提供了城市编码
  if (/^\d{6}$/.test(cityName)) {
    return cityName;
  }

  // 从映射表中查找
  const code = cityCodeMap[cityName];
  if (code) {
    return code;
  }

  // 默认返回北京编码
  console.warn(`未找到城市 "${cityName}" 的编码，使用默认城市北京`);
  return "110000";
}

// 使用高德地图API获取天气信息
async function getAmapWeatherData(cityCode) {
  try {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${config.weather.amapApiKey}&city=${cityCode}&extensions=all`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`高德地图API错误: ${data.info}`);
    }

    const live = data.lives[0];
    const forecast = data.forecasts && data.forecasts[0];

    return {
      provider: "amap",
      city: live.city,
      province: live.province,
      adcode: live.adcode,
      temperature: parseInt(live.temperature),
      temperatureFloat: parseFloat(live.temperature_float),
      humidity: parseInt(live.humidity),
      humidityFloat: parseFloat(live.humidity_float),
      weather: live.weather,
      windDirection: live.winddirection,
      windPower: live.windpower,
      reportTime: live.reporttime,
      forecast: forecast ? forecast.casts : null,
    };
  } catch (error) {
    console.error("获取高德地图天气数据失败:", error.message);
    throw error;
  }
}

// 使用OpenWeatherMap API获取天气信息
async function getOpenWeatherData(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.weather.openWeatherApiKey}&units=metric&lang=zh_cn`;
    const response = await axios.get(url);
    const data = response.data;

    return {
      provider: "openweather",
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("zh-CN"),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("zh-CN"),
    };
  } catch (error) {
    console.error("获取OpenWeatherMap天气数据失败:", error.message);
    throw error;
  }
}

// 统一的天气数据获取接口
async function getWeatherData(city) {
  if (config.weather.provider === "amap") {
    if (!config.weather.amapApiKey) {
      throw new Error("请设置 AMAP_API_KEY 环境变量");
    }
    const cityCode = getCityCode(city);
    return await getAmapWeatherData(cityCode);
  } else if (config.weather.provider === "openweather") {
    if (!config.weather.openWeatherApiKey) {
      throw new Error("请设置 OPENWEATHER_API_KEY 环境变量");
    }
    return await getOpenWeatherData(city);
  } else {
    throw new Error(
      '不支持的天气数据提供商，请设置 WEATHER_PROVIDER 为 "amap" 或 "openweather"'
    );
  }
}

// 生成高德地图天气邮件HTML内容
function generateAmapWeatherEmailHTML(weatherData) {
  const currentDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 生成未来几天的天气预报HTML
  let forecastHTML = "";
  if (weatherData.forecast && weatherData.forecast.length > 0) {
    forecastHTML = `
      <div class="forecast-section">
        <h2>📅 未来天气预报</h2>
        <div class="forecast-grid">
          ${weatherData.forecast
            .slice(0, 4)
            .map(
              (day) => `
            <div class="forecast-item">
              <div class="forecast-date">${day.date}</div>
              <div class="forecast-weather">${day.dayweather}</div>
              <div class="forecast-temp">${day.daytemp}°C / ${day.nighttemp}°C</div>
              <div class="forecast-wind">${day.daywind} ${day.daypower}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>天气预报</title>
        <style>
            body {
                font-family: 'Microsoft YaHei', 'PingFang SC', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f7fa;
            }
            .weather-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 40px 30px;
                color: white;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
                position: relative;
                overflow: hidden;
            }
            .weather-card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: rotate(45deg);
                animation: shine 3s infinite;
            }
            @keyframes shine {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
            .weather-card h1 {
                margin: 0 0 15px 0;
                font-size: 2.8em;
                font-weight: 300;
                position: relative;
                z-index: 1;
            }
            .weather-card .date {
                font-size: 1.2em;
                opacity: 0.9;
                margin-bottom: 25px;
                position: relative;
                z-index: 1;
            }
            .weather-card .location {
                font-size: 1.4em;
                margin-bottom: 25px;
                opacity: 0.95;
                position: relative;
                z-index: 1;
            }
            .temperature-section {
                position: relative;
                z-index: 1;
            }
            .temperature {
                font-size: 4.5em;
                font-weight: 100;
                margin: 25px 0;
                text-shadow: 0 0 20px rgba(255,255,255,0.3);
            }
            .description {
                font-size: 1.6em;
                margin-bottom: 20px;
                font-weight: 300;
            }
            .report-time {
                font-size: 0.9em;
                opacity: 0.8;
                margin-top: 15px;
            }
            .weather-details {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .weather-details h2 {
                color: #667eea;
                margin-top: 0;
                margin-bottom: 25px;
                text-align: center;
                font-size: 1.5em;
            }
            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
                border-radius: 12px;
                border-left: 5px solid #667eea;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .detail-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
            }
            .detail-label {
                font-weight: 600;
                color: #555;
                font-size: 1.05em;
            }
            .detail-value {
                font-weight: 600;
                color: #333;
                font-size: 1.1em;
            }
            .forecast-section {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .forecast-section h2 {
                color: #667eea;
                margin-top: 0;
                margin-bottom: 25px;
                text-align: center;
                font-size: 1.5em;
            }
            .forecast-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                gap: 15px;
            }
            .forecast-item {
                text-align: center;
                padding: 20px 15px;
                background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
                border-radius: 12px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            .forecast-item:hover {
                border-color: #667eea;
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
            }
            .forecast-date {
                font-weight: 600;
                color: #667eea;
                margin-bottom: 8px;
                font-size: 0.95em;
            }
            .forecast-weather {
                font-size: 1.1em;
                margin-bottom: 8px;
                color: #333;
            }
            .forecast-temp {
                font-weight: 600;
                color: #e74c3c;
                margin-bottom: 5px;
                font-size: 1.05em;
            }
            .forecast-wind {
                font-size: 0.9em;
                color: #666;
            }
            .provider-info {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                margin-bottom: 20px;
            }
            .provider-info h3 {
                margin: 0 0 10px 0;
                font-size: 1.3em;
            }
            .provider-info p {
                margin: 5px 0;
                opacity: 0.9;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding: 25px;
                color: #666;
                font-size: 14px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            }
            .footer p {
                margin: 8px 0;
            }
            .emoji {
                font-size: 1.2em;
            }
        </style>
    </head>
    <body>
        <div class="weather-card">
            <h1>🌤️ 天气预报</h1>
            <div class="date">${currentDate}</div>
            <div class="location">📍 ${weatherData.province} ${weatherData.city}</div>
            <div class="temperature-section">
                <div class="temperature">${weatherData.temperature}°C</div>
                <div class="description">${weatherData.weather}</div>
            </div>
            <div class="report-time">数据更新时间: ${weatherData.reportTime}</div>
        </div>
        
        <div class="weather-details">
            <h2>📊 详细信息</h2>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">🌡️ 实时温度</span>
                    <span class="detail-value">${weatherData.temperatureFloat}°C</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💧 湿度</span>
                    <span class="detail-value">${weatherData.humidityFloat}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🧭 风向</span>
                    <span class="detail-value">${weatherData.windDirection}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💨 风力</span>
                    <span class="detail-value">${weatherData.windPower}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📮 行政编码</span>
                    <span class="detail-value">${weatherData.adcode}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">☁️ 天气状况</span>
                    <span class="detail-value">${weatherData.weather}</span>
                </div>
            </div>
        </div>
        
        ${forecastHTML}
        
        <div class="provider-info">
            <h3>🗺️ 数据来源</h3>
            <p><strong>高德地图天气API</strong></p>
            <p>准确 · 实时 · 可靠</p>
        </div>
        
        <div class="footer">
            <p><span class="emoji">🤖</span> 由 GitHub Actions 自动发送</p>
            <p><span class="emoji">📡</span> 数据来源: 高德地图开放平台</p>
            <p><span class="emoji">🌈</span> 祝您度过美好的一天！</p>
        </div>
    </body>
    </html>
  `;
}

// 生成OpenWeatherMap天气邮件HTML内容
function generateOpenWeatherEmailHTML(weatherData) {
  const currentDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>天气预报</title>
        <style>
            body {
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .weather-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                padding: 30px;
                color: white;
                text-align: center;
                margin-bottom: 20px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .weather-card h1 {
                margin: 0 0 10px 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            .weather-card .date {
                font-size: 1.1em;
                opacity: 0.9;
                margin-bottom: 20px;
            }
            .weather-card .location {
                font-size: 1.3em;
                margin-bottom: 20px;
                opacity: 0.9;
            }
            .temperature {
                font-size: 4em;
                font-weight: 100;
                margin: 20px 0;
            }
            .description {
                font-size: 1.5em;
                margin-bottom: 30px;
                text-transform: capitalize;
            }
            .weather-details {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .weather-details h2 {
                color: #667eea;
                margin-top: 0;
                margin-bottom: 20px;
                text-align: center;
            }
            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .detail-label {
                font-weight: 600;
                color: #555;
            }
            .detail-value {
                font-weight: 500;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="weather-card">
            <h1>☀️ 天气预报</h1>
            <div class="date">${currentDate}</div>
            <div class="location">📍 ${weatherData.city}, ${weatherData.country}</div>
            <div class="temperature">${weatherData.temperature}°C</div>
            <div class="description">${weatherData.description}</div>
        </div>
        
        <div class="weather-details">
            <h2>📊 详细信息</h2>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">🌡️ 体感温度</span>
                    <span class="detail-value">${weatherData.feelsLike}°C</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💧 湿度</span>
                    <span class="detail-value">${weatherData.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🌪️ 风速</span>
                    <span class="detail-value">${weatherData.windSpeed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📊 气压</span>
                    <span class="detail-value">${weatherData.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">👁️ 能见度</span>
                    <span class="detail-value">${weatherData.visibility} km</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🌅 日出</span>
                    <span class="detail-value">${weatherData.sunrise}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🌇 日落</span>
                    <span class="detail-value">${weatherData.sunset}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🤖 由 GitHub Actions 自动发送 | 数据来源: OpenWeatherMap</p>
            <p>祝您度过美好的一天！ 🌈</p>
        </div>
    </body>
    </html>
  `;
}

// 统一的邮件HTML生成接口
function generateWeatherEmailHTML(weatherData) {
  if (weatherData.provider === "amap") {
    return generateAmapWeatherEmailHTML(weatherData);
  } else if (weatherData.provider === "openweather") {
    return generateOpenWeatherEmailHTML(weatherData);
  } else {
    throw new Error("不支持的天气数据提供商");
  }
}

// 发送邮件
async function sendWeatherEmail(emailList, weatherData) {
  try {
    const transporter = nodemailer.createTransporter(config.smtp);

    const providerName =
      weatherData.provider === "amap" ? "高德地图" : "OpenWeatherMap";
    const cityName =
      weatherData.provider === "amap"
        ? `${weatherData.province}${weatherData.city}`
        : weatherData.city;

    const mailOptions = {
      from: `"天气通知助手" <${config.smtp.auth.user}>`,
      to: emailList.join(", "),
      subject: `🌤️ ${cityName}天气预报 - ${new Date().toLocaleDateString(
        "zh-CN"
      )} (${providerName})`,
      html: generateWeatherEmailHTML(weatherData),
      attachments: [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ 邮件发送成功:", info.messageId);
    console.log("📧 收件人列表:", emailList.join(", "));
    console.log("🏙️ 天气城市:", cityName);
    console.log("🌡️ 当前温度:", `${weatherData.temperature}°C`);
    console.log("📊 数据提供商:", providerName);

    return info;
  } catch (error) {
    console.error("❌ 发送邮件失败:", error.message);
    throw error;
  }
}

// 验证配置信息
function validateConfig() {
  const errors = [];

  // 验证邮件配置
  if (!config.smtp.auth.user || !config.smtp.auth.pass) {
    errors.push("请设置 SMTP_USER 和 SMTP_PASS 环境变量");
  }

  if (!config.emails) {
    errors.push("请设置 RECIPIENT_EMAILS 环境变量");
  }

  // 验证天气API配置
  if (config.weather.provider === "amap" && !config.weather.amapApiKey) {
    errors.push("使用高德地图API时，请设置 AMAP_API_KEY 环境变量");
  }

  if (
    config.weather.provider === "openweather" &&
    !config.weather.openWeatherApiKey
  ) {
    errors.push(
      "使用OpenWeatherMap API时，请设置 OPENWEATHER_API_KEY 环境变量"
    );
  }

  if (!["amap", "openweather"].includes(config.weather.provider)) {
    errors.push('WEATHER_PROVIDER 必须设置为 "amap" 或 "openweather"');
  }

  return errors;
}

// 显示城市编码信息
function displayCityCodeInfo() {
  console.log("🏙️ 支持的城市及编码:");
  console.log("=====================================");

  const cities = Object.keys(cityCodeMap);
  const chineseCities = cities.filter((city) => /[\u4e00-\u9fa5]/.test(city));
  const englishCities = cities.filter((city) => !/[\u4e00-\u9fa5]/.test(city));

  console.log("📍 中文城市名:");
  chineseCities.forEach((city) => {
    console.log(`   ${city}: ${cityCodeMap[city]}`);
  });

  console.log("\n📍 英文城市名:");
  englishCities.forEach((city) => {
    console.log(`   ${city}: ${cityCodeMap[city]}`);
  });

  console.log("\n💡 使用说明:");
  console.log("   - 可以使用城市名称（中文或英文）");
  console.log("   - 可以直接使用6位数字的城市编码");
  console.log("   - 如果城市不在列表中，将默认使用北京(110000)");
  console.log("=====================================\n");
}

// 主函数
async function main() {
  try {
    console.log("🚀 开始执行天气通知任务...");
    console.log(
      `📡 数据提供商: ${
        config.weather.provider === "amap" ? "高德地图" : "OpenWeatherMap"
      }`
    );

    // 验证配置
    const configErrors = validateConfig();
    if (configErrors.length > 0) {
      console.error("❌ 配置验证失败:");
      configErrors.forEach((error) => console.error(`   - ${error}`));
      process.exit(1);
    }

    // 显示城市编码信息（仅当使用高德地图API时）
    if (config.weather.provider === "amap") {
      displayCityCodeInfo();
    }

    // 解析邮箱列表
    const emailList = config.emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    if (emailList.length === 0) {
      throw new Error("没有有效的邮箱地址");
    }

    console.log(`📍 获取 ${config.weather.city} 的天气信息...`);
    const weatherData = await getWeatherData(config.weather.city);

    console.log(`📧 发送天气信息到 ${emailList.length} 个邮箱...`);
    await sendWeatherEmail(emailList, weatherData);

    console.log("✅ 天气通知任务执行成功！");
    console.log("🎉 所有收件人都已收到最新的天气信息！");
  } catch (error) {
    console.error("❌ 任务执行失败:", error.message);

    // 提供调试信息
    if (error.message.includes("API")) {
      console.error("💡 API调用失败，请检查:");
      console.error("   - API密钥是否正确");
      console.error("   - 网络连接是否正常");
      console.error("   - API调用次数是否超限");
    }

    if (error.message.includes("SMTP") || error.message.includes("邮件")) {
      console.error("💡 邮件发送失败，请检查:");
      console.error("   - SMTP服务器配置是否正确");
      console.error("   - 邮箱账号密码是否正确");
      console.error("   - 是否开启了邮箱的SMTP服务");
    }

    process.exit(1);
  }
}

// 导出工具函数，便于测试和其他模块使用
module.exports = {
  getWeatherData,
  getAmapWeatherData,
  getOpenWeatherData,
  generateWeatherEmailHTML,
  generateAmapWeatherEmailHTML,
  generateOpenWeatherEmailHTML,
  sendWeatherEmail,
  getCityCode,
  cityCodeMap,
  validateConfig,
  displayCityCodeInfo,
  main,
};

// 执行主函数
if (require.main === module) {
  main();
}
