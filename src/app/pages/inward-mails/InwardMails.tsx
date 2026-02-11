import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Pencil, Trash2, Eye, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { apiService } from '../../../services/api-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { InwardMailDetail } from './InwardMailDetail';
import { EditInwardMail } from './EditInwardMail';

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    'waiting': 'bg-yellow-100 text-yellow-700',
    'approved': 'bg-green-100 text-green-700',
    'pending': 'bg-orange-100 text-orange-700',
    'rejected': 'bg-red-100 text-red-700',
    'in-progress': 'bg-blue-100 text-blue-700',
  };
  return variants[status] || 'bg-gray-100 text-gray-700';
};

interface InwardMailsProps {
  onViewMail?: (mail: any) => void;
  onEditMail?: (mail: any) => void;
  onCreateMail?: () => void;
}

export function InwardMails({ onViewMail, onEditMail, onCreateMail }: InwardMailsProps) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [inwardMails, setInwardMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch inward mails from API
  const fetchInwardMails = async () => {
    try {
      setLoading(true);

      // Build params object, excluding 'all' values
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedPriority !== 'all') params.priority = selectedPriority;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedDepartment !== 'all') params.department = selectedDepartment;

      const response = await apiService.getInwardMails(
        Object.keys(params).length > 0 ? params : undefined
      );

      if (response.success && response.data) {
        setInwardMails(response.data);
        console.log('Inward mails loaded:', response.data);
      } else {
        console.warn('No inward mails data received, response:', response);
        setInwardMails([]);
      }
    } catch (error) {
      console.error('Error fetching inward mails:', error);
      setError('Failed to load inward mails');
      setInwardMails([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInwardMails();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchInwardMails();
  }, [searchTerm, selectedPriority, selectedStatus, selectedDepartment]);

  // Refresh when page becomes visible (user returns from create page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchInwardMails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredMails = inwardMails.filter((mail) => {
    const matchesSearch = searchTerm === '' ||
      mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || mail.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || mail.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || mail.department === selectedDepartment;

    return matchesSearch && matchesPriority && matchesStatus && matchesDepartment;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{t('inwardMails.title')}</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">{t('inwardMails.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={onCreateMail}>
            <Plus className="w-4 h-4 mr-2" />
            {t('common.add')} {t('inwardMails.addInward')}
          </Button>
          <Button variant="outline" onClick={fetchInwardMails} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('inwardMails.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Grid - Responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.priority')}</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('filters.selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allPriorities')}</SelectItem>
                  <SelectItem value="Important">Important</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.department')}</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('filters.selectDepartment')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allDepartments')}</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.status')}</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('filters.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allStatus')}</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filter Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedPriority('all');
                setSelectedStatus('all');
                setSelectedDepartment('all');
              }}
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={fetchInwardMails}
              className="w-full sm:w-auto"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="p-4 sm:p-6 overflow-hidden">
        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm sm:text-base">{t('common.loading')}</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          ) : filteredMails.length > 0 ? (
            filteredMails.map((mail) => (
              <div key={mail.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-500">{t('inwardMails.inwardId')}</span>
                      <p className="font-medium text-blue-600 text-sm sm:text-base truncate">{mail.id}</p>
                    </div>
                    <Badge className={`${getStatusBadge(mail.status)} text-xs sm:text-sm`}>
                      {mail.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">{t('inwardMails.receivedBy')}</span>
                      <p className="font-medium text-sm sm:text-base truncate">{mail.receivedBy}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">{t('inwardMails.sender')}</span>
                      <p className="font-medium text-sm sm:text-base truncate">{mail.sender}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">{t('common.date')}</span>
                      <p className="text-xs sm:text-sm">{mail.date}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">{t('inwardMails.mode')}</span>
                      <p className="text-sm sm:text-base">{mail.deliveryMode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">{t('inwardMails.details')}</span>
                    <p className="text-sm sm:text-base truncate" title={mail.details}>{mail.details}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="flex-1 justify-center">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline ml-1 text-xs">View</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-blue-600 hover:text-blue-700">
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline ml-1 text-xs">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline ml-1 text-xs">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm sm:text-base">{t('inwardMails.noMails')}</p>
            </div>
          )}
        </div>
        
        {/* Desktop View - Table */}
        <div className="hidden md:block border rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px] sm:w-[120px]">{t('inwardMails.inwardId')}</TableHead>
                  <TableHead>{t('inwardMails.receivedBy')}</TableHead>
                  <TableHead>{t('inwardMails.sender')}</TableHead>
                  <TableHead className="min-w-[80px]">{t('common.date')}</TableHead>
                  <TableHead className="min-w-[80px]">{t('inwardMails.mode')}</TableHead>
                  <TableHead className="min-w-[150px] sm:max-w-[200px]">{t('inwardMails.details')}</TableHead>
                  <TableHead className="min-w-[80px]">{t('common.status')}</TableHead>
                  <TableHead className="text-right min-w-[120px]">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm sm:text-base">{t('common.loading')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-500">
                      <p className="text-sm sm:text-base">{error}</p>
                    </TableCell>
                  </TableRow>
                ) : filteredMails.length > 0 ? (
                  filteredMails.map((mail) => (
                    <TableRow key={mail.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600 text-sm">{mail.id}</TableCell>
                      <TableCell className="text-sm">{mail.receivedBy}</TableCell>
                      <TableCell className="max-w-[120px] sm:max-w-[150px] truncate text-sm">{mail.sender}</TableCell>
                      <TableCell className="text-xs">{mail.date}</TableCell>
                      <TableCell className="text-sm">{mail.deliveryMode}</TableCell>
                      <TableCell className="max-w-[150px] sm:max-w-[200px] truncate text-sm" title={mail.details}>
                        {mail.details}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(mail.status)} text-xs`}>
                          {mail.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <p className="text-sm sm:text-base">{t('inwardMails.noMails')}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}