import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  HostedDevice, 
  ApplicationTemplate, 
  RentalOrder, 
  PlatformStats,
  ChatMessage 
} from '@/interfaces';
import { 
  mockDevices as initialDevices, 
  mockTemplates as initialTemplates,
  mockOrders as initialOrders,
  mockPlatformStats,
  mockChatMessages
} from '@/data/mocks';

interface DataContextType {
  // Data
  devices: HostedDevice[];
  templates: ApplicationTemplate[];
  orders: RentalOrder[];
  stats: PlatformStats;
  chatMessages: ChatMessage[];
  favoriteDevices: string[];
  
  // Device operations
  addDevice: (device: Omit<HostedDevice, 'id' | 'createdAt' | 'lastActive'>) => void;
  updateDevice: (id: string, updates: Partial<HostedDevice>) => void;
  rentDevice: (deviceId: string, userId: string, duration: number) => void;
  toggleFavoriteDevice: (deviceId: string) => void;
  
  // Template operations
  addTemplate: (template: Omit<ApplicationTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<ApplicationTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // Order operations
  addOrder: (order: Omit<RentalOrder, 'id' | 'createdAt'>) => void;
  updateOrder: (id: string, updates: Partial<RentalOrder>) => void;
  
  // Chat operations
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  // Stats
  updateStats: (updates: Partial<PlatformStats>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<HostedDevice[]>(initialDevices);
  const [templates, setTemplates] = useState<ApplicationTemplate[]>(initialTemplates);
  const [orders, setOrders] = useState<RentalOrder[]>(initialOrders);
  const [stats, setStats] = useState<PlatformStats>(mockPlatformStats);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [favoriteDevices, setFavoriteDevices] = useState<string[]>([]);

  // Device operations
  const addDevice = useCallback((deviceData: Omit<HostedDevice, 'id' | 'createdAt' | 'lastActive'>) => {
    const newDevice: HostedDevice = {
      ...deviceData,
      id: `dev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      uptime: 100,
      rating: 0,
      totalHours: 0,
    };
    setDevices(prev => [...prev, newDevice]);
  }, []);

  const updateDevice = useCallback((id: string, updates: Partial<HostedDevice>) => {
    setDevices(prev => prev.map(device => 
      device.id === id ? { ...device, ...updates, lastActive: new Date().toISOString() } : device
    ));
  }, []);

  const rentDevice = useCallback((deviceId: string, userId: string, duration: number) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || device.status !== 'AVAILABLE') return;

    // Update device status
    updateDevice(deviceId, { status: 'RENTED' });

    // Create new order
    const newOrder: RentalOrder = {
      id: `order-${Date.now()}`,
      userId,
      deviceId,
      status: 'ACTIVE',
      startTime: new Date().toISOString(),
      duration,
      totalCost: device.pricePerHour * duration,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [...prev, newOrder]);
  }, [devices, updateDevice]);

  // Template operations
  const addTemplate = useCallback((templateData: Omit<ApplicationTemplate, 'id'>) => {
    const newTemplate: ApplicationTemplate = {
      ...templateData,
      id: `app-${Date.now()}`,
    };
    setTemplates(prev => [...prev, newTemplate]);
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<ApplicationTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...updates } : template
    ));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  // Order operations
  const addOrder = useCallback((orderData: Omit<RentalOrder, 'id' | 'createdAt'>) => {
    const newOrder: RentalOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<RentalOrder>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  }, []);

  // Chat operations
  const addChatMessage = useCallback((messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([{
      id: 'msg-welcome',
      type: 'assistant',
      content: '您好！我是FlexiCompute AI助手。请告诉我您需要什么样的算力设备，我会为您推荐最合适的选择。',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // Favorite operations
  const toggleFavoriteDevice = useCallback((deviceId: string) => {
    setFavoriteDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  }, []);

  // Stats
  const updateStats = useCallback((updates: Partial<PlatformStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    devices,
    templates,
    orders,
    stats,
    chatMessages,
    favoriteDevices,
    addDevice,
    updateDevice,
    rentDevice,
    toggleFavoriteDevice,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addOrder,
    updateOrder,
    addChatMessage,
    clearChat,
    updateStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};