// 获取实时天气数据
async function fetchLiveWeather(city, amapApiKey) {
  const liveUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${amapApiKey}&city=${city}&extensions=base`;
  console.log(
    `🌐 请求高德地图实时天气API: ${liveUrl.replace(amapApiKey, "***")}`
  );

  const response = await fetch(liveUrl);
  if (!response.ok) {
    throw new Error(`HTTP错误: ${response.status}`);
  }

  const data = await response.json();
  console.log(`📊 实时天气API响应状态: ${data.status}`);

  if (data.status !== "1") {
    throw new Error(`高德地图实时天气API错误: ${data.info || "未知错误"}`);
  }

  if (!data.lives || !Array.isArray(data.lives) || data.lives.length === 0) {
    throw new Error("高德地图API返回数据格式错误: lives数组为空或不存在");
  }

  const live = data.lives[0];
  if (!live.city || live.temperature === undefined) {
    throw new Error("高德地图API返回数据不完整: 缺少必要字段");
  }

  console.log(`🌡️ 实时天气数据获取成功: ${live.city} ${live.temperature}°C`);
  return live;
}

// 获取预报天气数据
async function fetchForecastWeather(city, amapApiKey) {
  const forecastUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${amapApiKey}&city=${city}&extensions=all`;
  console.log(
    `🌐 请求高德地图预报天气API: ${forecastUrl.replace(amapApiKey, "***")}`
  );

  const response = await fetch(forecastUrl);
  if (!response.ok) {
    throw new Error(`HTTP错误: ${response.status}`);
  }

  const data = await response.json();
  console.log(`📊 预报天气API响应状态: ${data.status}`);

  if (data.status !== "1") {
    throw new Error(`高德地图预报天气API错误: ${data.info || "未知错误"}`);
  }

  if (
    !data.forecasts ||
    !Array.isArray(data.forecasts) ||
    data.forecasts.length === 0
  ) {
    throw new Error(
      "高德地图预报API返回数据格式错误: forecasts数组为空或不存在"
    );
  }

  return data.forecasts[0];
}

// 使用高德地图API获取天气信息
async function getWeatherData(city, amapApiKey) {
  if (!amapApiKey) {
    throw new Error("请提供高德地图API密钥");
  }

  if (!city) {
    throw new Error("请提供城市名称或编码");
  }

  console.log(`🏙️ 查询城市: ${city}`);

  try {
    // 获取实时天气数据和预报数据
    const [liveData, forecastData] = await Promise.allSettled([
      fetchLiveWeather(city, amapApiKey),
      fetchForecastWeather(city, amapApiKey),
    ]);

    // 处理实时天气数据（必需）
    if (liveData.status === "rejected") {
      throw liveData.reason;
    }

    const weatherInfo = liveData.value;

    // 处理预报数据（可选）
    let forecast = null;
    if (forecastData.status === "fulfilled") {
      forecast = forecastData.value;
      console.log(
        `📅 预报天气数据获取成功: ${forecast?.casts?.length || 0} 天预报`
      );
    } else {
      console.warn(
        "获取预报天气数据失败，将只返回实时数据:",
        forecastData.reason?.message
      );
    }

    return {
      provider: "amap",
      city: weatherInfo.city,
      province: weatherInfo.province,
      adcode: weatherInfo.adcode,
      temperature: parseInt(weatherInfo.temperature),
      temperatureFloat: parseFloat(
        weatherInfo.temperature_float || weatherInfo.temperature
      ),
      humidity: parseInt(weatherInfo.humidity || 0),
      humidityFloat: parseFloat(
        weatherInfo.humidity_float || weatherInfo.humidity || 0
      ),
      weather: weatherInfo.weather,
      windDirection: weatherInfo.winddirection,
      windPower: weatherInfo.windpower,
      reportTime: weatherInfo.reporttime,
      forecast: forecast ? forecast.casts : null,
    };
  } catch (error) {
    console.error("❌ 获取高德地图天气数据失败:", error.message);
    throw error;
  }
}

module.exports = {
  getWeatherData,
};
