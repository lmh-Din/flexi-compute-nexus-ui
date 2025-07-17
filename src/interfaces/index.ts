// FlexiCompute Platform Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface HostedDevice {
  id: string;
  ownerId: string;
  name: string;
  type: 'CPU' | 'GPU'; // 设备类型
  cpuCores: number;
  ramGB: number;
  gpuModel?: string;
  gpuCount?: number; // GPU数量
  storageGB: number;
  status: 'AVAILABLE' | 'RENTED' | 'OFFLINE' | 'MAINTENANCE';
  pricePerHour: number;
  pricePerCore?: number; // CPU设备：每核心每小时价格
  pricePerGpu?: number; // GPU设备：每卡每小时价格
  recommendedPrice?: number;
  connectionType: 'SSH' | 'MANUAL';
  location: string;
  uptime: number; // percentage
  rating: number; // 1-5 stars
  totalHours: number;
  createdAt: string;
  lastActive: string;
  specifications?: DeviceSpecifications;
  networkInfo?: NetworkInfo;
}

export interface DeviceSpecifications {
  cpuModel: string;
  motherboard: string;
  diskType: 'SSD' | 'HDD' | 'NVME';
  networkSpeed: string; // e.g., "1Gbps"
  operatingSystem: string;
  additionalSoftware: string[];
}

export interface NetworkInfo {
  publicIP?: string;
  sshPort?: number;
  sshUsername?: string;
  accessToken?: string;
}

export interface ApplicationTemplate {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  minCpuCores: number;
  minRamGB: number;
  minStorageGB: number;
  requiredGpu: boolean;
  tags: string[];
  popularity: number;
  version: string;
  dockerImage?: string;
  installScript?: string;
  ports: number[];
  environmentVariables: Record<string, string>;
}

export interface RentalOrder {
  id: string;
  userId: string;
  deviceId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  duration: number; // hours
  totalCost: number;
  createdAt: string;
  applicationTemplates?: string[]; // deployed apps
}

export interface Bill {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface PlatformStats {
  totalDevices: number;
  activeRentals: number;
  totalUsers: number;
  revenueThisMonth: number;
  utilizationRate: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: DeviceRecommendation[];
}

export interface DeviceRecommendation {
  deviceId: string;
  score: number;
  reason: string;
}

export interface NotificationSettings {
  deviceAvailable: boolean;
  priceAlerts: boolean;
  systemUpdates: boolean;
  promotions: boolean;
}

export interface PricingStrategy {
  id: string;
  deviceId: string;
  basePrice: number;
  peakHourMultiplier: number;
  weekendMultiplier: number;
  discountThreshold: number; // hours
  discountRate: number; // percentage
  dynamicPricing: boolean;
}