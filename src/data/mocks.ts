// FlexiCompute Mock Data

import { 
  User, 
  HostedDevice, 
  ApplicationTemplate, 
  RentalOrder, 
  PlatformStats,
  ChatMessage,
  DeviceSpecifications,
  NetworkInfo
} from '@/interfaces';

export const mockUsers: User[] = [
  { 
    id: 'user-1', 
    email: 'user@demo.com', 
    name: '普通用户小明', 
    role: 'USER',
    avatar: '/avatars/user1.jpg',
    createdAt: '2024-01-15T08:30:00Z',
    settings: {
      notifications: true,
      darkMode: true,
      language: 'zh-CN'
    }
  },
  { 
    id: 'user-2', 
    email: 'provider@demo.com', 
    name: '提供方小红', 
    role: 'USER',
    avatar: '/avatars/user2.jpg',
    createdAt: '2024-01-10T10:15:00Z',
    settings: {
      notifications: true,
      darkMode: true,
      language: 'zh-CN'
    }
  },
  { 
    id: 'admin-1', 
    email: 'admin@demo.com', 
    name: '超级管理员', 
    role: 'ADMIN',
    avatar: '/avatars/admin.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    settings: {
      notifications: true,
      darkMode: true,
      language: 'zh-CN'
    }
  },
];

const mockSpecifications: DeviceSpecifications[] = [
  {
    cpuModel: 'Intel Core i7-13700K',
    motherboard: 'ASUS ROG MAXIMUS Z790',
    diskType: 'NVME',
    networkSpeed: '1Gbps',
    operatingSystem: 'Ubuntu 22.04 LTS',
    additionalSoftware: ['Docker', 'NVIDIA Drivers', 'CUDA 12.0']
  },
  {
    cpuModel: 'AMD Ryzen 9 7950X',
    motherboard: 'MSI MEG X670E ACE',
    diskType: 'SSD',
    networkSpeed: '10Gbps',
    operatingSystem: 'CentOS 8',
    additionalSoftware: ['Docker', 'Kubernetes', 'PostgreSQL']
  },
  {
    cpuModel: 'Intel Core i5-12600K',
    motherboard: 'Gigabyte Z690 AORUS',
    diskType: 'NVME',
    networkSpeed: '1Gbps',
    operatingSystem: 'Windows Server 2022',
    additionalSoftware: ['Visual Studio Build Tools', 'Git', '.NET 6.0']
  }
];

const mockNetworkInfo: NetworkInfo[] = [
  {
    publicIP: '203.0.113.1',
    sshPort: 22,
    sshUsername: 'flexicompute',
    accessToken: 'fc_token_abc123'
  },
  {
    publicIP: '203.0.113.2',
    sshPort: 2222,
    sshUsername: 'root',
    accessToken: 'fc_token_def456'
  },
  {
    accessToken: 'fc_token_manual_789'
  }
];

export const mockDevices: HostedDevice[] = [
  { 
    id: 'dev-1', 
    ownerId: 'user-2', 
    name: '小红的RTX 4090游戏主机', 
    cpuCores: 8, 
    ramGB: 32, 
    gpuModel: 'NVIDIA RTX 4090', 
    storageGB: 1000, 
    status: 'AVAILABLE', 
    pricePerHour: 8.5,
    recommendedPrice: 9.2,
    connectionType: 'SSH',
    location: '北京',
    uptime: 99.8,
    rating: 4.9,
    totalHours: 1250,
    createdAt: '2024-02-01T10:00:00Z',
    lastActive: '2024-07-15T14:30:00Z',
    specifications: mockSpecifications[0],
    networkInfo: mockNetworkInfo[0]
  },
  { 
    id: 'dev-2', 
    ownerId: 'user-2', 
    name: '办公室AMD服务器', 
    cpuCores: 16, 
    ramGB: 64, 
    storageGB: 2000, 
    status: 'AVAILABLE', 
    pricePerHour: 6.0,
    recommendedPrice: 6.5,
    connectionType: 'SSH',
    location: '上海',
    uptime: 99.5,
    rating: 4.7,
    totalHours: 890,
    createdAt: '2024-02-10T15:30:00Z',
    lastActive: '2024-07-16T09:15:00Z',
    specifications: mockSpecifications[1],
    networkInfo: mockNetworkInfo[1]
  },
  { 
    id: 'dev-3', 
    ownerId: 'user-2', 
    name: '开发工作站', 
    cpuCores: 6, 
    ramGB: 16, 
    storageGB: 500, 
    status: 'RENTED', 
    pricePerHour: 3.5,
    connectionType: 'MANUAL',
    location: '深圳',
    uptime: 98.9,
    rating: 4.5,
    totalHours: 450,
    createdAt: '2024-02-20T11:00:00Z',
    lastActive: '2024-07-16T16:45:00Z',
    specifications: mockSpecifications[2],
    networkInfo: mockNetworkInfo[2]
  },
  {
    id: 'dev-4',
    ownerId: 'user-1',
    name: 'AI训练专用机',
    cpuCores: 12,
    ramGB: 48,
    gpuModel: 'NVIDIA RTX 4080',
    storageGB: 1500,
    status: 'OFFLINE',
    pricePerHour: 7.2,
    connectionType: 'SSH',
    location: '广州',
    uptime: 97.8,
    rating: 4.6,
    totalHours: 320,
    createdAt: '2024-03-01T09:30:00Z',
    lastActive: '2024-07-14T20:00:00Z',
    specifications: mockSpecifications[0],
    networkInfo: mockNetworkInfo[0]
  }
];

