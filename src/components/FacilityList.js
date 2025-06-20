export function FacilityList({ facilities = [] }) {
  const getFacilityIcon = (type) => {
    const icons = {
      1: '🛗', // 電梯
      2: '🚽', // 廁所
      3: '♿', // 無障礙廁所
      4: '👶', // 哺乳室
      6: '📶', // WiFi
      7: '🏪', // 賣店
      9: '🏢', // 遊客中心
      10: '🚰', // 飲水機
      11: '🔌', // 手機充電
      14: '📦', // 置物空間
      16: '💟', // AED
    };
    return icons[type] || '📍';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {facilities.map((facility, index) => (
        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-2xl mr-3">{getFacilityIcon(facility.FacilityType)}</span>
          <div>
            <div className="font-medium text-gray-800">{facility.FacilityName}</div>
            <div className="text-sm text-gray-600">{facility.LocationDescription}</div>
          </div>
        </div>
      ))}
    </div>
  );
}