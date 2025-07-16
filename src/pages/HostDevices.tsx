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
  DollarSign
} from 'lucide-react';

const HostDevices = () => {
  const { user } = useAuth();
  const { devices, addDevice, updateDevice } = useData();
  const { toast } = useToast();
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [step, setStep] = useState(1);
  const [connectionType, setConnectionType] = useState<'SSH' | 'MANUAL'>('SSH');
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    location: '',
    cpuCores: 4,
    ramGB: 8,
    storageGB: 500,
    gpuModel: '',
    connectionInfo: {
      publicIP: '',
      sshPort: 22,
      sshUsername: '',
    },
    pricing: 5.0
  });

  const userDevices = devices.filter(device => device.ownerId === user?.id);

  const handleAddDevice = () => {
    const newDevice = {
      ownerId: user?.id || '',
      name: deviceForm.name,
      cpuCores: deviceForm.cpuCores,
      ramGB: deviceForm.ramGB,
      storageGB: deviceForm.storageGB,
      gpuModel: deviceForm.gpuModel || undefined,
      status: 'OFFLINE' as const,
      pricePerHour: deviceForm.pricing,
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
      location: '',
      cpuCores: 4,
      ramGB: 8,
      storageGB: 500,
      gpuModel: '',
      connectionInfo: {
        publicIP: '',
        sshPort: 22,
        sshUsername: '',
      },
      pricing: 5.0
    });
  };

  const handleDeviceAction = (action: string, deviceId: string) => {
    toast({
      title: `${action}功能`,
      description: `${action}功能正在开发中，敬请期待！`,
    });
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
                      <div>
                        <Label htmlFor="gpuModel">GPU型号 (可选)</Label>
                        <Input
                          id="gpuModel"
                          placeholder="NVIDIA RTX 4090"
                          value={deviceForm.gpuModel}
                          onChange={(e) => setDeviceForm(prev => ({ ...prev, gpuModel: e.target.value }))}
                        />
                      </div>
                    </div>

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
                        <span className="text-sm text-muted-foreground">AI推荐价格</span>
                        <span className="text-lg font-semibold text-primary">¥6.8/小时</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        基于您的设备配置、市场供需和类似设备定价分析得出
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pricing">您的定价 (元/小时)</Label>
                      <Input
                        id="pricing"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={deviceForm.pricing}
                        onChange={(e) => setDeviceForm(prev => ({ ...prev, pricing: parseFloat(e.target.value) }))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        建议定价范围：¥5.0 - ¥10.0/小时
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
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-2 text-muted-foreground" />
                      {device.connectionType}
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
                      <div className="text-sm text-muted-foreground">每小时</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">月收益</div>
                      <div className="text-sm font-medium">¥{(device.pricePerHour * 24 * 30 * 0.7).toFixed(0)}</div>
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