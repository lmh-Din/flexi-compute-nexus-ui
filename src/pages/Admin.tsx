import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Activity,
  BarChart3,
  Settings,
  Users,
  Server,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Cpu,
  Zap,
  HardDrive,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package
} from 'lucide-react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { HostedDevice, ApplicationTemplate } from '@/interfaces';

const Admin = () => {
  const { devices, templates: applications, stats, updateDevice, addTemplate: addApplication, updateTemplate: updateApplication, deleteTemplate: removeApplication } = useData();
  const [selectedDevice, setSelectedDevice] = useState<HostedDevice | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationTemplate | null>(null);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    category: '',
    minCpuCores: 1,
    minRamGB: 1,
    minStorageGB: 10,
    requiredGpu: false,
    tags: [] as string[],
    popularity: 0,
    version: '1.0.0',
    ports: [] as number[],
    environmentVariables: {} as Record<string, string>,
    isActive: true
  });

  // Dashboard data
  const deviceTypeData = [
    { name: 'CPU设备', value: devices.filter(d => d.type === 'CPU').length, color: 'hsl(var(--primary))' },
    { name: 'GPU机器', value: devices.filter(d => d.type === 'GPU').length, color: 'hsl(var(--accent))' }
  ];

  const statusData = [
    { name: '可用', value: devices.filter(d => d.status === 'AVAILABLE').length, color: 'hsl(var(--success))' },
    { name: '已租用', value: devices.filter(d => d.status === 'RENTED').length, color: 'hsl(var(--warning))' },
    { name: '离线', value: devices.filter(d => d.status === 'OFFLINE').length, color: 'hsl(var(--destructive))' }
  ];

  const monthlyData = [
    { month: '1月', devices: 12, users: 45, revenue: 8500 },
    { month: '2月', devices: 15, users: 52, revenue: 9200 },
    { month: '3月', devices: 18, users: 61, revenue: 11800 },
    { month: '4月', devices: 22, users: 78, revenue: 14500 },
    { month: '5月', devices: 28, users: 89, revenue: 16700 },
    { month: '6月', devices: 32, users: 95, revenue: 18900 }
  ];

  const handleDeviceStatusChange = (deviceId: string, newStatus: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      updateDevice(deviceId, { ...device, status: newStatus as any });
    }
  };

  const handleAppStatusToggle = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      updateApplication(appId, { ...app, isActive: !app.isActive });
    }
  };

  const handleAddApplication = () => {
    addApplication({
      iconUrl: `/icons/${newApp.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      ...newApp
    });
    setNewApp({
      name: '',
      description: '',
      category: '',
      minCpuCores: 1,
      minRamGB: 1,
      minStorageGB: 10,
      requiredGpu: false,
      tags: [],
      popularity: 0,
      version: '1.0.0',
      ports: [],
      environmentVariables: {},
      isActive: true
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              管理后台
            </h1>
            <p className="text-muted-foreground mt-2">FlexiCompute 平台管理中心</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              系统设置
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">可视化大屏</TabsTrigger>
            <TabsTrigger value="devices">设备管理</TabsTrigger>
            <TabsTrigger value="apps">应用管理</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总设备数</CardTitle>
                  <Server className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalDevices}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    较上月 +12%
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    较上月 +8%
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">使用率</CardTitle>
                  <Activity className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{stats.utilizationRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    较上月 +5%
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">月收入</CardTitle>
                  <DollarSign className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">¥18,900</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    较上月 +13%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>设备类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceTypeData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {deviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>设备状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>月度趋势</CardTitle>
                <CardDescription>设备数量、用户增长和收入趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="devices" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="设备数量"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        name="用户数"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Device Management Tab */}
          <TabsContent value="devices" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>设备管理</CardTitle>
                <CardDescription>管理平台上所有托管设备</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>设备名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>配置</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>定价</TableHead>
                      <TableHead>拥有者</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>
                          <Badge variant={device.type === 'GPU' ? 'default' : 'secondary'}>
                            {device.type === 'GPU' ? 'GPU机器' : 'CPU设备'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div>{device.cpuCores} CPU核心</div>
                            <div>{device.ramGB}GB 内存</div>
                            {device.gpuModel && <div>{device.gpuModel}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={device.status}
                            onValueChange={(value) => handleDeviceStatusChange(device.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AVAILABLE">可用</SelectItem>
                              <SelectItem value="RENTED">已租用</SelectItem>
                              <SelectItem value="OFFLINE">离线</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>¥{device.pricePerHour}/小时</TableCell>
                        <TableCell>{device.ownerId}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDevice(device)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Device Detail Modal */}
            {selectedDevice && (
              <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{selectedDevice.name} - 详细信息</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">基本信息</h3>
                      <div className="space-y-2 text-sm">
                        <div>设备ID: {selectedDevice.id}</div>
                        <div>拥有者: {selectedDevice.ownerId}</div>
                        <div>设备类型: {selectedDevice.type}</div>
                        <div>接入方式: {selectedDevice.connectionType}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">硬件配置</h3>
                      <div className="space-y-2 text-sm">
                        <div>CPU: {selectedDevice.cpuCores} 核心</div>
                        <div>内存: {selectedDevice.ramGB}GB</div>
                        <div>存储: {selectedDevice.storageGB}GB</div>
                        {selectedDevice.gpuModel && <div>GPU: {selectedDevice.gpuModel}</div>}
                        {selectedDevice.gpuCount && <div>GPU数量: {selectedDevice.gpuCount}</div>}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* App Management Tab */}
          <TabsContent value="apps" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">应用管理</h2>
                <p className="text-muted-foreground">管理应用商店中的应用</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    添加应用
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新应用</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>应用名称</Label>
                      <Input
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        placeholder="输入应用名称"
                      />
                    </div>
                    <div>
                      <Label>应用描述</Label>
                      <Textarea
                        value={newApp.description}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        placeholder="输入应用描述"
                      />
                    </div>
                    <div>
                      <Label>分类</Label>
                      <Select
                        value={newApp.category}
                        onValueChange={(value) => setNewApp({ ...newApp, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai">AI应用</SelectItem>
                          <SelectItem value="database">数据库</SelectItem>
                          <SelectItem value="development">开发工具</SelectItem>
                          <SelectItem value="media">媒体处理</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>最小CPU核心数</Label>
                        <Input
                          type="number"
                          value={newApp.minCpuCores}
                          onChange={(e) => setNewApp({ ...newApp, minCpuCores: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>最小内存(GB)</Label>
                        <Input
                          type="number"
                          value={newApp.minRamGB}
                          onChange={(e) => setNewApp({ ...newApp, minRamGB: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newApp.requiredGpu}
                        onCheckedChange={(checked) => setNewApp({ ...newApp, requiredGpu: checked })}
                      />
                      <Label>需要GPU</Label>
                    </div>
                    <Button onClick={handleAddApplication} className="w-full">
                      添加应用
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>应用名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>最低配置</TableHead>
                      <TableHead>GPU要求</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{app.name}</div>
                              <div className="text-sm text-muted-foreground">{app.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{app.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{app.minCpuCores} CPU / {app.minRamGB}GB RAM</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {app.requiredGpu ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={app.isActive}
                            onCheckedChange={() => handleAppStatusToggle(app.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => removeApplication(app.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>系统设置</CardTitle>
                <CardDescription>配置平台参数和规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">分润规则</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    设置平台从设备租用费用中抽取的分成比例
                  </p>
                  <div className="flex items-center gap-4">
                    <Input type="number" placeholder="15" className="w-32" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">最低定价限制</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    设置设备的最低小时定价
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">¥</span>
                    <Input type="number" placeholder="0.5" className="w-32" />
                    <span className="text-sm text-muted-foreground">/小时</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">自动审核</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    启用设备托管的自动审核功能
                  </p>
                  <Switch />
                </div>

                <Button>保存设置</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;