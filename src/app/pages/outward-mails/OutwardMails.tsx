import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Eye, Pencil, Trash2, Globe } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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

interface OutwardMailsProps {
  onViewMail?: (mail: any) => void;
  onEditMail?: (mail: any) => void;
  onCreateMail?: () => void;
}

export function OutwardMails({ onViewMail, onEditMail, onCreateMail }: OutwardMailsProps) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [outwardMails, setOutwardMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-700',
      'pending': 'bg-orange-100 text-orange-700',
      'in-transit': 'bg-blue-100 text-blue-700',
      'sent': 'bg-purple-100 text-purple-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  useEffect(() => {
    const fetchMails = async () => {
      setLoading(true);
      try {
        const response = await apiService.getOutwardMails();
        setOutwardMails(response.data || []);
      } catch (error) {
        setError(error.message);
        setOutwardMails([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMails();
  }, []);

  const filteredMails = outwardMails.filter((mail) => {
    const matchesSearch = !searchTerm ||
      mail.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.receiver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.trackingId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = selectedPriority === 'all' || mail.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || mail.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || mail.department === selectedDepartment;

    return matchesSearch && matchesPriority && matchesStatus && matchesDepartment;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{t('outwardMails.title')}</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">{t('outwardMails.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto" onClick={() => onCreateMail && onCreateMail()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Outward
          </Button>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.search')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('outwardMails.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.priority')}</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="Low">{t('common.low')}</SelectItem>
                <SelectItem value="Medium">{t('common.medium')}</SelectItem>
                <SelectItem value="High">{t('common.high')}</SelectItem>
                <SelectItem value="Important">{t('common.important')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.status')}</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="pending">{t('common.pending')}</SelectItem>
                <SelectItem value="sent">{t('common.sent')}</SelectItem>
                <SelectItem value="delivered">{t('common.delivered')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.department')}</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.selectDepartment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="Administration">{t('departments.administration')}</SelectItem>
                <SelectItem value="Revenue">{t('departments.revenue')}</SelectItem>
                <SelectItem value="Health">{t('departments.health')}</SelectItem>
                <SelectItem value="Education">{t('departments.education')}</SelectItem>
                <SelectItem value="Public Works">{t('departments.publicWorks')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm sm:text-base">{t('common.loading')}</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-sm sm:text-base">{t('common.error')}</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
            </div>
          ) : filteredMails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm sm:text-base">{t('outwardMails.noMails')}</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white mt-4" onClick={() => onCreateMail && onCreateMail()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Outward
              </Button>
            </div>
          ) : (
            filteredMails.map((mail) => (
              <div key={mail.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-500">{t('outwardMails.trackingId')}</span>
                      <p className="font-medium text-blue-600 text-sm sm:text-base truncate">{mail.trackingId}</p>
                    </div>
                    <Badge className={`${getStatusBadge(mail.status)} text-xs sm:text-sm`}>
                      {mail.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">{t('outwardMails.subject')}</span>
                    <p className="font-medium text-sm sm:text-base truncate">{mail.subject}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">{t('outwardMails.receiver')}</span>
                    <p className="font-medium text-sm sm:text-base truncate">{mail.receiver}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">{t('outwardMails.department')}</span>
                      <p className="text-sm sm:text-base">{mail.department}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">{t('outwardMails.date')}</span>
                      <p className="text-xs sm:text-sm">{new Date(mail.date || mail.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">{t('outwardMails.deliveryMode')}</span>
                    <p className="text-sm sm:text-base">{mail.deliveryMode}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline ml-1 text-xs">View</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-green-600 hover:text-green-800">
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline ml-1 text-xs">Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Desktop View - Table */}
        <div className="hidden md:block border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold min-w-[100px]">{t('outwardMails.trackingId')}</TableHead>
                  <TableHead className="font-semibold min-w-[150px]">{t('outwardMails.subject')}</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">{t('outwardMails.receiver')}</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">{t('outwardMails.department')}</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">{t('outwardMails.date')}</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">{t('outwardMails.deliveryMode')}</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">{t('outwardMails.status')}</TableHead>
                  <TableHead className="font-semibold text-right min-w-[100px]">{t('common.actions')}</TableHead>
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
                      <p className="text-sm sm:text-base">{t('common.error')}</p>
                      <p className="text-xs sm:text-sm mt-1">{error}</p>
                    </TableCell>
                  </TableRow>
                ) : filteredMails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <p className="text-sm sm:text-base">{t('outwardMails.noMails')}</p>
                      <Button className="bg-green-600 hover:bg-green-700 text-white mt-4" onClick={() => onCreateMail && onCreateMail()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Outward
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMails.map((mail) => (
                    <TableRow key={mail.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600 text-sm">{mail.trackingId}</TableCell>
                      <TableCell className="font-medium text-sm max-w-[150px] truncate">{mail.subject}</TableCell>
                      <TableCell className="text-sm">{mail.receiver}</TableCell>
                      <TableCell className="text-sm">{mail.department}</TableCell>
                      <TableCell className="text-xs">{new Date(mail.date || mail.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm">{mail.deliveryMode}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(mail.status)} text-xs`}>
                          {mail.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800 p-1">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
