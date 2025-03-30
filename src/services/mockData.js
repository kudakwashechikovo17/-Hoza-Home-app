// Sample property data for testing and demo purposes

// Property images
const propertyImages = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
  'https://images.unsplash.com/photo-1503174971373-b1f69c758416',
];

// Property locations in Zimbabwe
const locations = [
  'Harare, Borrowdale',
  'Bulawayo, Suburbs',
  'Harare, Mount Pleasant',
  'Harare, Avondale',
  'Mutare, Murambi',
  'Bulawayo, Hillside',
  'Harare, Avenues',
  'Gweru, Windsor Park',
  'Harare, Greendale',
  'Victoria Falls, Landela',
];

// Property amenities
const amenities = [
  'Parking',
  'Swimming Pool',
  'Security',
  'Borehole',
  'Solar Power',
  'Furnished',
  'Garden',
  'DSTV',
  'Gym',
  'Balcony',
  'Wifi',
  'Air Conditioning',
];

// Generate random properties for rentals
export const rentalProperties = Array.from({ length: 20 }, (_, i) => {
  const bedrooms = Math.floor(Math.random() * 4) + 1;
  const bathrooms = Math.floor(Math.random() * 3) + 1;
  
  return {
    id: `rental-${i + 1}`,
    title: `${bedrooms} Bedroom House in ${locations[i % locations.length].split(',')[1].trim()}`,
    type: 'rent',
    propertyType: i % 2 === 0 ? 'house' : 'apartment',
    price: Math.floor(Math.random() * 1500) + 500,
    bedrooms,
    bathrooms,
    area: Math.floor(Math.random() * 1000) + 500,
    location: locations[i % locations.length],
    description: `Beautiful ${bedrooms} bedroom property located in a prime area of ${locations[i % locations.length]}. This property features ${bathrooms} bathrooms, spacious living areas, and a modern kitchen. Perfect for families or professionals.`,
    images: [
      propertyImages[i % propertyImages.length],
      propertyImages[(i + 1) % propertyImages.length],
      propertyImages[(i + 2) % propertyImages.length],
    ],
    amenities: Array.from(
      { length: Math.floor(Math.random() * 6) + 3 },
      (_, j) => amenities[(i + j) % amenities.length]
    ),
    landlordId: `l${Math.floor(Math.random() * 3) + 1}`,
    available: Math.random() > 0.2,
    featured: i < 5,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// Generate random properties for sale
export const propertiesForSale = Array.from({ length: 15 }, (_, i) => {
  const bedrooms = Math.floor(Math.random() * 5) + 2;
  const bathrooms = Math.floor(Math.random() * 4) + 1;
  
  return {
    id: `sale-${i + 1}`,
    title: `${bedrooms} Bedroom House for Sale in ${locations[i % locations.length].split(',')[1].trim()}`,
    type: 'sale',
    propertyType: i % 3 === 0 ? 'apartment' : i % 3 === 1 ? 'house' : 'villa',
    price: Math.floor(Math.random() * 200000) + 50000,
    bedrooms,
    bathrooms,
    area: Math.floor(Math.random() * 2000) + 1000,
    location: locations[i % locations.length],
    description: `Luxurious ${bedrooms} bedroom property for sale in ${locations[i % locations.length]}. Features include ${bathrooms} bathrooms, spacious living areas, modern kitchen, and beautiful surroundings. Great investment opportunity.`,
    images: [
      propertyImages[(i + 5) % propertyImages.length],
      propertyImages[(i + 6) % propertyImages.length],
      propertyImages[(i + 7) % propertyImages.length],
    ],
    amenities: Array.from(
      { length: Math.floor(Math.random() * 8) + 4 },
      (_, j) => amenities[(i + j) % amenities.length]
    ),
    agentId: `a${Math.floor(Math.random() * 3) + 1}`,
    featured: i < 4,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// Land for sale
export const landForSale = Array.from({ length: 10 }, (_, i) => {
  return {
    id: `land-${i + 1}`,
    title: `${Math.floor(Math.random() * 2000) + 200} sqm Land for Sale in ${locations[i % locations.length].split(',')[1].trim()}`,
    type: 'sale',
    propertyType: 'land',
    price: Math.floor(Math.random() * 50000) + 10000,
    bedrooms: 0,
    bathrooms: 0,
    area: Math.floor(Math.random() * 2000) + 200,
    location: locations[i % locations.length],
    description: `Prime land available for sale in ${locations[i % locations.length]}. Suitable for residential or commercial development. All papers are in order.`,
    images: [
      propertyImages[(i + 8) % propertyImages.length],
    ],
    amenities: ['Borehole', 'Electricity', 'Road Access'].filter(() => Math.random() > 0.3),
    agentId: `a${Math.floor(Math.random() * 3) + 1}`,
    featured: i < 2,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// Combine all properties
export const allProperties = [...rentalProperties, ...propertiesForSale, ...landForSale];

// Sample users for testing
export const users = {
  tenants: [
    {
      id: 't1',
      name: 'John Doe',
      email: 'tenant@example.com',
      phone: '+263 77 123 4567',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      savedProperties: ['rental-1', 'rental-5', 'rental-9'],
      rentedProperties: ['rental-3'],
      applications: [
        {
          id: 'app1',
          propertyId: 'rental-3',
          status: 'approved',
          appliedAt: '2023-06-15T08:30:00Z',
        },
        {
          id: 'app2',
          propertyId: 'rental-7',
          status: 'pending',
          appliedAt: '2023-07-20T14:15:00Z',
        },
      ],
    },
  ],
  landlords: [
    {
      id: 'l1',
      name: 'Sarah Smith',
      email: 'landlord@example.com',
      phone: '+263 77 765 4321',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      properties: rentalProperties.filter(p => p.landlordId === 'l1').map(p => p.id),
      tenants: ['t1'],
    },
  ],
  buyers: [
    {
      id: 'b1',
      name: 'Michael Johnson',
      email: 'buyer@example.com',
      phone: '+263 71 555 1234',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      savedProperties: ['sale-2', 'sale-5', 'land-1'],
      viewings: [
        {
          id: 'v1',
          propertyId: 'sale-3',
          date: '2023-08-12T10:00:00Z',
          status: 'completed',
        },
        {
          id: 'v2',
          propertyId: 'sale-7',
          date: '2023-08-25T14:30:00Z',
          status: 'scheduled',
        },
      ],
    },
  ],
  agents: [
    {
      id: 'a1',
      name: 'David Wilson',
      email: 'agent@example.com',
      phone: '+263 77 987 6543',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      properties: [...propertiesForSale, ...landForSale].filter(p => p.agentId === 'a1').map(p => p.id),
      clients: ['b1'],
      ratings: 4.8,
      reviews: 24,
    },
  ],
  admins: [
    {
      id: 'ad1',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+263 77 000 0000',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
  ],
};

// Sample notifications
export const notifications = [
  {
    id: 'n1',
    userId: 't1',
    title: 'Rent Due Reminder',
    message: 'Your rent payment is due in 3 days.',
    type: 'reminder',
    read: false,
    createdAt: '2023-07-28T09:15:00Z',
  },
  {
    id: 'n2',
    userId: 't1',
    title: 'Application Approved',
    message: 'Your application for the property has been approved!',
    type: 'application',
    read: true,
    createdAt: '2023-07-15T14:30:00Z',
  },
  {
    id: 'n3',
    userId: 't1',
    title: 'Maintenance Request',
    message: 'Your maintenance request has been scheduled for tomorrow.',
    type: 'maintenance',
    read: false,
    createdAt: '2023-07-25T11:45:00Z',
  },
  {
    id: 'n4',
    userId: 'l1',
    title: 'New Application',
    message: 'You have a new tenant application for your property.',
    type: 'application',
    read: false,
    createdAt: '2023-07-27T16:20:00Z',
  },
  {
    id: 'n5',
    userId: 'l1',
    title: 'Rent Payment Received',
    message: 'You have received a rent payment of $750.',
    type: 'payment',
    read: true,
    createdAt: '2023-07-03T10:10:00Z',
  },
  {
    id: 'n6',
    userId: 'b1',
    title: 'Property Price Reduced',
    message: 'A property in your saved list has reduced its price.',
    type: 'priceChange',
    read: false,
    createdAt: '2023-07-26T08:50:00Z',
  },
  {
    id: 'n7',
    userId: 'a1',
    title: 'New Lead',
    message: 'You have a new lead interested in one of your listings.',
    type: 'lead',
    read: false,
    createdAt: '2023-07-29T13:25:00Z',
  },
];

// Sample lease agreements
export const leaseAgreements = [
  {
    id: 'lease1',
    propertyId: 'rental-3',
    tenantId: 't1',
    landlordId: 'l1',
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2024-05-31T23:59:59Z',
    rentAmount: 850,
    securityDeposit: 850,
    status: 'active',
    terms: [
      'Rent is due on the 1st of each month',
      'Pets are allowed with additional deposit',
      'No smoking inside the property',
      'Tenant is responsible for utilities',
    ],
    documents: [
      { id: 'doc1', name: 'Lease Agreement', url: '#', uploadedAt: '2023-05-25T10:20:00Z' },
      { id: 'doc2', name: 'Property Inspection', url: '#', uploadedAt: '2023-05-28T09:15:00Z' },
    ],
    payments: [
      { id: 'pay1', amount: 850, date: '2023-06-01T08:30:00Z', status: 'completed' },
      { id: 'pay2', amount: 850, date: '2023-07-01T09:45:00Z', status: 'completed' },
      { id: 'pay3', amount: 850, date: '2023-08-01T00:00:00Z', status: 'pending' },
    ],
  },
];

// Sample maintenance requests
export const maintenanceRequests = [
  {
    id: 'maint1',
    propertyId: 'rental-3',
    tenantId: 't1',
    landlordId: 'l1',
    title: 'Leaking Kitchen Faucet',
    description: 'The kitchen faucet has been leaking for two days now.',
    priority: 'medium',
    status: 'scheduled',
    createdAt: '2023-07-24T14:20:00Z',
    scheduledDate: '2023-07-31T10:00:00Z',
    updates: [
      { date: '2023-07-24T16:45:00Z', message: 'Maintenance request received', by: 'system' },
      { date: '2023-07-25T09:30:00Z', message: 'Plumber scheduled for Monday', by: 'landlord' },
    ],
    images: ['https://example.com/image1.jpg'],
  },
];

// Sample rent payments
export const rentPayments = [
  {
    id: 'payment1',
    leaseId: 'lease1',
    amount: 850,
    dueDate: '2023-08-01T00:00:00Z',
    status: 'pending',
    method: null,
    reference: null,
  },
  {
    id: 'payment2',
    leaseId: 'lease1',
    amount: 850,
    dueDate: '2023-07-01T00:00:00Z',
    paidDate: '2023-07-01T09:45:00Z',
    status: 'completed',
    method: 'ecocash',
    reference: 'ECO123456789',
  },
  {
    id: 'payment3',
    leaseId: 'lease1',
    amount: 850,
    dueDate: '2023-06-01T00:00:00Z',
    paidDate: '2023-06-01T08:30:00Z',
    status: 'completed',
    method: 'bank',
    reference: 'TRX987654321',
  },
];

// Sample property viewings (for buyers/agents)
export const propertyViewings = [
  {
    id: 'view1',
    propertyId: 'sale-3',
    buyerId: 'b1',
    agentId: 'a1',
    date: '2023-08-12T10:00:00Z',
    status: 'completed',
    notes: 'Client was impressed with the property layout',
  },
  {
    id: 'view2',
    propertyId: 'sale-7',
    buyerId: 'b1',
    agentId: 'a1',
    date: '2023-08-25T14:30:00Z',
    status: 'scheduled',
  },
];

// Export everything in a convenient object
export const mockData = {
  rentalProperties,
  propertiesForSale,
  landForSale,
  allProperties,
  users,
  notifications,
  leaseAgreements,
  maintenanceRequests,
  rentPayments,
  propertyViewings,
};

export default mockData;