export const mockTemplates: ApplicationTemplate[] = [
  { 
    id: 'app-1', 
    name: 'Stable Diffusion WebUI', 
    description: '最流行的AI绘画应用，支持多种模型和插件', 
    iconUrl: '/icons/stable-diffusion.svg',
    category: 'AI & Machine Learning',
    minCpuCores: 4, 
    minRamGB: 8,
    minStorageGB: 20,
    requiredGpu: true,
    tags: ['AI', '图像生成', 'Stable Diffusion'],
    popularity: 95,
    version: '1.9.4',
    dockerImage: 'automaticai/stable-diffusion-webui:latest',
    ports: [7860],
    environmentVariables: {
      'WEBUI_PORT': '7860',
      'COMMANDLINE_ARGS': '--listen --enable-insecure-extension-access'
    }
  },
  { 
    id: 'app-2', 
    name: 'MySQL 数据库', 
    description: '高性能关系型数据库服务', 
    iconUrl: '/icons/mysql.svg',
    category: 'Database',
    minCpuCores: 2, 
    minRamGB: 4,
    minStorageGB: 10,
    requiredGpu: false,
    tags: ['数据库', 'MySQL', '关系型'],
    popularity: 88,
    version: '8.0',
    dockerImage: 'mysql:8.0',
    ports: [3306],
    environmentVariables: {
      'MYSQL_ROOT_PASSWORD': 'flexicompute123',
      'MYSQL_DATABASE': 'app_db'
    }
  },
  {
    id: 'app-3',
    name: 'Jupyter Notebook',
    description: '交互式Python开发环境，支持数据科学工作流',
    iconUrl: '/icons/jupyter.svg',
    category: 'Development',
    minCpuCores: 2,
    minRamGB: 4,
    minStorageGB: 5,
    requiredGpu: false,
    tags: ['Python', '数据科学', 'Notebook'],
    popularity: 85,
    version: '4.0.2',
    dockerImage: 'jupyter/scipy-notebook:latest',
    ports: [8888],
    environmentVariables: {
      'JUPYTER_ENABLE_LAB': 'yes'
    }
  },
  {
    id: 'app-4',
    name: 'ChatGLM-6B',
    description: '开源双语对话语言模型',
    iconUrl: '/icons/chatglm.svg',
    category: 'AI & Machine Learning',
    minCpuCores: 6,
    minRamGB: 16,
    minStorageGB: 50,
    requiredGpu: true,
    tags: ['LLM', '对话', 'ChatGLM'],
    popularity: 78,
    version: '6B',
    dockerImage: 'chatglm/chatglm-6b:latest',
    ports: [8000],
    environmentVariables: {
      'MODEL_PATH': '/models/chatglm-6b',
      'API_PORT': '8000'
    }
  },
  {
    id: 'app-5',
    name: 'Code Server',
    description: '基于浏览器的VS Code开发环境',
    iconUrl: '/icons/vscode.svg',
    category: 'Development',
    minCpuCores: 2,
    minRamGB: 4,
    minStorageGB: 10,
    requiredGpu: false,
    tags: ['IDE', 'VS Code', '开发环境'],
    popularity: 82,
    version: '4.21.1',
    dockerImage: 'codercom/code-server:latest',
    ports: [8080],
    environmentVariables: {
      'PASSWORD': 'flexicompute'
    }
  }
];

export const mockOrders: RentalOrder[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    deviceId: 'dev-3',
    status: 'ACTIVE',
    startTime: '2024-07-15T10:00:00Z',
    duration: 24,
    totalCost: 84.0,
    createdAt: '2024-07-15T09:45:00Z',
    applicationTemplates: ['app-1', 'app-3']
  },
  {
    id: 'order-2',
    userId: 'user-1',
    deviceId: 'dev-1',
    status: 'COMPLETED',
    startTime: '2024-07-10T14:00:00Z',
    endTime: '2024-07-11T14:00:00Z',
    duration: 24,
    totalCost: 204.0,
    createdAt: '2024-07-10T13:30:00Z',
    applicationTemplates: ['app-4']
  }
];

export const mockPlatformStats: PlatformStats = {
  totalDevices: 24,
  activeRentals: 8,
  totalUsers: 156,
  revenueThisMonth: 45690,
  utilizationRate: 73.5
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    type: 'assistant',
    content: '您好！我是FlexiCompute AI助手。请告诉我您需要什么样的算力设备，我会为您推荐最合适的选择。',
    timestamp: '2024-07-16T10:00:00Z'
  }
];