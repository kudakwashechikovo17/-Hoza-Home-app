import mockData from './mockData';

// Simulates an API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// User Service
const UserService = {
  // Get user by ID
  getUserById: async (userId) => {
    try {
      await delay(300);
      
      let user = null;
      
      // Search for user in all user types
      Object.keys(mockData.users).forEach(role => {
        const foundUser = mockData.users[role].find(u => u.id === userId);
        if (foundUser) {
          user = foundUser;
        }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get notifications for a user
  getNotifications: async (userId, limit = 20, offset = 0) => {
    try {
      await delay(400);
      
      const notifications = mockData.notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return {
        notifications: notifications.slice(offset, offset + limit),
        totalCount: notifications.length,
        hasMore: offset + limit < notifications.length,
        unreadCount: notifications.filter(n => !n.read).length,
      };
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      await delay(200);
      
      // In a real app, this would update the notification in the backend
      // For now, we'll just simulate a successful response
      
      return { success: true };
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId) => {
    try {
      await delay(300);
      
      // In a real app, this would update all notifications in the backend
      // For now, we'll just simulate a successful response
      
      return { success: true };
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      await delay(500);
      
      // In a real app, this would update the user profile in the backend
      // For now, we'll just simulate a successful response
      
      return { 
        success: true,
        user: {
          ...profileData,
          id: userId,
        }
      };
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      await delay(500);
      
      // In a real app, this would validate the current password and update in the backend
      // For now, we'll just simulate a successful response if current password is 'password'
      
      if (currentPassword !== 'password') {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error changing password for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get lease agreements for a user (tenant or landlord)
  getLeaseAgreements: async (userId, role) => {
    try {
      await delay(400);
      
      let leases = [];
      
      if (role === 'tenant') {
        leases = mockData.leaseAgreements.filter(l => l.tenantId === userId);
      } else if (role === 'landlord') {
        leases = mockData.leaseAgreements.filter(l => l.landlordId === userId);
      }
      
      // Get full property details for each lease
      const leasesWithDetails = await Promise.all(leases.map(async (lease) => {
        const property = mockData.allProperties.find(p => p.id === lease.propertyId);
        
        let tenant = null;
        if (role === 'landlord') {
          tenant = mockData.users.tenants.find(t => t.id === lease.tenantId);
        }
        
        let landlord = null;
        if (role === 'tenant') {
          landlord = mockData.users.landlords.find(l => l.id === lease.landlordId);
        }
        
        return {
          ...lease,
          property,
          tenant: tenant ? {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
            avatar: tenant.avatar,
          } : null,
          landlord: landlord ? {
            id: landlord.id,
            name: landlord.name,
            email: landlord.email,
            phone: landlord.phone,
            avatar: landlord.avatar,
          } : null,
        };
      }));
      
      return leasesWithDetails;
    } catch (error) {
      console.error(`Error fetching lease agreements for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get pending rent payments
  getPendingRentPayments: async (userId, role) => {
    try {
      await delay(300);
      
      let leases = [];
      
      if (role === 'tenant') {
        leases = mockData.leaseAgreements.filter(l => l.tenantId === userId && l.status === 'active');
      } else if (role === 'landlord') {
        leases = mockData.leaseAgreements.filter(l => l.landlordId === userId && l.status === 'active');
      }
      
      const pendingPayments = mockData.rentPayments.filter(p => 
        leases.some(l => l.id === p.leaseId) && p.status === 'pending'
      );
      
      // Get full details for each payment
      const paymentsWithDetails = await Promise.all(pendingPayments.map(async (payment) => {
        const lease = leases.find(l => l.id === payment.leaseId);
        const property = mockData.allProperties.find(p => p.id === lease.propertyId);
        
        let tenant = null;
        if (role === 'landlord') {
          tenant = mockData.users.tenants.find(t => t.id === lease.tenantId);
        }
        
        let landlord = null;
        if (role === 'tenant') {
          landlord = mockData.users.landlords.find(l => l.id === lease.landlordId);
        }
        
        return {
          ...payment,
          lease: {
            id: lease.id,
            startDate: lease.startDate,
            endDate: lease.endDate,
          },
          property: {
            id: property.id,
            title: property.title,
            location: property.location,
            image: property.images[0],
          },
          tenant: tenant ? {
            id: tenant.id,
            name: tenant.name,
          } : null,
          landlord: landlord ? {
            id: landlord.id,
            name: landlord.name,
          } : null,
        };
      }));
      
      return paymentsWithDetails;
    } catch (error) {
      console.error(`Error fetching pending rent payments for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get maintenance requests
  getMaintenanceRequests: async (userId, role, status = null) => {
    try {
      await delay(400);
      
      let requests = [];
      
      if (role === 'tenant') {
        requests = mockData.maintenanceRequests.filter(r => r.tenantId === userId);
      } else if (role === 'landlord') {
        requests = mockData.maintenanceRequests.filter(r => r.landlordId === userId);
      }
      
      if (status) {
        requests = requests.filter(r => r.status === status);
      }
      
      // Get full property details for each request
      const requestsWithDetails = await Promise.all(requests.map(async (request) => {
        const property = mockData.allProperties.find(p => p.id === request.propertyId);
        
        let tenant = null;
        if (role === 'landlord') {
          tenant = mockData.users.tenants.find(t => t.id === request.tenantId);
        }
        
        let landlord = null;
        if (role === 'tenant') {
          landlord = mockData.users.landlords.find(l => l.id === request.landlordId);
        }
        
        return {
          ...request,
          property: {
            id: property.id,
            title: property.title,
            location: property.location,
            image: property.images[0],
          },
          tenant: tenant ? {
            id: tenant.id,
            name: tenant.name,
            avatar: tenant.avatar,
          } : null,
          landlord: landlord ? {
            id: landlord.id,
            name: landlord.name,
            avatar: landlord.avatar,
          } : null,
        };
      }));
      
      return requestsWithDetails;
    } catch (error) {
      console.error(`Error fetching maintenance requests for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Create a maintenance request
  createMaintenanceRequest: async (userId, propertyId, requestData) => {
    try {
      await delay(500);
      
      // In a real app, this would create a request in the backend
      // For now, we'll just simulate a successful response
      
      return {
        success: true,
        requestId: `maint-${Date.now()}`,
        status: 'pending',
      };
    } catch (error) {
      console.error(`Error creating maintenance request for property ${propertyId}:`, error);
      throw error;
    }
  },
  
  // Get property viewings (for buyers/agents)
  getPropertyViewings: async (userId, role) => {
    try {
      await delay(400);
      
      let viewings = [];
      
      if (role === 'buyer') {
        viewings = mockData.propertyViewings.filter(v => v.buyerId === userId);
      } else if (role === 'agent') {
        viewings = mockData.propertyViewings.filter(v => v.agentId === userId);
      }
      
      // Get full property details for each viewing
      const viewingsWithDetails = await Promise.all(viewings.map(async (viewing) => {
        const property = mockData.allProperties.find(p => p.id === viewing.propertyId);
        
        let buyer = null;
        if (role === 'agent') {
          buyer = mockData.users.buyers.find(b => b.id === viewing.buyerId);
        }
        
        let agent = null;
        if (role === 'buyer') {
          agent = mockData.users.agents.find(a => a.id === viewing.agentId);
        }
        
        return {
          ...viewing,
          property: {
            id: property.id,
            title: property.title,
            location: property.location,
            price: property.price,
            image: property.images[0],
          },
          buyer: buyer ? {
            id: buyer.id,
            name: buyer.name,
            avatar: buyer.avatar,
          } : null,
          agent: agent ? {
            id: agent.id,
            name: agent.name,
            avatar: agent.avatar,
          } : null,
        };
      }));
      
      return viewingsWithDetails;
    } catch (error) {
      console.error(`Error fetching property viewings for user ${userId}:`, error);
      throw error;
    }
  },
};

export default UserService;
