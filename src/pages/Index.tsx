import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  MapPin, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Index = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { devices, stats } = useData();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/devices':
        return '算力市场';
      case '/apps':
        return '应用商店';
      case '/my-devices':
        return '我的实例';
      case '/billing':
        return '账单管理';
      case '/host-devices':
        return '托管设备';
      case '/admin':
        return '管理后台';
      default:
        return 'FlexiCompute';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="status-available">可用</Badge>;
      case 'RENTED':
        return <Badge className="status-rented">已租用</Badge>;
      case 'OFFLINE':
        return <Badge className="status-offline">离线</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (location.pathname === '/devices') {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  云算力市场
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                租用高性能计算设备，按小时付费，即开即用。从AI训练到软件开发，满足您的所有算力需求。
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.totalDevices}</div>
                  <div className="text-sm text-muted-foreground">可用设备</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{stats.activeRentals}</div>
                  <div className="text-sm text-muted-foreground">活跃租用</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">{stats.utilizationRate}%</div>
                  <div className="text-sm text-muted-foreground">使用率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">{stats.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">用户数</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="btn-gradient">
                  <Sparkles className="mr-2 h-5 w-5" />
                  智能推荐
                </Button>
                <Button size="lg" variant="outline">
                  浏览所有设备
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">推荐设备</h2>
            <Button variant="outline">查看全部</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.slice(0, 6).map((device) => (
              <Card key={device.id} className="glass-card hover:shadow-elevated transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    {getStatusBadge(device.status)}
                  </div>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {device.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                      {device.cpuCores} 核心
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-muted-foreground" />
                      {device.ramGB}GB 内存
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="w-4 h-4 mr-2 text-muted-foreground" />
                      {device.storageGB}GB 存储
                    </div>
                    {device.gpuModel && (
                      <div className="flex items-center col-span-2">
                        <Sparkles className="w-4 h-4 mr-2 text-accent" />
                        {device.gpuModel}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {device.rating}/5.0
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      {device.uptime}% 运行时间
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ¥{device.pricePerHour}
                      </div>
                      <div className="text-sm text-muted-foreground">每小时</div>
                    </div>
                    <Button 
                      className={device.status === 'AVAILABLE' ? 'btn-glow' : ''} 
                      disabled={device.status !== 'AVAILABLE'}
                    >
                      {device.status === 'AVAILABLE' ? '立即租用' : '不可用'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for other pages
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {getPageTitle()}
        </h1>
        <p className="text-xl text-muted-foreground">
          欢迎，{user?.name}！这个页面正在开发中...
        </p>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
          <span className="text-muted-foreground">功能开发中</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
