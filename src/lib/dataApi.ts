import { supabase } from './supabaseClient';
import { FinancialProduct, Property, Inquiry } from '../types';

export async function fetchFinancialProducts(): Promise<FinancialProduct[]> {
  const { data, error } = await supabase
    .from('financial_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    provider: item.provider,
    desc: item.desc,
    features: item.features || [],
    badge: item.badge || undefined
  }));
}

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    region: item.region,
    category: item.category,
    title: item.title,
    location: item.location,
    price: Number(item.price),
    yield: item.yield || undefined,
    type: item.type || undefined,
    highlights: item.highlights || [],
    gradient: item.gradient || '1'
  }));
}

export async function createInquiry(inquiry: Inquiry) {
  const { error } = await supabase.from('inquiries').insert({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    interest: inquiry.interest,
    message: inquiry.message,
    property_id: inquiry.propertyId,
    property_title: inquiry.propertyTitle,
    timestamp_iso: inquiry.timestamp
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
