import React, { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { useAdminStore } from '../../store/adminStore';
import { ElevatorStatus } from '../../types';
import { UB_CENTER } from '../../data/adminData';
import { Badge, ELEVATOR_STATUS, PageHead, Panel } from './adminUi';

/**
 * Үйлчилгээнд буй лифтүүдийн байршил.
 *
 * Тэмдэглэгээнд Leaflet-ийн үндсэн дүрсний оронд SVG дугуй ашигласан:
 * үндсэн дүрс нь bundler-тэй ажиллахад зургийн зам эвддэг бөгөөд төлөв
 * бүрийг өнгөөр ялгах шаардлагатай.
 */

const MARKER_COLOR: Record<ElevatorStatus, string> = {
  operational: '#059669',
  maintenance: '#0284C7',
  fault: '#DC2626',
  offline: '#64748B',
};

const STATUS_LIST = Object.keys(ELEVATOR_STATUS) as ElevatorStatus[];

export const AdminMap: React.FC = () => {
  const { elevators } = useAdminStore();
  const [visible, setVisible] = useState<Set<ElevatorStatus>>(new Set(STATUS_LIST));

  const shown = useMemo(() => elevators.filter((e) => visible.has(e.status)), [elevators, visible]);

  const toggle = (s: ElevatorStatus) =>
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  const counts = useMemo(() => {
    const c = {} as Record<ElevatorStatus, number>;
    for (const s of STATUS_LIST) c[s] = elevators.filter((e) => e.status === s).length;
    return c;
  }, [elevators]);

  return (
    <div>
      <PageHead
        title="Газрын зураг"
        lead="Үйлчилгээнд буй бүх лифт, эскалаторын байршил. Тэмдэглэгээн дээр дарж дэлгэрэнгүйг харна."
      />

      {/* Төлөвөөр шүүх */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_LIST.map((s) => {
          const on = visible.has(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 h-9 px-3 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                on ? 'bg-paper border-brand text-ink-dark' : 'bg-paper-3 border-line-light text-ink-dark-subtle'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: on ? MARKER_COLOR[s] : '#CBD5E1' }}
              />
              {ELEVATOR_STATUS[s].label}
              <span className="tabular-nums opacity-70">{counts[s]}</span>
            </button>
          );
        })}
      </div>

      <Panel className="overflow-hidden">
        <div className="h-[60dvh] min-h-80 w-full">
          <MapContainer
            center={UB_CENTER}
            zoom={12}
            scrollWheelZoom
            className="h-full w-full"
            style={{ background: '#E2E8F0' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {shown.map((e) => (
              <CircleMarker
                key={e.id}
                center={[e.lat, e.lng]}
                radius={9}
                pathOptions={{
                  color: '#FFFFFF',
                  weight: 2,
                  fillColor: MARKER_COLOR[e.status],
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="min-w-52">
                    <div className="font-bold text-sm">{e.building}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{e.address}</div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <Badge tone={ELEVATOR_STATUS[e.status].tone}>{ELEVATOR_STATUS[e.status].label}</Badge>
                      <span className="text-[11px] font-mono text-slate-600">{e.code}</span>
                    </div>
                    <dl className="mt-2 text-[11px] text-slate-700 space-y-0.5">
                      <div className="flex justify-between gap-3"><dt>Тоноглол</dt><dd className="font-semibold">{e.brand} {e.model}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Сүүлд үйлчилсэн</dt><dd className="font-semibold">{e.lastServiceAt}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Дараагийн үзлэг</dt><dd className="font-semibold">{e.nextServiceAt}</dd></div>
                    </dl>
                    <Link
                      to={`/admin/elevators?id=${e.id}`}
                      className="mt-2.5 inline-block text-xs font-bold text-brand hover:underline"
                    >
                      Дэлгэрэнгүй, засварын түүх →
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </Panel>

      <p className="mt-3 text-[11px] text-ink-dark-subtle">
        Газрын зургийн дэвсгэрийг OpenStreetMap-аас татна — интернэт холболт шаардана.
        Байршлын координат нь жишээ өгөгдөл тул бодит хаягаар солино.
      </p>
    </div>
  );
};

export default AdminMap;
