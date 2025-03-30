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
      console.error
