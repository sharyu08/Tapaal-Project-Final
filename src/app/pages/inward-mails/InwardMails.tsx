import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Pencil, Trash2, Eye, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { inwardMailService } from '../../../services/inward-mail-service.js';

// Type assertion for the imported service
const service = inwardMailService as any;
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
      const response = await service.getInwardMails({
        search: searchTerm,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
      });

      if (response.success && response.data) {
        setInwardMails(response.data);
      } else {
        console.warn('No inward mails data received, using empty array');
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('inwardMails.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('inwardMails.subtitle')}</p>
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
        <div className="flex items-center gap-2">
          <Button className="bg-green-600 hover:bg-green-700" onClick={onCreateMail}>
            <Plus className="w-4 h-4 mr-2" />
            {t('common.add')} {t('inwardMails.addInward')}
          </Button>
          <Button variant="outline" onClick={fetchInwardMails} className="ml-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1 relative">
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

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.priority')}</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
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

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.department')}</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
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

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('common.status')}</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
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
      </Card>

      {/* Table Section */}
      <Card className="p-6 overflow-hidden">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[120px]">{t('inwardMails.inwardId')}</TableHead>
                <TableHead>{t('inwardMails.receivedBy')}</TableHead>
                <TableHead>{t('inwardMails.sender')}</TableHead>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead>{t('inwardMails.mode')}</TableHead>
                <TableHead className="max-w-[200px]">{t('inwardMails.details')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                      {t('common.loading')}
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredMails.length > 0 ? (
                filteredMails.map((mail) => (
                  <TableRow key={mail.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{mail.id}</TableCell>
                    <TableCell>{mail.receivedBy}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{mail.sender}</TableCell>
                    <TableCell className="text-xs">{mail.date}</TableCell>
                    <TableCell>{mail.deliveryMode}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={mail.details}>
                      {mail.details}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(mail.status)}>
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
                    {t('inwardMails.noMails')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('common.showing')} {filteredMails.length} {t('common.of')} {inwardMails.length} {t('common.entries')}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
            <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">{t('common.next')}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}