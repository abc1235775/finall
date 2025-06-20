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
    <main className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-100 to-teal-100 p-8">
      <div className="max-w-5xl mx-auto flex gap-30 ">
        {/* 靠左按鈕 */}
        <div className="mb-8 px-2 justify-end">
          <button
            onClick={() => window.history.back()}
            className=" inline-block px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 text-sm font-semibold shadow-md"
          >
            返回上一頁
          </button>
        </div>

        {/* 置中標題 */}
        <h1 className="text-5xl font-extrabold text-orange-600 mb-8 tracking-tight text-center drop-shadow-md">
          {city ? `${city} 的旅遊資訊 ✨` : '請從首頁選擇縣市'}
        </h1>
      </div>

      {carparks ? (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-10xl">
          
          {carparks.map((carpark) => (
            <div
              key={carpark.CarParkID}
              className="bg-white shadow-2xl rounded-3xl p-6 border-4 border-amber-300 hover:shadow-orange-400 hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-rose-700 mb-3">
                {carpark.ScenicSpotName?.Zh_tw || '無名稱'}
              </h2>

              <p className="text-base text-gray-700 mb-1">
                📍 停車場:{carpark.CarParkName?.Zh_tw || '未提供'}
              </p>

              <p className="text-base text-gray-600 mb-4">
                🏠 地址：{carpark.ScenicSpotInfo?.Address || '未提供'}
              </p>
             
              <button
              className="inline-block px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 text-sm font-semibold shadow-md"
              onClick={() => {
                window.location.href = `/carim?ID=${carpark.CarParkID}`;
              }}
            >
              前往 {carpark.ScenicSpotName.Zh_tw} 的觀光資訊
            </button>
             
            </div>
          ))}
        </div>
      ) : (
        <div className="text-rose-500 text-lg mt-12">
          🔍 目前沒有這個地區觀光區附近的停車場資料，請稍後再試～
        </div>
      )}
    </main>
  );
}
