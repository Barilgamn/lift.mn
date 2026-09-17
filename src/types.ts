export type ActiveSection = 'portal' | 'delta-lift' | 'service' | 'parts';

export interface ElevatorBrand {
  id: string;
  name: string;
  origin: string;
  logoText: string;
  category: string;
  description: string;
  highlight: string;
  image: string;
  specs: {
    maxCapacity: string;
    speed: string;
    floors: string;
    tech: string;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  location: string;
  year: string;
  category: 'residential' | 'commercial' | 'hotel' | 'public';
  categoryLabel: string;
  elevatorsInstalled: string;
  brand: string;
  image: string;
  description: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  type: string;
  logo: string;
  description: string;
}

export interface TariffItem {
  id: string;
  title: string;
  target: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
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
