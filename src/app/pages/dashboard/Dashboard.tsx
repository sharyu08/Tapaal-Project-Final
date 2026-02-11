import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Send, Users, Clock, ArrowUpRight, ArrowDownRight, Database } from 'lucide-react';

// UI components
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  BarChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from '../../components/ui/charts';
import { cn } from '../../components/ui/utils';

// Database services
import { apiService } from '../../../services/api-service';

// --- DATA DEFINITIONS ---

// --- HELPER COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'pending': 'bg-red-100 text-red-700 border-red-200',
    'approved': 'bg-blue-100 text-blue-700 border-blue-200',
    'in-progress': 'bg-orange-100 text-orange-700 border-orange-200',
    'delivered': 'bg-green-100 text-green-700 border-green-200',
    'waiting': 'bg-purple-100 text-purple-700 border-purple-200',
    'rejected': 'bg-gray-100 text-gray-700 border-gray-200',
    // Fallback for UI states
    'Registered': 'bg-blue-100 text-blue-700 border-blue-200',
    'Assigned': 'bg-orange-100 text-orange-700 border-orange-200',
    'In Progress': 'bg-purple-100 text-purple-700 border-purple-200',
    'Closed': 'bg-green-100 text-green-700 border-green-200',
  };
  return <Badge className={cn("border shadow-none font-medium", styles[status] || styles.pending)}>{status}</Badge>;
};

