import { fetchFinancialProducts, fetchProperties, createInquiry } from './dataApi';
import { FinancialProduct, Property, Inquiry } from '../types';
import { DEFAULT_FINANCIAL_PRODUCTS, DEFAULT_PROPERTIES } from '../data/defaultData';

export async function loadCatalogFromCloud(): Promise<{
  financials: FinancialProduct[];
  properties: Property[];
}> {
  try {
    const [fin, props] = await Promise.all([fetchFinancialProducts(), fetchProperties()]);

    return {
      financials: fin && fin.length ? fin : DEFAULT_FINANCIAL_PRODUCTS,
      properties: props && props.length ? props : DEFAULT_PROPERTIES
    };
  } catch (e) {
    // Cloud is optional; fallback to defaults
    return {
      financials: DEFAULT_FINANCIAL_PRODUCTS,
      properties: DEFAULT_PROPERTIES
    };
  }
}

export async function submitInquiryToCloud(inquiry: Inquiry) {
  return createInquiry(inquiry);
}
