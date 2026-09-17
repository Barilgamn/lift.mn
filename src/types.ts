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
