export interface FinancialProduct {
  id: string;
  type: 'Insurance' | 'Mutual Fund';
  name: string;
  provider: string;
  desc: string;
  features: string[];
  badge?: string;
}

export interface Property {
  id: string;
  region: 'UAE' | 'India';
  category: 'Residential' | 'Commercial';
  title: string;
  location: string;
  price: number; // AED for UAE, INR for India
  yield?: number; // annual percentage dividend or rental yield
  type?: string; // apartment, villa, office, ready, grade-a, etc.
  highlights: string[];
  gradient?: string; // numerical background presets (1-6)
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  timestamp: string;
  propertyId?: string;
  propertyTitle?: string;
  status?: 'New' | 'Contacted' | 'Archived';
}
