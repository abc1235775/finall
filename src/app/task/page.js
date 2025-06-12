'use client';
console.log('🛬 進入 /task 頁面');
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCarparkContext } from '@/context/CarparkContext';

const todoMap = {
  台北市: ['參觀台北101', '逛士林夜市', '漫步大稻埕'],
  台中市: ['逛逢甲夜市', '草悟道散步', '高美濕地看夕陽'],
  高雄市: ['愛河夜遊', '駁二藝術特區', '旗津海鮮大餐'],
  花蓮縣: ['太魯閣健行', '七星潭看海', '吃炸蛋蔥油餅'],
  台南市: ['安平古堡', '赤崁樓', '吃台南小吃']
};

export default function TodoPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const [todos, setTodos] = useState([]);
  const { groupedByCity } = useCarparkContext();

  useEffect(() => {
    if (city && todoMap[city]) {
      setTodos(todoMap[city]);
    } else {
      setTodos([]);
    }
  }, [city]);

  console.log('🧠 groupedByCity keys:', Object.keys(groupedByCity));
  console.log('🎯 loading:', loading); 

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold text-rose-700 mb-4">
        {city ? `${city} 的旅遊 🧳` : '請從首頁選擇縣市'}
      </h1>

      <ul className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4">
        {groupedByCity[city] ? (
          <>
            {todos.map((todo, idx) => (
              <li key={idx} className="text-lg font-medium">{todo}</li>
            ))}
            <hr className="my-4" />
            <h2 className="text-xl font-bold">可停車場：</h2>
            <ul className="list-disc list-inside">
              {groupedByCity[city].map((carpark) => (
                <li key={carpark.CarParkID}>{carpark.CarParkName.Zh_tw}</li>
              ))}
            </ul>
          </>
        ) : (
          <li className="text-gray-500">目前沒有這個地區的旅遊資料</li>
        )}
      </ul>
    </main>
  );
}
