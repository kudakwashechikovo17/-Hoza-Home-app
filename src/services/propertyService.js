import mockData from './mockData';

// Simulates an API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Property Service
const PropertyService = {
  // Get all properties
  getAllProperties: async (filters = {}, limit = 20, offset = 0) => {
    try {
      // Simulate API call delay
      await delay(500);
      
      let filteredProperties = [...mockData.allProperties];
      
      // Apply filters
      if (filters) {
        // Filter by type (rent, sale)
        if (filters.type) {
          filteredProperties = filteredProperties.filter(p => p.type === filters.type);
        }
        
        // Filter by property type (apartment, house, villa, land)
        if (filters.propertyType && filters.propertyType !== 'any') {
          filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
        }
        
        // Filter by min price
        if (filters.priceMin && filters.priceMin > 0) {
          filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
        }
        
        // Filter by max price
        if (filters.priceMax && filters.priceMax < 10000000) {
          filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
        }
        
        // Filter by bedrooms
        if (filters.bedrooms && filters.bedrooms !== 'any') {
          const bedroomFilter = filters.bedrooms === '5+' 
            ? p => p.bedrooms >= 5
            : p => p.bedrooms === parseInt(filters.bedrooms);
          
          filteredProperties = filteredProperties.filter(bedroomFilter);
        }
        
        // Filter by bathrooms
        if (filters.bathrooms && filters.bathrooms !== 'any') {
          const bathroomFilter = filters.bathrooms === '4+' 
            ? p => p.bathrooms >= 4
            : p => p.bathrooms === parseInt(filters.bathrooms);
          
          filteredProperties = filteredProperties.filter(bathroomFilter);
        }
        
        // Filter by location (simple string match)
        if (filters.location) {
          const locationLower = filters.location.toLowerCase();
          filteredProperties = filteredProperties.filter(p => 
            p.location.toLowerCase().includes(locationLower)
          );
        }
        
        // Filter by amenities
        if (filters.amenities && filters.amenities.length > 0) {
          filteredProperties = filteredProperties.filter(p => 
            filters.amenities.every(amenity => p.amenities.includes(amenity))
          );
        }
        
        // Filter by keyword (search in title and description)
        if (filters.keyword) {
          const keywordLower = filters.keyword.toLowerCase();
          filteredProperties = filteredProperties.filter(p => 
            p.title.toLowerCase().includes(keywordLower) || 
            p.description.toLowerCase().includes(keywordLower)
          );
        }
      }
      
      // Get total count before pagination
      const totalCount = filteredProperties.length;
      
      // Apply pagination
      const paginatedProperties = filteredProperties.slice(offset, offset + limit);
      
      return {
        properties: paginatedProperties,
        totalCount,
        hasMore: offset + limit < totalCount,
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  // Get rental properties
  getRentalProperties: async (filters = {}, limit = 20, offset = 0) => {
    try {
      return await PropertyService.getAllProperties(
        { ...filters, type: 'rent' },
        limit,
        offset
      );
    } catch (error) {
      console.error('Error fetching rental properties:', error);
      throw error;
    }
  },
  
  // Get properties for sale
  getPropertiesForSale: async (filters = {}, limit = 20, offset = 0) => {
    try {
      return await PropertyService.getAllProperties(
        { ...filters, type: 'sale' },
        limit,
        offset
      );
    } catch (error) {
      console.error('Error fetching properties for sale:', error);
      throw error;
    }
  },
  
  // Get featured properties
  getFeaturedProperties: async (type = null, limit = 5) => {
    try {
      await delay(300);
      
      let featuredProperties = mockData.allProperties.filter(p => p.featured);
      
      if (type) {
        featuredProperties = featuredProperties.filter(p => p.type === type);
      }
      
      return featuredProperties.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  },
  
  // Get property by ID
  getPropertyById: async (propertyId) => {
    try {
      await delay(300);
      
      const property = mockData.allProperties.find(p => p.id === propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }
      
      return property;
    } catch (error) {
      console.error(`Error fetching property ${propertyId}:`, error);
      throw error;
    }
  },
  
  // Get properties by landlord
  getPropertiesByLandlord: async (landlordId, limit = 20, offset = 0) => {
    try {
      await delay(400);
      
      const properties = mockData.allProperties.filter(p => p.landlordId === landlordId);
      
      return {
        properties: properties.slice(offset, offset + limit),
        totalCount: properties.length,
        hasMore: offset + limit < properties.length,
      };
    } catch (error) {
      console.error(`Error fetching properties for landlord ${landlordId}:`, error);
      throw error;
    }
  },
  
  // Get properties by agent
  getPropertiesByAgent: async (agentId, limit = 20, offset = 0) => {
    try {
      await delay(400);
      
      const properties = mockData.allProperties.filter(p => p.agentId === agentId);
      
      return {
        properties: properties.slice(offset, offset + limit),
        totalCount: properties.length,
        hasMore: offset + limit < properties.length,
      };
    } catch (error) {
      console.error(`Error fetching properties for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  // Get saved properties for a user
  getSavedProperties: async (userId, limit = 20, offset = 0) => {
    try {
      await delay(400);
      
      let savedPropertyIds = [];
      
      // Find saved property ids based on user role
      Object.keys(mockData.users).forEach(role => {
        const user = mockData.users[role].find(u => u.id === userId);
        if (user && user.savedProperties) {
          savedPropertyIds = user.savedProperties;
        }
      });
      
      const savedProperties = mockData.allProperties.filter(p => 
        savedPropertyIds.includes(p.id)
      );
      
      return {
        properties: savedProperties.slice(offset, offset + limit),
        totalCount: savedProperties.length,
        hasMore: offset + limit < savedProperties.length,
      };
    } catch (error) {
      console.error(`Error fetching saved properties for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Toggle saved property for a user
  toggleSavedProperty: async (userId, propertyId) => {
    try {
      await delay(300);
      
      // In a real app, this would update the backend
      // For now, we'll just simulate a successful response
      
      return { success: true };
    } catch (error) {
      console.error(`Error toggling saved property ${propertyId} for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get similar properties
  getSimilarProperties: async (propertyId, limit = 4) => {
    try {
      await delay(300);
      
      const property = mockData.allProperties.find(p => p.id === propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Find similar properties based on type, location, and price range
      const similarProperties = mockData.allProperties.filter(p => 
        p.id !== propertyId &&
        p.type === property.type &&
        p.propertyType === property.propertyType &&
        Math.abs(p.price - property.price) / property.price < 0.3 // Within 30% price range
      );
      
      return similarProperties.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching similar properties for ${propertyId}:`, error);
      throw error;
    }
  },
  
  // Apply for a rental property
  applyForRental: async (userId, propertyId, applicationData) => {
    try {
      await delay(800);
      
      // In a real app, this would create an application in the backend
      // For now, we'll just simulate a successful response
      
      return { 
        success: true,
        applicationId: `app-${Date.now()}`,
        status: 'pending',
      };
    } catch (error) {
      console.error(`Error applying for property ${propertyId}:`, error);
      throw error;
    }
  },
  
  // Schedule a property viewing
  scheduleViewing: async (userId, propertyId, viewingData) => {
    try {
      await delay(600);
      
      // In a real app, this would create a viewing in the backend
      // For now, we'll just simulate a successful response
      
      return {
        success: true,
        viewingId: `view-${Date.now()}`,
        status: 'scheduled',
      };
    } catch (error) {
      console.error(`Error scheduling viewing for property ${propertyId}:`, error);
      throw error;
    }
  },
};

export default PropertyService;
