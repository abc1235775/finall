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

  const carparks = groupedByCity['未知地區'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-4xl font-extrabold text-rose-700 mb-6 tracking-tight">
        {city ? `${city} 的旅遊資訊 🧳` : '請從首頁選擇縣市'}
      </h1>

      {carparks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {carparks.map((carpark) => (
            <li className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition duration-300" >
              <h2 className="text-xl font-semibold text-rose-800 mb-2">
                {carpark.CarParkName?.Zh_tw || '無名稱'}
              </h2>
            </li>
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

          