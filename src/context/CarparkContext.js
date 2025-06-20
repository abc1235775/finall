'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const CarparkContext = createContext();
const staticCityData = {
  "台東縣": [
    "石梯坪風景區停車場",
    "八仙洞風景區停車場",
    "小野柳風景區停車場",
    "鯉魚潭潭北停車場",
    "羅山遊客中心停車場",
    "鹿野遊客中心停車場",
    '紅葉公園停車場'
  ],
  "屏東縣": [
    "鵬灣跨海大橋(嘉蓮端)停車場",
    "崎峰濕地停車場",
    "落日灣停車場",
    "賽嘉樂園停車場",
    "十八羅漢山服務區停車場",
    "禮納里遊客中心前臨時停車場",
    "不老溫泉區停車場",
    "寶來休閒活動廣場停車場",
    '涼山遊憩區停車場',
  ],
  "花蓮縣": ["慈恩塔步道停車場"],
  "南投縣": [
    "伊達邵遊客中心停車場",
    "玄光寺停車場",
    "櫻緣丘停車場"
  ],
  "台中市": ["梨山文物陳列館停車場"],
  "苗栗縣": [
    "赤水崎園區停車場",
    "獅山遊客中心停車場",
    "南庄遊客中心停車場",
    "豐柏廣場停車場",
    '獅頭山停車場'
  ],
  "嘉義縣": [
    "嘉義梅山太平雲梯停車場",
    "布袋海景公園小客車A區停車場",
    "布袋文創HOTEL停車場",
    "大埔資訊站停車場",
    "中埔遊客中心停車場"
  ],
  "台南市": [
    "白沙月灣停車場",
    "白沙灣第二停車場",
    "白沙灣第一停車場",
    "馬沙溝濱海遊憩區停車場",
    "井仔腳大客車停車場",
    "北門第二停車場小客車",
    "七股遊客中心大客車停車場",
    "南化遊客中心停車場",
    "官田遊客中心停車場",
    "嶺頂公園停車場",
    "南鯤鯓大客車停車場",
    "梅嶺資訊站停車場"
  ],
  "新北市": [
    "鼻頭港服務區停車場",
    "三芝遊客中心停車場",
    "觀音山遊客中心",
    "凌雲禪寺登山步道口",
    '富貴角停車場'
  ],
  "宜蘭縣": [
    "北關海潮公園停車場",
    "水濂洞停車場"
  ],
  "台北市": ["古生物奇幻樂園"],
  "基隆市": [
    "基隆外木山地區停車場",
    "基隆情人湖園區",
    "基隆和平島公園"
  ],
  "高雄市": [' 寶來遊客服務區停車場']
  
};
  const nameToCityMap = {};
  for (const [city, names] of Object.entries(staticCityData)) {
    names.forEach(name => {
      nameToCityMap[name] = city;
    });
  }
   console.log('🌀 nameToCityMap:', nameToCityMap);
export const CarparkProvider = ({ children }) => {
  const [groupedByCity, setGroupedByCity] = useState({});
  const [parkingDetails, setParkingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log('🌀 CarparkProvider component render:', new Date().toISOString());

  
  const getAccessToken = async () => {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', 'B11217021-10db75a6-2a14-40cf');
      params.append('client_secret', 'cba6263c-1f29-4fb1-b1e5-433c4280b4e6');

      const res = await axios.post(
        'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
        params
      );

      return res.data.access_token;
  };
  useEffect(() => {
    if (!loading) return; // 如果已經在載入中，就不再執行 fetchData
    {
      console.log('🔄 開始載入資料...');
      fetchData();
      setLoading(true);
    }
    if (loading)
    {
      console.log('📡 CarparkContext useEffect 執行'); // 這應該只出現一次
      fetchData();
      console.log('🎯 loading 狀態變更:', loading);
    }  
  }, []);


  const fetchData = async () => {
      try {
        const token = await getAccessToken();
        //console.log('🔑 token:', token);

        const [carparkRes, scenicRes,detailRes] = await Promise.all([
          axios.get('https://tdx.transportdata.tw/api/basic/v1/Parking/OffStreet/CarPark/To/Toursim/ScenicSpot', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              $format: 'JSON',
              $orderby: 'ScenicSpotID',
            },
          }),
          axios.get('https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              $format: 'JSON',
              $orderby: 'ScenicSpotID',
            },
          }),
          axios.get('https://tdx.transportdata.tw/api/basic/v1/Parking/OffStreet/ParkingFacility/Tourism', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              $format: 'JSON',
              $orderby: 'CarParkID',
            },
          }),
        ]);
        console.log('📦 carparkRes:', carparkRes);
        const scenicMap = {};
        for (const spot of scenicRes.data) {
          scenicMap[spot.ScenicSpotID] = spot;
        }

        const enriched = carparkRes.data.ScenicSpotCarParks.map(carpark => ({
          ...carpark,
          ScenicSpotInfo: scenicMap[carpark.ScenicSpotID] || null,
        }));
        

        for (const carpark of enriched) {
          const name = carpark.CarParkName.Zh_tw;

          // 如果 ScenicSpotInfo 是 null，就建立一個空物件
          if (!carpark.ScenicSpotInfo) {
            carpark.ScenicSpotInfo = {};
          }

          // 如果 City 是 null/undefined/空字串，才補上
          if (!carpark.ScenicSpotInfo.City) {
            console.log('🔍 未找到 City，使用靜態名稱映射');
            const guessedCity = nameToCityMap[name];
            if (guessedCity) {
              carpark.ScenicSpotInfo.City = guessedCity;
              //carpark.ScenicSpotInfo.Source = 'from static name map';
            } else {
              console.warn(guessedCity);
              carpark.ScenicSpotInfo.City = '未知地區';
            }
          }
        }

        const grouped = {};
          enriched.forEach(carpark => {
            const city = carpark.ScenicSpotInfo.City;
            const carid = carpark.CarParkID;
            if (!grouped[city]) grouped[city] = [];
            const isDuplicate = grouped[city].some(existing => existing.CarParkID === carid);
            if (!isDuplicate) {
            grouped[city].push(carpark);
            }
          });
        const detailMap = {};
        const detailIdMap = {};

        for (const item of detailRes.data.ParkingFacilities) {
          detailIdMap[item.CarParkID] = item;
        }

        for (const city in grouped) {
          for (const carpark of grouped[city]) {
            const carid = carpark.CarParkID;
            const detail = detailIdMap[carid];

            if (detail) {
              // 若 carid 尚未建立對應陣列，先初始化
              if (!detailMap[carid]) {
                detailMap[carid] = [];
              }
              // 將 carpark 加入對應 detailMap 條目
              const isDuplicate = detailMap[carid].some(
                (existing) => JSON.stringify(existing) === JSON.stringify(detail)
              );
              if (!isDuplicate) {
              detailMap[carid].push(detail);
              }
            }
          }
        }

        console.log('📦 groupedByCity:', grouped);
        console.log('📦 detailMap:', detailMap);
        setGroupedByCity(grouped);
        setParkingDetails(detailMap);
      } catch (err) {
        console.error('🚨 Error fetching data:', err);
      } finally {
        setLoading(false);
      }

  };

  return (
    <CarparkContext.Provider value={{ groupedByCity, parkingDetails}}>
      {children}
    </CarparkContext.Provider>
  );
};

export const useCarparkContext = () => useContext(CarparkContext);
