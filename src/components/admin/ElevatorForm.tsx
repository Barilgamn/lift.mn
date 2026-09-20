import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Elevator, ElevatorStatus } from '../../types';
import { ELEVATOR_STATUS } from './adminUi';

/**
 * Шинэ лифт гараар нэмэх маягт.
 *
 * Лифтүүдийн жагсаалт болон газрын зураг хоёулаа энэ нэг маягтыг
 * ашиглана. Газрын зурагнаас дуудахад байршлыг нь урьдчилан дүүргэж
 * өгдөг тул инженер координатаа гараар бичих шаардлагагүй.
 */

const STATUS_LIST = Object.keys(ELEVATOR_STATUS) as ElevatorStatus[];

const DISTRICTS = [
  'Хан-Уул дүүрэг',
  'Сүхбаатар дүүрэг',
  'Баянзүрх дүүрэг',
  'Баянгол дүүрэг',
  'Чингэлтэй дүүрэг',
  'Сонгинохайрхан дүүрэг',
  'Налайх дүүрэг',
  'Багануур дүүрэг',
  'Багахангай дүүрэг',
];

const BRANDS = ['KLEEMANN', 'OTIS', 'Mitsubishi', 'Hyundai', 'Sigma / LG', 'Schindler', 'ThyssenKrupp', 'Бусад'];

/** Огнооноос хойш нэг сарын дараах өдөр — дараагийн үзлэгийн анхны утга */
const monthAfter = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
};

export interface ElevatorFormProps {
  /** Газрын зураг дээр сонгосон байршил */
  initialLat?: number;
  initialLng?: number;
  onClose: () => void;
}

