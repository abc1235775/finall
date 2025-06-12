'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCarparkContext } from '@/context/CarparkContext';


const CarparkContext = createContext();

export const CarparkProvider = ({ children }) => {
  const [groupedByCity, setGroupedByCity] = useState({});
  const [loading, setLoading] = useState(true);
console.log('🌀 CarparkProvider component render:', new Date().toISOString());

  useEffect(() => {
    console.log('📡 CarparkContext useEffect 執行'); // 這應該只出現一次
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        //console.log('🔑 token:', token);

        const [carparkRes, scenicRes] = await Promise.all([
          axios.get('https://tdx.transportdata.tw/api/basic/v1/Parking/OffStreet/CarPark/To/Toursim/ScenicSpot', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              $top: 1000000,
              $format: 'JSON',
              $orderby: 'ScenicSpotID',
            },
          }),
          axios.get('https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              $top: 1000000,
              $format: 'JSON',
              $orderby: 'ScenicSpotID',
            },
          }),
        ]);

        const scenicMap = {};
        for (const spot of scenicRes.data) {
          scenicMap[spot.ScenicSpotID] = spot;
        }

        const enriched = carparkRes.data.ScenicSpotCarParks.map(carpark => ({
          ...carpark,
          ScenicSpotInfo: scenicMap[carpark.ScenicSpotID] || null,
        }));

        const grouped = {};
        enriched.forEach(carpark => {
          const city = carpark.ScenicSpotInfo?.City || '未知地區';
          if (!grouped[city]) grouped[city] = [];
          grouped[city].push(carpark);
        });

        console.log('📦 groupedByCity:', grouped);

        setGroupedByCity(grouped);
      } catch (err) {
        console.error('🚨 Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

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


    console.log('🎯 loading 狀態變更:', loading);
}, [loading]);

  return (
    <CarparkContext.Provider value={{ groupedByCity, loading }}>
      {children}
    </CarparkContext.Provider>
  );
};

export const useCarparkContext = () => useContext(CarparkContext);