// --- MAIN DASHBOARD ---
export function Dashboard() {
  const { t } = useTranslation();
  const [message, setMessage] = React.useState('');
  const [dbStats, setDbStats] = React.useState({
    users: 0,
    departments: 0,
    mails: 0,
    trackingEvents: 0,
  });
  const [realData, setRealData] = React.useState(null);

  // Static fallback data - will be replaced with real database data
  const fallbackSummaryData = [
    { title: t('dashboard.totalInwardMails'), value: '0', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50', change: '+0%', isPositive: true },
    { title: t('dashboard.totalOutwardMails'), value: '0', icon: Send, color: 'text-green-600', bgColor: 'bg-green-50', change: '+0%', isPositive: true },
    { title: t('dashboard.pendingActions'), value: '0', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50', change: '+0%', isPositive: false },
    { title: t('dashboard.activeUsers'), value: '0', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50', change: '+0', isPositive: true },
  ];

  const inwardOutwardData = [
    { name: 'Jan', inward: 120, outward: 80 },
    { name: 'Feb', inward: 150, outward: 95 },
    { name: 'Mar', inward: 130, outward: 110 },
    { name: 'Apr', inward: 180, outward: 125 },
    { name: 'May', inward: 165, outward: 140 },
    { name: 'Jun', inward: 195, outward: 155 },
  ];

  const statusData = [
    { name: 'Registered', value: 120, color: '#3b82f6' },
    { name: 'Assigned', value: 85, color: '#f59e0b' },
    { name: 'In Progress', value: 145, color: '#8b5cf6' },
    { name: 'Closed', value: 200, color: '#10b981' },
  ];

  React.useEffect(() => {
    // Load initial stats and real data
    const loadData = async () => {
      try {
        const apiData = await apiService.getDashboardStats();
        if (apiData.success && apiData.data) {
          // Handle both direct stats and nested realData.stats
          const stats = apiData.data.stats || apiData.data.realData?.stats || {};
          const realDataContent = apiData.data.realData || apiData.data;

          setDbStats({
            users: (stats as any).totalUsers || 0,
            departments: (stats as any).totalDepartments || 0,
            mails: (stats as any).totalMails || 0,
            trackingEvents: (stats as any).totalTrackingEvents || 0,
          });
          setRealData(realDataContent);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, []);

  // Real-time summary data from database
  const realSummaryData = realData ? [
    {
      title: t('dashboard.totalInwardMails'),
      value: realData.stats.totalInwardMails.toString(),
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      isPositive: true
    },
    {
      title: t('dashboard.totalOutwardMails'),
      value: realData.stats.totalOutwardMails.toString(),
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      isPositive: true
    },
    {
      title: t('dashboard.pendingActions'),
      value: realData.stats.pendingMails.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-5%',
      isPositive: false
    },
    {
      title: t('dashboard.activeUsers'),
      value: realData.stats.totalUsers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3',
      isPositive: true
    },
  ] : fallbackSummaryData;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 bg-gray-50 h-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base font-medium">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 sm:px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="hidden xs:inline">{t('dashboard.liveFeed')}</span>
            <span className="xs:hidden">Live</span>
          </span>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className="p-3 sm:p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-lg">
          <p className="text-sm sm:text-base">{message}</p>
        </div>
      )}

      {/* Combined Stats Grid - 8 cards in 2x4 grid structure */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* First Row - Database Stats Cards */}
        <Card className="shadow-lg border-0 bg-white rounded-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{t('dashboard.totalUsers')}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{dbStats.users}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white rounded-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{t('dashboard.departments')}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{dbStats.departments}</p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white rounded-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{t('dashboard.totalMails')}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{dbStats.mails}</p>
              </div>
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white rounded-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{t('dashboard.trackingEvents')}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{dbStats.trackingEvents}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Second Row - Summary Data Cards */}
        {realSummaryData.map((item) => (
          <Card key={item.title} className="shadow-lg border-0 bg-white rounded-xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{item.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{item.value}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    {item.isPositive ? (
                      <span className="text-green-600 text-xs sm:text-sm">{item.change}</span>
                    ) : (
                      <span className="text-red-600 text-xs sm:text-sm">{item.change}</span>
                    )}
                  </div>
                </div>
                <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} ${item.bgColor} p-1.5 sm:p-2 rounded-lg flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-200/60">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl">{t('dashboard.mailVolumeTrends')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250} minHeight="200">
              <BarChart data={realData ? realData.monthlyData : inwardOutwardData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200/60">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl">{t('dashboard.statusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-0">
            <ResponsiveContainer height={200} minHeight="180">
              <PieChart data={realData ? realData.statusData : statusData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="shadow-sm border-gray-200/60">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-gray-50 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">{t('dashboard.recentActivity')}</CardTitle>
          <button className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">
            <span className="hidden sm:inline">{t('dashboard.fullAuditLog')}</span>
            <span className="sm:hidden">View All</span>
          </button>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="divide-y divide-gray-100">
            {realData && realData.recentMails ? realData.recentMails.map((mail, i) => (
              <div key={mail.id} className="py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between group cursor-default">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:text-white transition-all duration-300 flex-shrink-0 ${mail.type === 'INWARD'
                    ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600'
                    : 'bg-green-50 text-green-600 group-hover:bg-green-600'
                    }`}>
                    {mail.type === 'INWARD' ? <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{mail.subject}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      <span className="hidden sm:inline">
                        {mail.type === 'INWARD' ? `From: ${mail.senderName}` : `To: ${mail.senderName}`} • {mail.department} • Priority: {mail.priority}
                      </span>
                      <span className="sm:hidden">
                        {mail.type === 'INWARD' ? mail.senderName : mail.senderName} • {mail.priority}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${mail.type === 'INWARD'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                    }`}>
                    {mail.type}
                  </span>
                  <StatusBadge status={mail.status} />
                </div>
              </div>
            )) : [1, 2, 3].map((i) => (
              <div key={i} className="py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between group cursor-default">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Inward Mail TAP-442{i} Registered</p>
                    <p className="text-xs text-gray-500 font-medium">
                      <span className="hidden sm:inline">Assigned to Department of Revenue • {1}m ago</span>
                      <span className="sm:hidden">Dept. of Revenue • {1}m ago</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <StatusBadge status={i === 3 ? "In Progress" : "Registered"} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}