import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Clock, User, MapPin, Filter, Download, RefreshCw, X, Globe } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { apiService } from '../../../services/api-service';

interface TrackingHistory {
  id: string;
  mailId: string;
  mailType: string;
  subject: string;
  sender: string;
  receiver: string;
  currentStatus: string;
  priority: string;
  department: string;
  assignedTo: string;
  createdAt: string;
  lastUpdated: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    user: string;
    remarks: string;
  }>;
}

export function Tracking() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTracking, setSelectedTracking] = useState<TrackingHistory | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Registered': 'bg-blue-100 text-blue-700',
      'Assigned': 'bg-orange-100 text-orange-700',
      'In Progress': 'bg-purple-100 text-purple-700',
      'Closed': 'bg-green-100 text-green-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Draft': 'bg-gray-100 text-gray-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      'High': 'bg-red-100 text-red-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Low': 'bg-green-100 text-green-700',
    };
    return variants[priority] || 'bg-gray-100 text-gray-700';
  };

  const fetchTrackingData = async () => {
    try {
      setLoading(true);

      // Fetch both inward and outward mails
      const [inwardResponse, outwardResponse] = await Promise.all([
        apiService.getInwardMails(),
        apiService.getOutwardMails()
      ]);

      if (inwardResponse.success && outwardResponse.success) {
        const inwardMails = inwardResponse.data || [];
        const outwardMails = outwardResponse.data || [];

        // Combine and format tracking data
        const allMails = [...inwardMails, ...outwardMails];
        const trackingData: TrackingHistory[] = allMails.map((mail, index) => {
          // Determine mail type based on available fields
          const isInward = mail.sender !== undefined || mail.receivedBy !== undefined || mail.deliveryMode !== undefined;
          const mailType = isInward ? 'INWARD' : 'OUTWARD';

          return {
            id: `TRK-${index + 1}`,
            mailId: mail.id || mail._id,
            mailType: mailType,
            subject: mail.details || mail.subject || 'No Subject',
            sender: isInward ? mail.sender : mail.sentBy || mail.receiver || 'Unknown',
            receiver: isInward ? mail.receiver || 'Unknown' : mail.receiver || 'Unknown',
            currentStatus: mail.status || 'pending',
            priority: mail.priority || 'Normal',
            department: mail.department || 'Unassigned',
            assignedTo: isInward ? mail.receivedBy || 'Department Head' : mail.sentBy || 'Unknown',
            createdAt: mail.createdAt || mail.date || new Date().toISOString(),
            lastUpdated: mail.updatedAt || new Date().toISOString(),
            timeline: [
              {
                status: mail.status || 'pending',
                timestamp: mail.createdAt || mail.date || new Date().toISOString(),
                user: 'System',
                remarks: `${mailType} mail processed`
              }
            ]
          };
        });

        setTrackingHistory(trackingData);
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const filteredTracking = trackingHistory.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((item) =>
    statusFilter === 'all' || item.currentStatus === statusFilter
  ).filter((item) =>
    typeFilter === 'all' || item.mailType === typeFilter
  );

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 w-full max-w-full h-full flex flex-col bg-gray-50 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              {t('tracking.title')}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">{t('tracking.subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <Button onClick={fetchTrackingData} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('tracking.refresh')}
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Box - Full width on mobile */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('tracking.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Grid - Responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('tracking.status')}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">{t('tracking.allStatuses')}</option>
                  <option value="pending">{t('tracking.statuses.pending')}</option>
                  <option value="in-progress">{t('tracking.statuses.inProgress')}</option>
                  <option value="approved">{t('tracking.statuses.approved')}</option>
                  <option value="completed">{t('tracking.statuses.completed')}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('tracking.type')}</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">{t('tracking.allTypes')}</option>
                  <option value="INWARD">{t('tracking.types.inward')}</option>
                  <option value="OUTWARD">{t('tracking.types.outward')}</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Tracking List */}
        <Card className="mt-4 sm:mt-6">
          <div className="p-4 sm:p-6">

            {/* Mobile View - Stacked Cards */}
            <div className="md:hidden space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm sm:text-base">Loading...</span>
                </div>
              ) : filteredTracking.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm sm:text-base">{t('tracking.noRecords')}</p>
                </div>
              ) : (
                filteredTracking.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-500">Tracking ID</span>
                          <p className="font-medium text-blue-600 text-sm sm:text-base truncate">{item.id}</p>
                        </div>
                        <Badge className={`${getStatusBadge(item.currentStatus)} text-xs sm:text-sm`}>
                          {item.currentStatus}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">Subject</span>
                        <p className="font-medium text-sm sm:text-base truncate">{item.subject}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500">Type</span>
                          <Badge className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
                            {item.mailType}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Priority</span>
                          <Badge className={`${getPriorityBadge(item.priority)} text-xs sm:text-sm`}>
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500">From</span>
                          <p className="text-sm sm:text-base truncate">{item.sender}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">To</span>
                          <p className="text-sm sm:text-base truncate">{item.receiver}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 justify-center text-blue-600 hover:bg-blue-50"
                          onClick={() => setSelectedTracking(item)}
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline ml-1 text-xs">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold min-w-[100px]">Tracking ID</TableHead>
                      <TableHead className="font-semibold min-w-[150px]">Subject</TableHead>
                      <TableHead className="font-semibold min-w-[80px]">Type</TableHead>
                      <TableHead className="font-semibold min-w-[80px]">Priority</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">From</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">To</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                      <TableHead className="font-semibold text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm sm:text-base">Loading...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredTracking.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          <p className="text-sm sm:text-base">{t('tracking.noRecords')}</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTracking.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-blue-600 text-sm">{item.id}</TableCell>
                          <TableCell className="text-sm max-w-[150px] truncate">{item.subject}</TableCell>
                          <TableCell>
                            <Badge className="bg-gray-100 text-gray-700 text-xs">
                              {item.mailType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityBadge(item.priority)} text-xs`}>
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-[120px] truncate">{item.sender}</TableCell>
                          <TableCell className="text-sm max-w-[120px] truncate">{item.receiver}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(item.currentStatus)} text-xs`}>
                              {item.currentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => setSelectedTracking(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {selectedTracking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {t('tracking.trackingDetails')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTracking(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p><strong>ID:</strong> {selectedTracking.id}</p>
            <p><strong>Subject:</strong> {selectedTracking.subject}</p>
            <p><strong>Status:</strong> {selectedTracking.currentStatus}</p>
          </div>
        </div>
      )}
    </>
  );
}
