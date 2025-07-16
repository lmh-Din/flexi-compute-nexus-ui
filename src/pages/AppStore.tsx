import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Cpu, 
  HardDrive, 
  Zap,
  Play,
  Database,
  Code,
  Brain,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AppStore = () => {
  const { templates, devices, orders } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  // Get user's rented devices for deployment
  const userOrders = orders.filter(order => order.userId === user?.id && order.status === 'ACTIVE');
  const userDevices = devices.filter(device => 
    userOrders.some(order => order.deviceId === device.id)
  );

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const handleDeploy = (app: any, deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    // Check device requirements
    if (device.cpuCores < app.minCpuCores || 
        device.ramGB < app.minRamGB || 
        device.storageGB < app.minStorageGB ||
        (app.requiredGpu && !device.gpuModel)) {
      toast({
        title: "设备配置不足",
        description: "选择的设备配置不满足应用运行要求。",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "部署成功！",
      description: `${app.name} 已成功部署到 ${device.name}`,
    });
    setSelectedApp(null);
    setSelectedDevice('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning':
        return <Brain className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Development':
        return <Code className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-500';
    if (popularity >= 70) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              应用商店
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            精选实例和设备兼容的开源软件，一键部署到您的算力设备
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索应用、技术栈或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.slice(1).map(category => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{templates.length}</div>
              <div className="text-sm text-muted-foreground">应用总数</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">应用分类</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{userDevices.length}</div>
              <div className="text-sm text-muted-foreground">可用设备</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {Math.round(templates.reduce((acc, t) => acc + t.popularity, 0) / templates.length)}%
              </div>
              <div className="text-sm text-muted-foreground">平均评分</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((app) => (
            <Card key={app.id} className="glass-card hover:shadow-elevated transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      {getCategoryIcon(app.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {app.category}
                        </Badge>
                        <span className="text-xs">v{app.version}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {app.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {app.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {app.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{app.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">最低配置要求</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Cpu className="w-3 h-3 mr-1 text-muted-foreground" />
                      {app.minCpuCores} 核
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-muted-foreground" />
                      {app.minRamGB}GB
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="w-3 h-3 mr-1 text-muted-foreground" />
                      {app.minStorageGB}GB
                    </div>
                    <div className="flex items-center">
                      {app.requiredGpu ? (
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1 text-muted-foreground" />
                      )}
                      {app.requiredGpu ? '需要GPU' : '无需GPU'}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className={`font-medium ${getPopularityColor(app.popularity)}`}>
                      {app.popularity}% 好评
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {Math.floor(app.popularity * 10)}k+ 部署
                    </span>
                  </div>
                </div>

                {/* Deploy Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full btn-glow" 
                      onClick={() => setSelectedApp(app)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      一键部署
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>部署 {selectedApp?.name}</DialogTitle>
                      <DialogDescription>
                        选择要部署到的设备实例
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {userDevices.length === 0 ? (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">没有可用设备</h3>
                          <p className="text-muted-foreground mb-4">
                            您需要先租用设备才能部署应用
                          </p>
                          <Button variant="outline">
                            前往租用设备
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择设备" />
                            </SelectTrigger>
                            <SelectContent>
                              {userDevices.map((device) => {
                                const compatible = selectedApp && 
                                  device.cpuCores >= selectedApp.minCpuCores &&
                                  device.ramGB >= selectedApp.minRamGB &&
                                  device.storageGB >= selectedApp.minStorageGB &&
                                  (!selectedApp.requiredGpu || device.gpuModel);
                                
                                return (
                                  <SelectItem 
                                    key={device.id} 
                                    value={device.id}
                                    disabled={!compatible}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{device.name}</span>
                                      {compatible ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                      ) : (
                                        <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {selectedDevice && selectedApp && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">部署信息</div>
                              <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                                <div>端口：{selectedApp.ports.join(', ')}</div>
                                <div>Docker镜像：{selectedApp.dockerImage}</div>
                                <div className="text-muted-foreground">
                                  部署完成后，应用将在几分钟内启动并可访问
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setSelectedApp(null)}
                            >
                              取消
                            </Button>
                            <Button 
                              className="flex-1 btn-gradient" 
                              disabled={!selectedDevice}
                              onClick={() => selectedApp && handleDeploy(selectedApp, selectedDevice)}
                            >
                              立即部署
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">没有找到相关应用</h3>
            <p className="text-muted-foreground">
              尝试调整搜索关键词或选择不同的分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppStore;