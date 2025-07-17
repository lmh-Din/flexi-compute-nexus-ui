import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Cpu, 
  HardDrive, 
  Zap, 
  MapPin, 
  Terminal,
  Play,
  Settings,
  Upload,
  Wifi,
  Monitor,
  CheckCircle,
  Clock,
  Star,
  DollarSign,
  BarChart3,
  TrendingUp,
  Server,
  ChevronRight,
  Activity
} from 'lucide-react';

const HostDevices = () => {
  const { user } = useAuth();
  const { devices, addDevice, updateDevice } = useData();
  const { toast } = useToast();
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [step, setStep] = useState(1);
  const [connectionType, setConnectionType] = useState<'SSH' | 'MANUAL'>('SSH');
  const [monitoringDevice, setMonitoringDevice] = useState<string | null>(null);
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    type: 'CPU' as 'CPU' | 'GPU',
    location: '',
    cpuCores: 4,
    ramGB: 8,
    storageGB: 500,
    gpuModel: '',
    gpuCount: 1,
    connectionInfo: {
      publicIP: '',
      sshPort: 22,
      sshUsername: '',
    },
    pricing: 5.0
  });

  const userDevices = devices.filter(device => device.ownerId === user?.id);

  const handleAddDevice = () => {
    const isGpuDevice = deviceForm.type === 'GPU';
    const pricePerCore = isGpuDevice ? undefined : deviceForm.pricing / deviceForm.cpuCores;
    const pricePerGpu = isGpuDevice ? deviceForm.pricing / deviceForm.gpuCount : undefined;

    const newDevice = {
      ownerId: user?.id || '',
      name: deviceForm.name,
      type: deviceForm.type,
      cpuCores: deviceForm.cpuCores,
      ramGB: deviceForm.ramGB,
      storageGB: deviceForm.storageGB,
      gpuModel: deviceForm.gpuModel || undefined,
      gpuCount: isGpuDevice ? deviceForm.gpuCount : undefined,
      status: 'OFFLINE' as const,
      pricePerHour: deviceForm.pricing,
      pricePerCore,
      pricePerGpu,
      connectionType,
      location: deviceForm.location,
      uptime: 0,
      rating: 0,
      totalHours: 0,
    };

    addDevice(newDevice);
    toast({
      title: "设备托管成功！",
      description: "您的设备已成功添加到托管列表。",
    });
    setIsAddingDevice(false);
    setStep(1);
    setDeviceForm({
      name: '',
      type: 'CPU',
      location: '',
      cpuCores: 4,
      ramGB: 8,
      storageGB: 500,
      gpuModel: '',
      gpuCount: 1,
      connectionInfo: {
        publicIP: '',
        sshPort: 22,
        sshUsername: '',
      },
      pricing: 5.0
    });
  };

  const handleDeviceAction = (action: string, deviceId: string) => {
    if (action === '监控查看') {
      setMonitoringDevice(deviceId);
    } else {
      toast({
        title: `${action}功能`,
        description: `${action}功能正在开发中，敬请期待！`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="status-available">已上架</Badge>;
      case 'RENTED':
        return <Badge className="status-rented">租用中</Badge>;
      case 'OFFLINE':
        return <Badge className="status-offline">离线</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="secondary">维护中</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              托管设备管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理您托管的设备，设置定价策略，监控设备状态
            </p>
          </div>
          
          <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-5 w-5" />
                新增托管设备
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加托管设备</DialogTitle>
                <DialogDescription>
                  通过几个简单步骤将您的设备添加到FlexiCompute平台
                </DialogDescription>
              </DialogHeader>

              <Tabs value={step.toString()} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1">接入方式</TabsTrigger>
                  <TabsTrigger value="2">硬件配置</TabsTrigger>
                  <TabsTrigger value="3">定价策略</TabsTrigger>
                </TabsList>

                <TabsContent value="1" className="space-y-4">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">选择设备接入方式</Label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${
                          connectionType === 'SSH' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConnectionType('SSH')}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <Terminal className="h-6 w-6 text-primary" />
                            <div>
                              <CardTitle className="text-lg">云端SSH接入</CardTitle>
                              <CardDescription>
                                通过SSH协议远程管理设备，需要提供设备公网IP和SSH账号
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        {connectionType === 'SSH' && (
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="publicIP">公网IP</Label>
                                <Input
                                  id="publicIP"
                                  placeholder="203.0.113.1"
                                  value={deviceForm.connectionInfo.publicIP}
                                  onChange={(e) => setDeviceForm(prev => ({
                                    ...prev,
                                    connectionInfo: { ...prev.connectionInfo, publicIP: e.target.value }
                                  }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="sshPort">SSH端口</Label>
                                <Input
                                  id="sshPort"
                                  type="number"
                                  placeholder="22"
                                  value={deviceForm.connectionInfo.sshPort}
                                  onChange={(e) => setDeviceForm(prev => ({
                                    ...prev,
                                    connectionInfo: { ...prev.connectionInfo, sshPort: parseInt(e.target.value) }
                                  }))}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="sshUsername">SSH用户名</Label>
                              <Input
                                id="sshUsername"
                                placeholder="root"
                                value={deviceForm.connectionInfo.sshUsername}
                                onChange={(e) => setDeviceForm(prev => ({
                                  ...prev,
                                  connectionInfo: { ...prev.connectionInfo, sshUsername: e.target.value }
                                }))}
                              />
                            </div>
                          </CardContent>
                        )}
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${
                          connectionType === 'MANUAL' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConnectionType('MANUAL')}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <Monitor className="h-6 w-6 text-accent" />
                            <div>
                              <CardTitle className="text-lg">设备端手动接入</CardTitle>
                              <CardDescription>
                                在您的设备上安装FlexiCompute Agent，自动完成接入配置
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        {connectionType === 'MANUAL' && (
                          <CardContent>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                选择此方式后，我们将为您提供详细的接入指南和安装脚本。
                                Agent会自动检测硬件配置并建立安全连接。
                              </p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)}>下一步</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="2" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">设备硬件配置</Label>
                      <Badge variant="outline" className="bg-accent/10">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        自动检测
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deviceName">设备名称</Label>
                        <Input
                          id="deviceName"
                          placeholder="我的游戏主机"
                          value={deviceForm.name}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">设备位置</Label>
                        <Input
                          id="location"
                          placeholder="北京"
                          value={deviceForm.location}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">设备类型</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Card 
                          className={`cursor-pointer transition-all ${
                            deviceForm.type === 'CPU' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setDeviceForm(prev => ({ ...prev, type: 'CPU', gpuModel: '', gpuCount: 1 }))}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                              <Cpu className="h-6 w-6 text-primary" />
                              <div>
                                <CardTitle className="text-sm">CPU设备</CardTitle>
                                <CardDescription className="text-xs">
                                  通用计算设备
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                        <Card 
                          className={`cursor-pointer transition-all ${
                            deviceForm.type === 'GPU' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setDeviceForm(prev => ({ ...prev, type: 'GPU' }))}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                              <Zap className="h-6 w-6 text-accent" />
                              <div>
                                <CardTitle className="text-sm">GPU设备</CardTitle>
                                <CardDescription className="text-xs">
                                  高性能计算设备
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpuCores">CPU核心数</Label>
                        <Input
                          id="cpuCores"
                          type="number"
                          min="1"
                          value={deviceForm.cpuCores}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, cpuCores: parseInt(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ramGB">内存容量 (GB)</Label>
                        <Input
                          id="ramGB"
                          type="number"
                          min="1"
                          value={deviceForm.ramGB}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, ramGB: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="storageGB">存储容量 (GB)</Label>
                        <Input
                          id="storageGB"
                          type="number"
                          min="1"
                          value={deviceForm.storageGB}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, storageGB: parseInt(e.target.value) }))}
                        />
                      </div>
                      {deviceForm.type === 'GPU' && (
                        <div>
                          <Label htmlFor="gpuCount">GPU数量</Label>
                          <Input
                            id="gpuCount"
                            type="number"
                            min="1"
                            value={deviceForm.gpuCount}
                            onChange={(e) => setDeviceForm(prev => ({ ...prev, gpuCount: parseInt(e.target.value) }))}
                          />
                        </div>
                      )}
                    </div>

                    {deviceForm.type === 'GPU' && (
                      <div>
                        <Label htmlFor="gpuModel">GPU型号</Label>
                        <Input
                          id="gpuModel"
                          placeholder="NVIDIA RTX 4090"
                          value={deviceForm.gpuModel}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, gpuModel: e.target.value }))}
                        />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>上一步</Button>
                      <Button onClick={() => setStep(3)}>下一步</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="3" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">AI智能定价</Label>
                      <Badge variant="outline" className="bg-primary/10">
                        <DollarSign className="w-3 h-3 mr-1" />
                        推荐价格
                      </Badge>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          AI推荐价格 ({deviceForm.type === 'CPU' ? '按核心计费' : '按显卡计费'})
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-primary">
                            ¥{deviceForm.type === 'CPU' ? '0.8/核心/小时' : '8.5/卡/小时'}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            总价: ¥{deviceForm.type === 'CPU' ? (0.8 * deviceForm.cpuCores).toFixed(1) : (8.5 * deviceForm.gpuCount).toFixed(1)}/小时
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        基于您的设备配置、市场供需和类似设备定价分析得出
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pricing">
                        您的定价 (¥{deviceForm.type === 'CPU' ? `/核心/小时, 总价: ¥${(deviceForm.pricing / deviceForm.cpuCores).toFixed(2)}/核心/小时` : `/卡/小时, 总价: ¥${(deviceForm.pricing / deviceForm.gpuCount).toFixed(2)}/卡/小时`})
                      </Label>
                      <Input
                        id="pricing"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={deviceForm.pricing}
                        onChange={(e) => setDeviceForm(prev => ({ ...prev, pricing: parseFloat(e.target.value) }))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {deviceForm.type === 'CPU' ? 
                          `建议单核价格范围：¥0.3 - ¥1.2/小时 (${deviceForm.cpuCores}核心设备总价: ¥${(0.3 * deviceForm.cpuCores).toFixed(1)} - ¥${(1.2 * deviceForm.cpuCores).toFixed(1)}/小时)` :
                          `建议单卡价格范围：¥6.0 - ¥12.0/小时 (${deviceForm.gpuCount}卡设备总价: ¥${(6.0 * deviceForm.gpuCount).toFixed(1)} - ¥${(12.0 * deviceForm.gpuCount).toFixed(1)}/小时)`
                        }
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>上一步</Button>
                      <Button onClick={handleAddDevice} className="btn-gradient">
                        完成托管
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Device Monitoring Dialog */}
          <Dialog open={!!monitoringDevice} onOpenChange={() => setMonitoringDevice(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  设备监控 - {devices.find(d => d.id === monitoringDevice)?.name}
                </DialogTitle>
                <DialogDescription>
                  查看设备实时状态和历史性能指标
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Real-time Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">实时状态</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">CPU使用率</p>
                          <p className="text-2xl font-bold text-primary">45%</p>
                        </div>
                        <Cpu className="h-8 w-8 text-primary/50" />
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">内存使用</p>
                          <p className="text-2xl font-bold text-accent">68%</p>
                        </div>
                        <Zap className="h-8 w-8 text-accent/50" />
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">网络I/O</p>
                          <p className="text-2xl font-bold text-green-500">120MB/s</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500/50" />
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">温度</p>
                          <p className="text-2xl font-bold text-orange-500">65°C</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-500/50" />
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Performance Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">24小时性能趋势</h3>
                  <Card className="p-6">
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">性能图表将在此显示</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          CPU使用率、内存占用、网络流量等历史数据
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">使用统计</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">本月收益</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">总租用时长</span>
                          <span className="font-medium">142小时</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">总收益</span>
                          <span className="font-medium text-green-600">¥1,207</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">平均利用率</span>
                          <span className="font-medium">73%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">设备健康</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">运行稳定性</span>
                          <span className="font-medium text-green-600">99.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">平均温度</span>
                          <span className="font-medium">62°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">故障次数</span>
                          <span className="font-medium">0次</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Devices Grid */}
        {userDevices.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">还没有托管设备</h3>
              <p className="text-muted-foreground text-center mb-6">
                开始托管您的第一台设备，将闲置算力变现为收益
              </p>
              <Button onClick={() => setIsAddingDevice(true)} className="btn-gradient">
                <Plus className="mr-2 h-5 w-5" />
                添加设备
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userDevices.map((device) => (
              <Card key={device.id} className="glass-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <Badge variant={device.type === 'GPU' ? 'default' : 'secondary'} className="text-xs">
                        {device.type === 'GPU' ? (
                          <>
                            <Zap className="w-3 h-3 mr-1" />
                            GPU
                          </>
                        ) : (
                          <>
                            <Cpu className="w-3 h-3 mr-1" />
                            CPU
                          </>
                        )}
                      </Badge>
                    </div>
                    {getStatusBadge(device.status)}
                  </div>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {device.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Device Type Indicator & Monitor Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {device.type === 'GPU' ? (
                        <div className="flex items-center text-sm text-accent">
                          <Zap className="w-4 h-4 mr-1" />
                          {device.gpuModel} × {device.gpuCount}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-primary">
                          <Cpu className="w-4 h-4 mr-1" />
                          {device.cpuCores}核心通用计算
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeviceAction('监控查看', device.id)}
                      className="h-8 w-8 p-0"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Specs - Different display for CPU vs GPU */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {device.type === 'CPU' ? (
                      <>
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                          {device.cpuCores} 核心
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                          ¥{device.pricePerCore?.toFixed(2)}/核心/h
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-muted-foreground" />
                          {device.ramGB}GB 内存
                        </div>
                        <div className="flex items-center">
                          <HardDrive className="w-4 h-4 mr-2 text-muted-foreground" />
                          {device.storageGB}GB 存储
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-accent" />
                          {device.gpuCount} × GPU
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                          ¥{device.pricePerGpu?.toFixed(1)}/卡/h
                        </div>
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                          {device.cpuCores} CPU核心
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-muted-foreground" />
                          {device.ramGB}GB 显存
                        </div>
                      </>
                    )}
                  </div>

                  {/* Connection & Performance */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-1 text-muted-foreground" />
                      {device.connectionType}
                    </div>
                    <div className="flex items-center text-green-500">
                      <Activity className="w-4 h-4 mr-1" />
                      {device.uptime}% 稳定性
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {device.rating}/5.0
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      {device.totalHours}h 总时长
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div>
                      <div className="text-xl font-bold text-primary">
                        ¥{device.pricePerHour}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {device.type === 'CPU' ? '总价/小时' : '总价/小时'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">预估月收益</div>
                      <div className="text-sm font-medium text-green-600">
                        ¥{(device.pricePerHour * 24 * 30 * 0.7).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeviceAction('SSH远程连接', device.id)}
                    >
                      <Terminal className="w-4 h-4 mr-1" />
                      SSH连接
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeviceAction('一键部署', device.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      部署应用
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeviceAction('编辑定价', device.id)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      编辑定价
                    </Button>
                    <Button 
                      size="sm" 
                      className="btn-glow"
                      onClick={() => handleDeviceAction('设备上架', device.id)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      上架
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDevices;