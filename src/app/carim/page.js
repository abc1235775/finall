'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCarparkContext } from '@/context/CarparkContext';
import { InfoRow } from '@/components/InfoRow';
import dynamic from 'next/dynamic';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('ID');
  const { parkingDetails } = useCarparkContext();
  const [geoLat, setGeoLat] = useState(null);
  const [geoLon, setGeoLon] = useState(null);

  const carpark = parkingDetails[id] || null;
  const ParkingMap = dynamic(() => import('@/components/Parkingmap'), {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        正在載入地圖...
      </div>
    ),
  });

  const singleCarpark = carpark ? carpark[0] : null;

  useEffect(() => {
    if (singleCarpark?.CarParkPosition?.PositionLat && singleCarpark?.CarParkPosition?.PositionLon) return;
    const name = singleCarpark?.CarParkName?.Zh_tw;
    if (!name) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGeoLat(Number(data[0].lat));
          setGeoLon(Number(data[0].lon));
        }
      });
  }, [singleCarpark]);

  if (!id) {
    return (
      <div className="p-8 text-center text-red-600 text-xl font-semibold">
        🚨 請先從列表頁選擇停車場。
      </div>
    );
  }
  if (!parkingDetails || Object.keys(parkingDetails).length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 text-xl font-semibold">
        讀取中...
      </div>
    );
  }
  if (!carpark) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🚫</span>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              找不到停車場資料
            </h2>
            <p className="text-gray-600 mb-4">
              無法找到指定的停車場資訊，請確認連結是否正確。
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              返回上一頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {singleCarpark && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6">
              <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                <span className="text-5xl">🅿️</span>
                {singleCarpark.CarParkName?.Zh_tw || '未命名'} 停車場資訊
              </h1>
              <div className="mt-4">
                <button
                  onClick={() => window.history.back()}
                  className="bg-white text-rose-600 px-5 py-2 rounded-full shadow hover:bg-rose-100 transition-colors"
                >
                  ← 回上一頁
                </button>
              </div>
            </div>

            <div className="bg-white p-6 space-y-6">
              {singleCarpark?.Facilities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(singleCarpark.Facilities).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl shadow-sm">
                      <span className="text-2xl">
                        {key.includes('Elevator') ? '🛗' : 
                         key.includes('Toilet') ? '🚽' : 
                         key.includes('Washing') ? '🚗' : 
                         key.includes('Phone') ? '📱' : 
                         key.includes('ATM') ? '🏧' : 
                         key.includes('Monitoring') ? '📹' : '🔧'}
                      </span>
                      <span className="text-gray-800 text-lg font-medium">
                        {value.FacilityName || key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  此停車場尚無設施資訊
                </div>
              )}

              {singleCarpark?.CarParkPosition?.PositionLat && singleCarpark?.CarParkPosition?.PositionLon ? (
                <div className="mt-6">
                  <div className="text-lg font-semibold mb-4">📍 停車場位置</div>
                  <ParkingMap 
                    latitude={Number(singleCarpark.CarParkPosition.PositionLat)}
                    longitude={Number(singleCarpark.CarParkPosition.PositionLon)}
                    name="停車場位置"
                  />
                </div>
              ) : geoLat && geoLon ? (
                <div className="mt-6">
                  <div className="text-lg font-semibold mb-4">📍 停車場位置（自動搜尋）</div>
                  <ParkingMap 
                    latitude={geoLat}
                    longitude={geoLon}
                    name="停車場位置"
                  />
                </div>
              ) : (
                <div className="mt-6 text-gray-500 text-center">
                  此停車場無位置資訊
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
