'use client';
import { useCarparkContext } from '@/context/CarparkContext';

export default function CarparkPage() {
  const { groupedByCity, loading } = useCarparkContext();

  if (loading) return <p>載入中...</p>;

  return (
    <div>
      {Object.entries(groupedByCity).map(([city, carparks]) => (
        <div key={city}>
          <h2>{city}</h2>
          <ul>
            {carparks.map((carpark, idx) => (
              <li key={idx}>
                {carpark.ScenicSpotInfo?.Name || '無名稱'} — {carpark.CarParkName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
