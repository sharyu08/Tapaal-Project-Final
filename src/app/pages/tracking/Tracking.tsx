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
    <div className="p-4 sm:p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('tracking.title')}</h1>
          <p className="text-gray-600 mt-1">{t('tracking.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
          <Globe className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Filters */}
      <Card className="shrink-0">
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('tracking.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('tracking.allStatuses')}</option>
                <option value="pending">{t('tracking.statuses.pending')}</option>
                <option value="in-progress">{t('tracking.statuses.inProgress')}</option>
                <option value="approved">{t('tracking.statuses.approved')}</option>
                <option value="completed">{t('tracking.statuses.completed')}</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('tracking.allTypes')}</option>
                <option value="INWARD">{t('tracking.types.inward')}</option>
                <option value="OUTWARD">{t('tracking.types.outward')}</option>
              </select>
            </div>
            <Button
              onClick={fetchTrackingData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('tracking.refresh')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tracking Table */}
      <Card className="flex-1 min-h-0">
        <div className="p-4 h-full flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">{t('tracking.loading')}</span>
            </div>
          ) : filteredTracking.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t('tracking.noRecords')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tracking.trackingId')}</TableHead>
                    <TableHead>{t('tracking.mailId')}</TableHead>
                    <TableHead>{t('tracking.type')}</TableHead>
                    <TableHead>{t('tracking.subject')}</TableHead>
                    <TableHead>{t('tracking.senderReceiver')}</TableHead>
                    <TableHead>{t('tracking.status')}</TableHead>
                    <TableHead>{t('tracking.priority')}</TableHead>
                    <TableHead>{t('tracking.department')}</TableHead>
                    <TableHead>{t('tracking.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTracking.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.mailId}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          {item.mailType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.subject}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.sender}</div>
                          {item.receiver && item.receiver !== 'Unknown' && (
                            <div className="text-gray-500 text-xs">→ {item.receiver}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(item.currentStatus)}>
                          {item.currentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTracking(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Tracking Detail Modal */}
      {selectedTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('tracking.trackingDetails')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTracking(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.trackingId')}</p>
                  <p className="font-medium">{selectedTracking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.mailId')}</p>
                  <p className="font-medium">{selectedTracking.mailId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.type')}</p>
                  <Badge variant="outline">{selectedTracking.mailType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.status')}</p>
                  <Badge className={getStatusBadge(selectedTracking.currentStatus)}>
                    {selectedTracking.currentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.priority')}</p>
                  <Badge className={getPriorityBadge(selectedTracking.priority)}>
                    {selectedTracking.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.department')}</p>
                  <p className="font-medium">{selectedTracking.department}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('tracking.subject')}</p>
                <p className="font-medium">{selectedTracking.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('tracking.sender')}</p>
                <p className="font-medium">{selectedTracking.sender}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('tracking.assignedTo')}</p>
                <p className="font-medium">{selectedTracking.assignedTo}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('tracking.timeline')}</h3>
                <div className="space-y-2">
                  {selectedTracking.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <Clock className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.remarks}</p>
                        <p className="text-xs text-gray-500">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
