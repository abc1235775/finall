'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCarparkContext } from '@/context/CarparkContext';
import Link from 'next/link';

export default function TodoPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const { groupedByCity } = useCarparkContext();

  useEffect(() => {
    if (!city) {
      console.warn('🚨 沒有選擇城市，請從首頁選擇縣市');
      return;
    }
    console.log(`🔍 正在顯示 ${city} 的旅遊資料`);
  }, [city]);

  const carparks = groupedByCity[city];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-4xl font-extrabold text-rose-700 mb-6 tracking-tight">
        {city ? `${city} 的旅遊資訊 🧳` : '請從首頁選擇縣市'}
      </h1>

      {carparks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {carparks.map((carpark) => (
            <div
              key={carpark.CarParkID}
              className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-rose-800 mb-2">
                {carpark.CarParkName?.Zh_tw || '無名稱'}
              </h2>

              <p className="text-sm text-gray-700 mb-1">
                景點：{carpark.ScenicSpotInfo?.Name || '未提供'}
              </p>

              <p className="text-sm text-gray-600 mb-3">
                地址：{carpark.ScenicSpotInfo?.Address || '未提供'}
              </p>

              <Link
                href={`/task/${carpark.CarParkID}`}
                className="inline-block px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
              >
                查看停車場詳情 →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-lg mt-10">
          🔍 目前沒有這個地區的旅遊資料
        </div>
      )}
    </main>
  );
}
