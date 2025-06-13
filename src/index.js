const core = require("@actions/core");
const {
  getWeatherData,
  getCityCode,
  cityCodeMap,
} = require("./weather-notification");

// GitHub Action 入口文件
async function run() {
  try {
    console.log("🚀 Weather Notification Action 开始执行...");

    // 从 GitHub Action inputs 读取参数
    const inputs = {
      amapApiKey: core.getInput("amap_api_key"),
      city: core.getInput("city") || "Beijing",
      smtpHost: core.getInput("smtp_host") || "smtp.gmail.com",
      smtpPort: core.getInput("smtp_port") || "587",
      smtpUser: core.getInput("smtp_user"),
      smtpPass: core.getInput("smtp_pass"),
      recipientEmails: core.getInput("recipient_emails"),
      emailSubject: core.getInput("email_subject"),
      senderName: core.getInput("sender_name") || "天气通知助手",
    };

    // 验证必需参数
    if (!inputs.smtpUser || !inputs.smtpPass) {
      throw new Error("❌ 邮件配置不完整：请提供 smtp_user 和 smtp_pass");
    }

    if (!inputs.recipientEmails) {
      throw new Error("❌ 收件人邮箱不能为空：请提供 recipient_emails");
    }

    // 验证高德地图API配置
    if (!inputs.amapApiKey) {
      throw new Error("❌ 请提供 amap_api_key");
    }

    // 设置环境变量供主模块使用
    process.env.AMAP_API_KEY = inputs.amapApiKey;
    process.env.CITY = inputs.city;
    process.env.SMTP_HOST = inputs.smtpHost;
    process.env.SMTP_PORT = inputs.smtpPort;
    process.env.SMTP_USER = inputs.smtpUser;
    process.env.SMTP_PASS = inputs.smtpPass;
    process.env.RECIPIENT_EMAILS = inputs.recipientEmails;

    console.log(`📡 数据提供商: 高德地图`);
    console.log(`📍 查询城市: ${inputs.city}`);

    // 显示城市编码信息
    const cityCode = getCityCode(inputs.city);
    console.log(`🏙️ 城市编码: ${cityCode}`);

    if (/^\d{6}$/.test(inputs.city)) {
      const cities = Object.keys(cityCodeMap).filter(
        (city) => cityCodeMap[city] === inputs.city
      );
      if (cities.length > 0) {
        console.log(`📍 对应城市: ${cities.join(", ")}`);
      }
    }

    // 解析邮箱列表
    const emailList = inputs.recipientEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    console.log(`📧 收件人数量: ${emailList.length}`);

    // 获取天气数据
    console.log("🌤️ 正在获取天气信息...");
    const weatherData = await getWeatherData(inputs.city);

    // 发送邮件
    console.log("📬 正在发送邮件...");

    // 构建邮件配置
    const smtpConfig = {
      host: inputs.smtpHost,
      port: parseInt(inputs.smtpPort),
      secure: false,
      auth: {
        user: inputs.smtpUser,
        pass: inputs.smtpPass,
      },
    };

    // 生成邮件主题
    const cityName = `${weatherData.province}${weatherData.city}`;
    const defaultSubject =
      inputs.emailSubject ||
      `🌤️ ${cityName}天气预报 - ${new Date().toLocaleDateString(
        "zh-CN"
      )} (高德地图)`;

    // 使用weather-notification模块发送邮件
    const { generateWeatherEmailHTML } = require("./weather-notification");
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: `"${inputs.senderName}" <${inputs.smtpUser}>`,
      to: emailList.join(", "),
      subject: defaultSubject,
      html: generateWeatherEmailHTML(weatherData),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ 邮件发送成功!");
    console.log(`📧 收件人: ${emailList.join(", ")}`);
    console.log(`🏙️ 天气城市: ${cityName}`);
    console.log(`🌡️ 当前温度: ${weatherData.temperature}°C`);
    console.log(`📊 数据提供商: 高德地图`);

    // 设置 GitHub Action 输出
    core.setOutput("status", "success");
    core.setOutput(
      "message",
      `天气信息已成功发送到 ${emailList.length} 个邮箱`
    );
    core.setOutput("weather_data", JSON.stringify(weatherData));
    core.setOutput("recipients_count", emailList.length.toString());

    // 在摘要中显示结果
    core.summary
      .addHeading("🌤️ 天气通知发送成功")
      .addTable([
        [
          { data: "项目", header: true },
          { data: "信息", header: true },
        ],
        ["🏙️ 城市", cityName],
        ["🌡️ 温度", `${weatherData.temperature}°C`],
        ["📊 数据源", "高德地图"],
        ["📧 收件人数量", emailList.length.toString()],
        ["⏰ 发送时间", new Date().toLocaleString("zh-CN")],
      ])
      .write();
  } catch (error) {
    console.error("❌ Action执行失败:", error.message);

    // 设置失败输出
    core.setOutput("status", "failure");
    core.setOutput("message", error.message);

    // 在摘要中显示错误
    core.summary
      .addHeading("❌ 天气通知发送失败")
      .addCodeBlock(error.message, "text")
      .write();

    // 设置Action失败
    core.setFailed(error.message);
  }
}

// 执行Action
if (require.main === module) {
  run();
}

module.exports = { run };
