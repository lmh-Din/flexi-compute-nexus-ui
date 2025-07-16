import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Receipt,
  Filter,
  Search
} from 'lucide-react';

const Billing = () => {
  const { user } = useAuth();
  const { devices, orders } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [searchTerm, setSearchTerm] = useState('');

  // Get user's orders and calculate billing data
  const userOrders = orders.filter(order => order.userId === user?.id);
  
  // Generate mock billing data
  const bills = userOrders.map(order => {
    const device = devices.find(d => d.id === order.deviceId);
    return {
      id: `bill-${order.id}`,
      orderId: order.id,
      deviceName: device?.name || '未知设备',
      amount: order.totalCost,
      status: order.status === 'ACTIVE' ? 'PENDING' : 'PAID',
      startDate: order.startTime,
      endDate: order.endTime || new Date().toISOString(),
      duration: order.duration,
      pricePerHour: device?.pricePerHour || 0,
    };
  });

  // Filter bills based on search term
  const filteredBills = bills.filter(bill =>
    bill.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalSpent = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills
    .filter(bill => bill.status === 'PENDING')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const thisMonthSpent = bills
    .filter(bill => {
      const billDate = new Date(bill.startDate);
      const now = new Date();
      return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, bill) => sum + bill.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="status-available">已支付</Badge>;
      case 'PENDING':
        return <Badge className="status-rented">待支付</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">逾期</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours}小时`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}天${remainingHours > 0 ? ` ${remainingHours}小时` : ''}`;
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            账单管理
          </h1>
          <p className="text-muted-foreground">
            查看您的消费记录和账单详情
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">累计消费</p>
                  <p className="text-2xl font-bold">¥{totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">本月消费</p>
                  <p className="text-2xl font-bold">¥{thisMonthSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">待支付</p>
                  <p className="text-2xl font-bold">¥{pendingAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Receipt className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">账单数量</p>
                  <p className="text-2xl font-bold">{bills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">账单查询</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="搜索设备名称或订单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="选择时间段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisMonth">本月</SelectItem>
                  <SelectItem value="lastMonth">上月</SelectItem>
                  <SelectItem value="thisYear">今年</SelectItem>
                  <SelectItem value="all">全部</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出账单
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bills Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">账单记录</CardTitle>
            <CardDescription>
              您的详细消费记录和账单信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBills.length === 0 ? (
              <div className="text-center py-16">
                <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">暂无账单记录</h3>
                <p className="text-muted-foreground">
                  开始使用我们的服务后，您的账单记录将显示在这里
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>账单编号</TableHead>
                      <TableHead>设备名称</TableHead>
                      <TableHead>使用时长</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>开始时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-mono text-sm">
                          #{bill.id.slice(-8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {bill.deviceName}
                        </TableCell>
                        <TableCell>
                          {formatDuration(bill.duration)}
                        </TableCell>
                        <TableCell>
                          ¥{bill.pricePerHour}/小时
                        </TableCell>
                        <TableCell className="font-semibold">
                          ¥{bill.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(bill.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(bill.startDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            {bill.status === 'PENDING' && (
                              <Button size="sm" className="btn-glow">
                                <CreditCard className="w-4 h-4 mr-1" />
                                支付
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">支付方式</CardTitle>
            <CardDescription>
              管理您的支付方式和自动续费设置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">已保存的支付方式</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">**** **** **** 1234</p>
                        <p className="text-sm text-muted-foreground">Visa • 过期时间 12/25</p>
                      </div>
                    </div>
                    <Badge variant="outline">默认</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  添加支付方式
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">余额和充值</h3>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">账户余额</span>
                    <span className="text-2xl font-bold text-primary">¥128.50</span>
                  </div>
                  <Button className="w-full btn-gradient">
                    立即充值
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;