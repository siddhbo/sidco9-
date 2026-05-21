import { FinancialProduct, Property } from '../types';

export const DEFAULT_FINANCIAL_PRODUCTS: FinancialProduct[] = [
  {
    id: 'f1',
    type: 'Insurance',
    name: 'Term Life Protect Plus',
    provider: 'HDFC Life / Max Life (Vetted Partners)',
    desc: 'Dual-jurisdiction compliant term plan with high cover. Specially tailored for NRI families in the GCC, offering critical illness acceleration riders and estate planning clauses.',
    features: ['Up to ₹5 Cr ($600k) Cover', 'World-wide Critical Illness Rider', 'Tax benefits under Sec 80C', 'Remittance-compliant claim execution'],
    badge: 'Popular'
  },
  {
    id: 'f2',
    type: 'Insurance',
    name: 'Global Health Secure Elite',
    provider: 'Aditya Birla / Care Health',
    desc: 'Premium health security with worldwide cashless treatment, international air ambulance, and emergency care covering both Indian repatriation and direct hospital visits in Dubai.',
    features: ['Global cashless network', '₹1 Cr+ Cover options', 'Sovereignty / Outbound benefits', 'No-claim compounding bonus'],
    badge: 'Elite Protection'
  },
  {
    id: 'f3',
    type: 'Mutual Fund',
    name: 'Multi-Asset Growth Portfolio',
    provider: 'Parag Parikh / ICICI Prudential',
    desc: 'Vigorous equity-oriented blend containing domestic Indian blue-chips and tactical tech exposures. NRI KYC-compliant with simplified non-repatriable routing options.',
    features: ['SIP Ready', 'Tax-efficient rebalancing', 'Direct plan yield advantages', 'Automatic portfolio sweep'],
    badge: 'Invester Favorite'
  },
  {
    id: 'f4',
    type: 'Mutual Fund',
    name: 'INR-AED Sovereign Hedged Fund',
    provider: 'SBI Mutual Fund / Nippon India',
    desc: 'Dynamic asset allocation plan targeting stability. Automatically balances between high-dividend equities and fixed-income bonds to hedge rupee fluctuation against a pegged dirham.',
    features: ['Auto asset rebalancing', 'Lower volatility metrics', 'Quarterly distribution payouts', 'Rupee depreciation buffer'],
    badge: 'Steady Compounder'
  }
];

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 'p1',
    region: 'UAE',
    category: 'Residential',
    title: 'Marina Vista Residences',
    location: 'Emaar Beachfront, Dubai Marina',
    price: 2100000,
    yield: 6.8,
    type: '1-3 BR Luxury Apartments',
    highlights: ['Direct beach access', 'Handover Q4 2027', 'Interests-free payment structure', 'High capital appreciation zone'],
    gradient: '1'
  },
  {
    id: 'p2',
    region: 'UAE',
    category: 'Commercial',
    title: 'Business Bay Executive Hub',
    location: 'Central Financial Strip, Dubai',
    price: 3500000,
    yield: 8.2,
    type: 'Grade-A Premium Offices',
    highlights: ['Vetted corporate leases', 'High rental occupancy rate', 'Zero corporate tax bracket', 'Dedicated concierge services'],
    gradient: '2'
  },
  {
    id: 'p3',
    region: 'UAE',
    category: 'Residential',
    title: 'Palm Signature Villas',
    location: 'Frond G, Palm Jumeirah',
    price: 12500000,
    yield: 5.5,
    type: '4-5 BR Bespoke Villas',
    highlights: ['Private beachfront infinity pool', 'Architectural excellence prize', 'Immediate possession', 'Secure gated elite precinct'],
    gradient: '4'
  },
  {
    id: 'p4',
    region: 'UAE',
    category: 'Commercial',
    title: 'Downtown Retail Promenade',
    location: 'Opera District, Downtown Dubai',
    price: 5800000,
    yield: 7.9,
    type: 'High-Footfall Retail Units',
    highlights: ['Anchored by global retail luxury brands', 'Triple net leases in place', '10-year term agreements', 'Direct boulevard views'],
    gradient: '3'
  },
  {
    id: 'ip1',
    region: 'India',
    category: 'Residential',
    title: 'Bandra Sea-View Sky Villas',
    location: 'Carter Road, Bandra West, Mumbai',
    price: 85000000,
    yield: 3.2,
    type: 'Undeclared Premium ready',
    highlights: ['Unobstructed Arabian Sea vistas', 'Double height ceilings', 'Private elevator access', 'Vetted Title deed clearance'],
    gradient: '5'
  },
  {
    id: 'ip2',
    region: 'India',
    category: 'Commercial',
    title: 'Cyber City Grade-A Complex',
    location: 'Sector 24, Cyber City, Gurgaon',
    price: 120000000,
    yield: 7.5,
    type: 'Premium Managed Office Spaces',
    highlights: ['Fully leased to Fortune 500 tech firm', 'Pre-leased return guarantee', 'Walking distance to Metro node', 'Triple A rating compliance'],
    gradient: '6'
  },
  {
    id: 'ip3',
    region: 'India',
    category: 'Residential',
    title: 'Whitefield Serenade Estates',
    location: 'ITPL Boulevard, Bangalore',
    price: 45000000,
    yield: 4.5,
    type: '4 BHK Luxury Ville Estates',
    highlights: ['Private landscaped garden plot', 'Solar power grid passive credits', 'Vastu-compliant architectures', 'Clubhouse and sports facilities'],
    gradient: '4'
  },
  {
    id: 'ip4',
    region: 'India',
    category: 'Commercial',
    title: 'Koregaon Park Tech Plaza',
    location: 'Lane 7, Koregaon Park, Pune',
    price: 68000000,
    yield: 7.2,
    type: 'Premium Coworking Hub',
    highlights: ['Co-working operator lease anchor', '8% escalation term annual clause', 'High capacity tech server infrastructure', 'Full backup utilities'],
    gradient: '3'
  }
];
