export type ActiveSection = 'portal' | 'delta-lift' | 'service' | 'parts';

export interface TariffItem {
  id: string;
  title: string;
  target: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

/**
 * Бүтээгдэхүүний доторх хувилбар.
 *
 * Жишээ нь "Лифтний товч" гэсэн нэг бүтээгдэхүүн дотор брэнд тус бүрийн
 * загварууд (BR27C/A311, KDS50/300 ...) хувилбар болж багтана. Үнэ, нөөц,
 * зургийг хувилбар бүрд нь админ дээрээс тусад нь засна.
 */
export interface ProductVariant {
  id: string;
  /** Үйлдвэрийн код — жагсаалтад тодоор харагдана */
  code: string;
  name: string;
  brand: string;
  /** 0 бол "үнэ тохиролцоно" гэж харуулна */
  price: number;
  stockCount: number;
  image: string;
  note?: string;
}

export interface SparePart {
  id: string;
  name: string;
  oemCode: string;
  category: 'motor' | 'cable' | 'door' | 'button' | 'inverter' | 'sensor' | 'brake' | 'oil';
  categoryLabel: string;
  brand: string;
  price: number;
  inStock: boolean;
  stockCount: number;
  deliveryDays: string;
  image: string;
  specs: Record<string, string>;
  description: string;
  /** Доторх загварууд. Хоосон бол энгийн нэг бараа. */
  variants?: ProductVariant[];
}

export interface CartItem {
  part: SparePart;
  quantity: number;
}

export interface ServiceTicket {
  id: string;
  createdAt: string;
  clientType: string;
  contactName: string;
  phone: string;
  district: string;
  address: string;
  brand: string;
  issueType: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  status: 'Хүлээн авсан' | 'Инженер гарсан' | 'Оношилж байна' | 'Сэлбэг хүлээгдэж буй' | 'Амжилттай шийдвэрлэсэн';
  assignedEngineer?: string;
  estimatedArrival?: string;
}

/* ------------------------------------------------------------- Админ хэсэг */

export type ElevatorStatus = 'operational' | 'maintenance' | 'fault' | 'offline';

export interface Elevator {
  id: string;
  /** Тоноглолын дугаар, тавцан дээрх пайз дээрх код */
  code: string;
  building: string;
  district: string;
  address: string;
  /** Газрын зурагт тэмдэглэх байршил */
  lat: number;
  lng: number;
  brand: string;
  model: string;
  floors: number;
  capacityKg: number;
  installedAt: string;
  /** Гэрээний төрөл — сар бүрийн гэрээт эсвэл дуудлагаар */
  contractType: 'monthly' | 'on-call';
  status: ElevatorStatus;
  lastServiceAt: string;
  nextServiceAt: string;
  contactName: string;
  contactPhone: string;
}

export type ServiceKind = 'routine' | 'repair' | 'emergency' | 'inspection';

export interface ServiceRecord {
  id: string;
  elevatorId: string;
  date: string;
  engineer: string;
  kind: ServiceKind;
  /** Ямар асуудал гарсан */
  issue: string;
  /** Хэрхэн шийдсэн */
  resolution: string;
  partsUsed: string[];
  durationMin: number;
  outcome: 'resolved' | 'awaiting-parts' | 'monitoring';
}

export type SubmissionKind =
  | 'service-ticket'
  | 'emergency'
  | 'booking'
  | 'quote'
  | 'sourcing'
  | 'order';

export type SubmissionStatus = 'new' | 'in-progress' | 'done';

export interface Submission {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  contactName: string;
  phone: string;
  /** Жагсаалтад харагдах товч утга */
  summary: string;
  status: SubmissionStatus;
  /** Маягтын бүрэн агуулга — дэлгэрэнгүйд харуулна */
  details: Record<string, string>;
}
