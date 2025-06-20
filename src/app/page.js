'use client';

import { useEffect, useState } from "react";

// 台灣縣市清單
const taiwanCities = [
  "基隆市", "台北市", "新北市", "桃園市", "新竹市", "新竹縣",
  "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣",
  "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣",
  "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"
];

// 對應縣市的代表圖片（可替換為自己圖庫或公共 CDN）
const cityImages = { 
"台北市": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Taipei_101_from_Xiangshan_20240729.jpg/250px-Taipei_101_from_Xiangshan_20240729.jpg", 
"新北市": 
"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2018_Christmasland_in_New_Taipei%2C_Taiwan.jpg/330px-2018_Christmasland_in_New_Taipei%2C_Taiwan.jpg ", 
"基隆市":
"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Superstar_Aquarius_and_Keelung_Cultural_Center_at_night_20181106.jpg/330px-Superstar_Aquarius_and_Keelung_Cultural_Center_at_night_20181106.jpg ", 
"桃園市": " https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Qingpu%2C_Taoyuan_City_Skyline_2024.jpg/330px-Qingpu%2C_Taoyuan_City_Skyline_2024.jpg ", 
"新竹市": " https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TRA_Hsinchu_Station.jpg/330px-TRA_Hsinchu_Station.jpg ", 
"台中市": " https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Taiwan_Boulevard.jpg/330px-Taiwan_Boulevard.jpg ", 
"台南市": " https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/%E5%AE%89%E5%B9%B3%E5%8F%A4%E5%A0%A1%E4%B9%8B%E7%BE%8E.jpg/330px-%E5%AE%89%E5%B9%B3%E5%8F%A4%E5%A0%A1%E4%B9%8B%E7%BE%8E.jpg ", 
"高雄市": " https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kaohsiung_Skyline_2020_%28cropped%29.jpg/330px-Kaohsiung_Skyline_2020_%28cropped%29.jpg ", 
"花蓮縣": " https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2004.02.01.%E4%B8%83%E6%98%9F%E6%BD%AD_-_panoramio.jpg/330px-2004.02.01.%E4%B8%83%E6%98%9F%E6%BD%AD_-_panoramio.jpg ", 
"台東縣": " https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/%E6%9D%B1%E6%B5%B7%E5%B2%B8%E7%9A%84%E9%A2%A8%E6%99%AF_%E5%B0%8F%E9%87%8E%E6%9F%B3_%28cropped%29.jpg/330px-%E6%9D%B1%E6%B5%B7%E5%B2%B8%E7%9A%84%E9%A2%A8%E6%99%AF_%E5%B0%8F%E9%87%8E%E6%9F%B3_%28cropped%29.jpg ", 
"屏東縣": " https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Hengchun-CHO_YEN_CHIA-IMG_1665.jpg/330px-Hengchun-CHO_YEN_CHIA-IMG_1665.jpg ", 
"宜蘭縣": " https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/%E5%86%AC%E5%B1%B1%E6%B2%B3_%E5%88%A9%E6%BE%A4%E7%B0%A1%E6%A9%8B_DJI-0162_%28cropped%29.jpg/330px-%E5%86%AC%E5%B1%B1%E6%B2%B3_%E5%88%A9%E6%BE%A4%E7%B0%A1%E6%A9%8B_DJI-0162_%28cropped%29.jpg " ,
"苗栗縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/龍騰斷橋--張利聰.jpg/330px-龍騰斷橋--張利聰.jpg ",
"新竹縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Building_of_Taiwan_Semiconductor_Manufacturing_Fab_12B_at_night.jpg/330px-Building_of_Taiwan_Semiconductor_Manufacturing_Fab_12B_at_night.jpg ",
"彰化縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/八卦山大佛風景區_(cropped).jpg/330px-八卦山大佛風景區_(cropped).jpg ",
"南投縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/埔里盆地_(cropped).jpg/330px-埔里盆地_(cropped).jpg ",
"雲林縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/西螺大橋_(cropped).jpg/330px-西螺大橋_(cropped).jpg ",
"嘉義市":" https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/嘉義市區夜景鳥瞰.jpg/330px-嘉義市區夜景鳥瞰.jpg ",
"嘉義縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Jushan_sunrise_02.jpg/330px-Jushan_sunrise_02.jpg ",
"澎湖縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Penghu_Great_Bridge.jpg/330px-Penghu_Great_Bridge.jpg ",
"金門縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/太武山_-_毋忘在莒.jpg/330px-太武山_-_毋忘在莒.jpg ",
"連江縣":" https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/山仔水库_-_Shanzai_Reservoir_-_2015.03_-_panoramio.jpg/250px-山仔水库_-_Shanzai_Reservoir_-_2015.03_-_panoramio.jpg "
};

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-rose-100 to-emerald-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-rose-300 rounded-2xl shadow-2xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-rose-600 mb-4">
          🇹🇼 請選擇目的地
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          請選擇你所在的縣市，探索台灣之美 🌏
        </p>

        <label htmlFor="city-select" className="block mb-2 text-green-800 font-semibold text-lg">
          選擇縣市：
        </label>
        <select
          id="city-select"
          className="w-full border-2 border-green-300 rounded-lg p-2 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">-- 請選擇縣市 --</option>
          {taiwanCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* 顯示選擇結果 */}
        <div className="mt-8 text-center text-xl font-medium text-blue-800">
          {selectedCity ? `你選擇的是：${selectedCity} 🎉` : "尚未選擇縣市"}
        </div>

        {/* 顯示對應圖片 */}
        {selectedCity && cityImages[selectedCity] && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <img
              src={cityImages[selectedCity]}
              alt={`${selectedCity} 圖片`}
              className="rounded-xl shadow-md max-h-64 object-cover"
            />
            <button
              className="inline-block px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 text-sm font-semibold shadow-md"
              onClick={() => {
                window.location.href = `/task?city=${selectedCity}`;
              }}
            >
              前往 {selectedCity} 的觀光資訊
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
