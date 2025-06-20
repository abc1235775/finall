'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const parkingIcon = new L.Icon({
  iconUrl: '/parking-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});
const ParkingMap = ({ latitude, longitude, name }) => {
  useEffect(() => {
    // 修正 Leaflet 圖標問題
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
  }, []);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        無效的座標資訊
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={parkingIcon}>
          <Popup>{name || '停車場位置'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ParkingMap;