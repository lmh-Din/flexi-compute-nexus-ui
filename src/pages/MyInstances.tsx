import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Zap, 
  MapPin, 
  Clock,
  DollarSign,
  Play,
  Square,
  RotateCcw,
  Settings,
  ExternalLink,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';

const MyInstances = () => {
  const { user } = useAuth();
  const { devices, orders, templates } = useData();
  const { toast } = useToast();

  // Get user's active orders and corresponding devices
  const userOrders = orders.filter(order => order.userId === user?.id);
  const activeOrders = userOrders.filter(order => order.status === 'ACTIVE');
  const completedOrders = userOrders.filter(order => order.status === 'COMPLETED');

  const getOrderDevice = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order ? devices.find(d => d.id === order.deviceId) : null;
  };

  const getOrderTemplates = (order: any) => {
    if (!order.applicationTemplates) return [];
    return templates.filter(t => order.applicationTemplates.includes(t.id));
  };

  const handleInstanceAction = (action: string, orderId: string) => {
    toast({
      title: `${action}操作`,
      description: `${action}功能正在开发中，敬请期待！`,
    });
  };

  const calculateRemainingTime = (order: any) => {
    if (order.status !== 'ACTIVE') return 0;
    const startTime = new Date(order.startTime).getTime();
    const duration = order.duration * 60 * 60 * 1000; // Convert hours to milliseconds
    const endTime = startTime + duration;
    const now = new Date().getTime();
    const remaining = Math.max(0, endTime - now);
    return Math.floor(remaining / (60 * 60 * 1000)); // Convert back to hours
  };

  const calculateUsageProgress = (order: any) => {
    if (order.status !== 'ACTIVE') return 100;
    const startTime = new Date(order.startTime).getTime();
    const duration = order.duration * 60 * 60 * 1000;
    const now = new Date().getTime();
    const elapsed = now - startTime;
    return Math.min(100, (elapsed / duration) * 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="status-available">运行中</Badge>;
      case 'COMPLETED':
        return <Badge className="status-offline">已完成</Badge>;
      case 'PENDING':
        return <Badge className="status-rented">待启动</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">已取消</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            我的实例
          </h1>
          <p className="text-muted-foreground">
            管理您租用的算力设备实例和部署的应用
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">活跃实例</p>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">历史实例</p>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">本月消费</p>
                  <p className="text-2xl font-bold">
                    ¥{userOrders.reduce((sum, order) => sum + order.totalCost, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">总使用时长</p>
                  <p className="text-2xl font-bold">
                    {userOrders.reduce((sum, order) => sum + order.duration, 0)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Instances */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">活跃实例</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeOrders.map((order) => {
                const device = getOrderDevice(order.id);
                const deployedApps = getOrderTemplates(order);
                const remainingHours = calculateRemainingTime(order);
                const usageProgress = calculateUsageProgress(order);
                
                if (!device) return null;

                return (
                  <Card key={order.id} className="glass-card hover:shadow-elevated transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {device.location} • 订单 #{order.id.slice(-6)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Device Specs */}
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
                          <div className="flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-accent" />
                            {device.gpuModel}
                          </div>
                        )}
                      </div>

                      {/* Usage Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>使用进度</span>
                          <span className="text-muted-foreground">
                            剩余 {remainingHours}h / {order.duration}h
                          </span>
                        </div>
                        <Progress value={usageProgress} className="h-2" />
                      </div>

                      {/* Deployed Apps */}
                      {deployedApps.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">已部署应用</div>
                          <div className="flex flex-wrap gap-2">
                            {deployedApps.map((app) => (
                              <Badge key={app.id} variant="outline" className="bg-primary/10">
                                {app.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cost Info */}
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground">费用</div>
                          <div className="font-semibold">¥{order.totalCost}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">单价</div>
                          <div className="font-semibold">¥{device.pricePerHour}/小时</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction('远程连接', order.id)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          连接
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction('重启实例', order.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          重启
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction('实例设置', order.id)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          设置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Historical Instances */}
        {completedOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">历史实例</h2>
            <div className="space-y-4">
              {completedOrders.map((order) => {
                const device = getOrderDevice(order.id);
                const deployedApps = getOrderTemplates(order);
                
                if (!device) return null;

                return (
                  <Card key={order.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Server className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.startTime).toLocaleDateString()} - 
                              {order.endTime && new Date(order.endTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">使用时长</div>
                            <div className="font-semibold">{order.duration}h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">总费用</div>
                            <div className="font-semibold">¥{order.totalCost}</div>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      {deployedApps.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">使用的应用：</span>
                            {deployedApps.map((app) => (
                              <Badge key={app.id} variant="secondary" className="text-xs">
                                {app.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {userOrders.length === 0 && (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Server className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">还没有租用实例</h3>
              <p className="text-muted-foreground text-center mb-6">
                前往算力市场租用您的第一台设备，开始您的算力之旅
              </p>
              <Button className="btn-gradient">
                前往算力市场
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyInstances;