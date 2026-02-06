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
import { outwardMailService } from '../../../services/outward-mail-service';

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
        const response = await outwardMailService.getOutwardMails();
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('outwardMails.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('outwardMails.subtitle')}</p>
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

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.search')}</label>
            <Input
              placeholder={t('outwardMails.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.priority')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.status')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.department')}</label>
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
        <div className="mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onCreateMail && onCreateMail()}>
            <Plus className="w-4 h-4 mr-2" />
            {t('outwardMails.newMail')}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{t('common.error')}</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        ) : filteredMails.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">{t('outwardMails.noMails')}</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onCreateMail && onCreateMail()}>
                <Plus className="w-4 h-4 mr-2" />
                {t('outwardMails.createFirstMail')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">{t('outwardMails.trackingId')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.subject')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.receiver')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.department')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.date')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.deliveryMode')}</TableHead>
                  <TableHead className="font-semibold">{t('outwardMails.status')}</TableHead>
                  <TableHead className="font-semibold text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMails.map((mail) => (
                  <TableRow key={mail.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{mail.trackingId}</TableCell>
                    <TableCell className="font-medium">{mail.subject}</TableCell>
                    <TableCell>{mail.receiver}</TableCell>
                    <TableCell>{mail.department}</TableCell>
                    <TableCell>{new Date(mail.date || mail.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{mail.deliveryMode}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(mail.status)}>
                        {mail.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewMail && onViewMail(mail)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditMail && onEditMail(mail)}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            {t('common.showing')} {filteredMails.length} {t('common.of')} {outwardMails.length} {t('common.entries')}
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
