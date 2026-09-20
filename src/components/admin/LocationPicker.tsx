import React, { useMemo } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdminStore } from '../../store/adminStore';
import { UB_CENTER } from '../../data/adminData';

/**
 * Шинэ лифтийн байршлыг газрын зураг дээрээс сонгох.
 *
 * Leaflet нь багцын хэмжээгээр хүнд тул энэ бүрэлдэхүүнийг зөвхөн
 * маягт нээгдэх үед lazy-аар ачаална (ElevatorForm-ыг үзнэ үү).
 */

/** Зургийн даралт нь 15 оронтой бутархай өгдөг — 6 орон (~11 см) хангалттай */
export const round6 = (v: number): number => Number(v.toFixed(6));

const PickOnClick: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick(round6(e.latlng.lat), round6(e.latlng.lng)) });
  return null;
};

export interface LocationPickerProps {
  /** Сонгосон цэг. Хараахан сонгоогүй бол null */
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const { elevators } = useAdminStore();

  // Одоо байгаа лифтүүдийг бүдэг цэгээр үзүүлбэл шинэ цэгээ байрлуулахад хялбар
  const center = useMemo<[number, number]>(() => {
    if (value) return [value.lat, value.lng];
    const first = elevators[0];
    return first ? [first.lat, first.lng] : UB_CENTER;
  }, [value, elevators]);

  return (
    <div className="h-[42dvh] min-h-64 w-full rounded-xl overflow-hidden border border-line-light [&_.leaflet-container]:cursor-crosshair">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: '#E2E8F0' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PickOnClick onPick={onChange} />

        {elevators.map((e) => (
          <CircleMarker
            key={e.id}
            center={[e.lat, e.lng]}
            radius={5}
            interactive={false}
            pathOptions={{ color: '#FFFFFF', weight: 1.5, fillColor: '#94A3B8', fillOpacity: 0.9 }}
          />
        ))}

        {value && (
          <CircleMarker
            center={[value.lat, value.lng]}
            radius={11}
            interactive={false}
            pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: '#0063A5', fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