export const ElevatorForm: React.FC<ElevatorFormProps> = ({
  initialLat, initialLng, onClose,
}) => {
  const { addElevator } = useAdminStore();
  const today = new Date().toISOString().slice(0, 10);

  const [code, setCode] = useState('');
  const [building, setBuilding] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(initialLat ?? 47.9187);
  const [lng, setLng] = useState(initialLng ?? 106.9176);
  const [brand, setBrand] = useState(BRANDS[0]);
  const [model, setModel] = useState('');
  const [floors, setFloors] = useState(9);
  const [capacityKg, setCapacityKg] = useState(630);
  const [installedAt, setInstalledAt] = useState('');
  const [contractType, setContractType] = useState<Elevator['contractType']>('monthly');
  const [status, setStatus] = useState<ElevatorStatus>('operational');
  const [lastServiceAt, setLastServiceAt] = useState(today);
  const [nextServiceAt, setNextServiceAt] = useState(monthAfter(today));
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const field = 'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !building.trim() || !address.trim()) {
      setError('Тоноглолын дугаар, барилгын нэр, хаяг гурвыг бөглөнө үү.');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) {
      setError('Байршлын өргөрөг, уртрагийг зөв оруулна уу.');
      return;
    }
    setError('');
    setBusy(true);
    const err = await addElevator({
      code: code.trim(), building: building.trim(), district, address: address.trim(),
      lat, lng, brand, model: model.trim(), floors, capacityKg,
      installedAt: installedAt || '', contractType, status,
      lastServiceAt: lastServiceAt || '', nextServiceAt: nextServiceAt || '',
      contactName: contactName.trim(), contactPhone: contactPhone.trim(),
    });
    setBusy(false);
    if (err) { setError(err); return; }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/40 flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog" aria-modal="true" aria-label="Шинэ лифт нэмэх"
        onClick={(ev) => ev.stopPropagation()}
        className="theme-light w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-paper border border-line-light"
      >
        <div className="sticky top-0 bg-paper border-b border-line-light px-5 py-3.5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-ink-dark">Шинэ лифт нэмэх</h2>
            <p className="mt-0.5 text-[11px] text-ink-dark-muted">
              Засварт шинээр орсон тоноглолыг бүртгэнэ. Дугаарыг систем өөрөө олгоно.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Хаах"
            className="p-1.5 rounded-lg hover:bg-paper-3 text-ink-dark-muted cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-code">Тоноглолын дугаар *</label>
              <input id="el-code" value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="Жишээ: DL-KLM-1042" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="el-building">Барилга, хотхон *</label>
              <input id="el-building" value={building} onChange={(e) => setBuilding(e.target.value)}
                placeholder="Жишээ: Хийморь Гарден хотхон" className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-district">Дүүрэг</label>
              <select id="el-district" value={district} onChange={(e) => setDistrict(e.target.value)} className={field}>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="el-address">Хаяг *</label>
              <input id="el-address" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Жишээ: 15-р хороо, А корпус, 1-р орц" className={field} />
            </div>
          </div>

          {/* Байршил */}
          <div className="p-3.5 rounded-xl bg-paper-2 border border-line-light">
            <div className="flex items-center gap-2 mb-2.5">
              <MapPin className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted">
                Газрын зураг дээрх байршил
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className={label} htmlFor="el-lat">Өргөрөг (lat)</label>
                <input id="el-lat" type="number" step="0.000001" value={lat}
                  onChange={(e) => setLat(Number(e.target.value))} className={field} />
              </div>
              <div>
                <label className={label} htmlFor="el-lng">Уртраг (lng)</label>
                <input id="el-lng" type="number" step="0.000001" value={lng}
                  onChange={(e) => setLng(Number(e.target.value))} className={field} />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-ink-dark-subtle">
              {initialLat !== undefined
                ? 'Газрын зураг дээр дарсан цэгээс автоматаар бөглөгдлөө.'
                : 'Газрын зураг хуудаснаас нэмбэл байршлыг дарж сонгоно.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-brand">Үйлдвэрлэгч</label>
              <select id="el-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={field}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="el-model">Загвар</label>
              <input id="el-model" value={model} onChange={(e) => setModel(e.target.value)}
                placeholder="Жишээ: Atlas MRL" className={field} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div>
              <label className={label} htmlFor="el-floors">Давхар</label>
              <input id="el-floors" type="number" min={1} max={200} value={floors}
                onChange={(e) => setFloors(Number(e.target.value))} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="el-cap">Даац (кг)</label>
              <input id="el-cap" type="number" min={0} max={10000} step={10} value={capacityKg}
                onChange={(e) => setCapacityKg(Number(e.target.value))} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="el-installed">Суурилуулсан</label>
              <input id="el-installed" type="date" value={installedAt}
                onChange={(e) => setInstalledAt(e.target.value)} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-contract">Гэрээний төрөл</label>
              <select id="el-contract" value={contractType}
                onChange={(e) => setContractType(e.target.value as Elevator['contractType'])} className={field}>
                <option value="monthly">Сар бүрийн гэрээт</option>
                <option value="on-call">Дуудлагаар</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="el-status">Төлөв</label>
              <select id="el-status" value={status}
                onChange={(e) => setStatus(e.target.value as ElevatorStatus)} className={field}>
                {STATUS_LIST.map((s) => <option key={s} value={s}>{ELEVATOR_STATUS[s].label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-last">Сүүлд үйлчилсэн</label>
              <input id="el-last" type="date" value={lastServiceAt}
                onChange={(e) => {
                  setLastServiceAt(e.target.value);
                  if (e.target.value) setNextServiceAt(monthAfter(e.target.value));
                }} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="el-next">Дараагийн үзлэг</label>
              <input id="el-next" type="date" value={nextServiceAt}
                onChange={(e) => setNextServiceAt(e.target.value)} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={label} htmlFor="el-contact">Хариуцагчийн нэр</label>
              <input id="el-contact" value={contactName} onChange={(e) => setContactName(e.target.value)}
                placeholder="Жишээ: Б. Болд (СӨХ-ийн дарга)" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="el-phone">Утас</label>
              <input id="el-phone" type="tel" value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="9911-XXXX" className={field} />
            </div>
          </div>

          {error && <p className="text-xs text-red-700">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button id="el-save-btn" type="submit" disabled={busy}
              className="h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-xs font-bold cursor-pointer transition-colors">
              {busy ? 'Хадгалж байна…' : 'Лифт бүртгэх'}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors">
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElevatorForm;
