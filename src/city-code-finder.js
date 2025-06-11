const { cityCodeMap } = require("./weather-notification.js");

// 城市编码查询工具
class CityCodeFinder {
  constructor() {
    this.cityMap = cityCodeMap;
  }

  // 查找城市编码
  findCityCode(query) {
    if (!query) {
      return null;
    }

    const normalizedQuery = query.trim().toLowerCase();

    // 如果输入的就是6位数字编码，直接返回
    if (/^\d{6}$/.test(normalizedQuery)) {
      return {
        code: normalizedQuery,
        matches: this.findCitiesByCode(normalizedQuery),
      };
    }

    // 精确匹配
    const exactMatch = Object.keys(this.cityMap).find(
      (city) => city.toLowerCase() === normalizedQuery
    );

    if (exactMatch) {
      return {
        city: exactMatch,
        code: this.cityMap[exactMatch],
        type: "exact",
      };
    }

    // 模糊匹配
    const fuzzyMatches = Object.keys(this.cityMap).filter(
      (city) =>
        city.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(city.toLowerCase())
    );

    if (fuzzyMatches.length > 0) {
      return {
        type: "fuzzy",
        matches: fuzzyMatches.map((city) => ({
          city,
          code: this.cityMap[city],
        })),
      };
    }

    return null;
  }

  // 通过编码查找城市
  findCitiesByCode(code) {
    return Object.keys(this.cityMap)
      .filter((city) => this.cityMap[city] === code)
      .map((city) => ({ city, code }));
  }

  // 获取所有城市列表
  getAllCities() {
    const cities = Object.keys(this.cityMap);
    const chineseCities = cities.filter((city) => /[\u4e00-\u9fa5]/.test(city));
    const englishCities = cities.filter(
      (city) => !/[\u4e00-\u9fa5]/.test(city)
    );

    return {
      chinese: chineseCities.map((city) => ({
        city,
        code: this.cityMap[city],
      })),
      english: englishCities.map((city) => ({
        city,
        code: this.cityMap[city],
      })),
    };
  }

  // 按省份分组
  getCitiesByProvince() {
    const provinces = {
      直辖市: [
        "北京",
        "Beijing",
        "上海",
        "Shanghai",
        "天津",
        "Tianjin",
        "重庆",
        "Chongqing",
      ],
      广东省: ["广州", "Guangzhou", "深圳", "Shenzhen"],
      浙江省: ["杭州", "Hangzhou"],
      江苏省: ["南京", "Nanjing"],
      湖北省: ["武汉", "Wuhan"],
      四川省: ["成都", "Chengdu"],
      陕西省: ["西安", "Xi'an"],
      河南省: ["郑州", "Zhengzhou"],
      山东省: ["济南", "Jinan"],
      辽宁省: ["沈阳", "Shenyang"],
      吉林省: ["长春", "Changchun"],
      黑龙江省: ["哈尔滨", "Harbin"],
      河北省: ["石家庄", "Shijiazhuang"],
      山西省: ["太原", "Taiyuan"],
      内蒙古自治区: ["呼和浩特", "Hohhot"],
      广西壮族自治区: ["南宁", "Nanning"],
      云南省: ["昆明", "Kunming"],
      贵州省: ["贵阳", "Guiyang"],
      西藏自治区: ["拉萨", "Lhasa"],
      甘肃省: ["兰州", "Lanzhou"],
      青海省: ["西宁", "Xining"],
      宁夏回族自治区: ["银川", "Yinchuan"],
      新疆维吾尔自治区: ["乌鲁木齐", "Urumqi"],
      海南省: ["海口", "Haikou"],
      福建省: ["福州", "Fuzhou"],
      湖南省: ["长沙", "Changsha"],
      江西省: ["南昌", "Nanchang"],
      安徽省: ["合肥", "Hefei"],
    };

    const result = {};

    Object.keys(provinces).forEach((province) => {
      result[province] = provinces[province]
        .filter((city) => this.cityMap[city])
        .map((city) => ({
          city,
          code: this.cityMap[city],
        }));
    });

    return result;
  }

  // 格式化输出搜索结果
  formatSearchResult(result) {
    if (!result) {
      return "❌ 未找到匹配的城市";
    }

    if (result.type === "exact") {
      return `✅ 找到城市: ${result.city} (${result.code})`;
    }

    if (result.type === "fuzzy") {
      let output = "🔍 找到以下相似城市:\n";
      result.matches.forEach((match) => {
        output += `  📍 ${match.city}: ${match.code}\n`;
      });
      return output;
    }

    if (result.matches) {
      let output = `🔍 编码 ${result.code} 对应的城市:\n`;
      result.matches.forEach((match) => {
        output += `  📍 ${match.city}: ${match.code}\n`;
      });
      return output;
    }

    return "❓ 未知的搜索结果格式";
  }

  // 显示使用帮助
  showHelp() {
    return `
🏙️ 城市编码查询工具使用说明

📖 支持的查询方式:
1. 中文城市名: 北京, 上海, 深圳
2. 英文城市名: Beijing, Shanghai, Shenzhen  
3. 6位城市编码: 110000, 440300, 310000

💡 使用示例:
- node src/city-code-finder.js 北京
- node src/city-code-finder.js Beijing
- node src/city-code-finder.js 440300
- node src/city-code-finder.js --list (显示所有城市)
- node src/city-code-finder.js --province (按省份显示)

🔍 模糊匹配:
如果输入的城市名不完整，会显示所有相关的匹配结果。
    `;
  }
}

// 命令行接口
function main() {
  const finder = new CityCodeFinder();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(finder.showHelp());
    return;
  }

  const command = args[0];

  switch (command) {
    case "--help":
    case "-h":
      console.log(finder.showHelp());
      break;

    case "--list":
    case "-l":
      const allCities = finder.getAllCities();
      console.log("🏙️ 所有支持的城市:\n");

      console.log("📍 中文城市名:");
      allCities.chinese.forEach((city) => {
        console.log(`   ${city.city}: ${city.code}`);
      });

      console.log("\n📍 英文城市名:");
      allCities.english.forEach((city) => {
        console.log(`   ${city.city}: ${city.code}`);
      });
      break;

    case "--province":
    case "-p":
      const citiesByProvince = finder.getCitiesByProvince();
      console.log("🗺️ 按省份分组的城市:\n");

      Object.keys(citiesByProvince).forEach((province) => {
        if (citiesByProvince[province].length > 0) {
          console.log(`📍 ${province}:`);
          citiesByProvince[province].forEach((city) => {
            console.log(`   ${city.city}: ${city.code}`);
          });
          console.log("");
        }
      });
      break;

    default:
      const query = args.join(" ");
      console.log(`🔍 搜索城市: "${query}"\n`);

      const result = finder.findCityCode(query);
      console.log(finder.formatSearchResult(result));

      if (!result) {
        console.log("\n💡 提示:");
        console.log("- 尝试使用 --list 查看所有支持的城市");
        console.log("- 尝试使用 --province 按省份查看城市");
        console.log("- 检查城市名称是否正确拼写");
      }
      break;
  }
}

// 导出模块
module.exports = {
  CityCodeFinder,
  main,
};

// 如果直接运行此文件
if (require.main === module) {
  main();
}
