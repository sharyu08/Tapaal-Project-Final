import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Pencil, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { inwardMailService } from '../../../services/inward-mail-service';
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

const getPriorityBadge = (priority: string) => {
  const variants: Record<string, string> = {
    'Low': 'bg-gray-100 text-gray-700',
    'Normal': 'bg-blue-100 text-blue-700',
    'Medium': 'bg-orange-100 text-orange-700',
    'High': 'bg-red-100 text-red-700',
    'Important': 'bg-purple-100 text-purple-700',
  };
  return variants[priority] || 'bg-gray-100 text-gray-700';
};

interface InwardMailsProps {
  onViewMail?: (mail: any) => void;
  onEditMail?: (mail: any) => void;
  onCreateMail?: () => void;
}

export function InwardMailsCRUD({ onViewMail, onEditMail, onCreateMail }: InwardMailsProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [inwardMails, setInwardMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // CRUD State Management
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch inward mails from API
  const fetchInwardMails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching inward mails...');

      const response = await inwardMailService.getInwardMails({
        search: searchTerm,
        priority: selectedPriority,
        status: selectedStatus,
        department: selectedDepartment
      });

      console.log('📥 API Response:', response);

      if (response.success) {
        console.log('✅ Data fetched successfully:', response.data);
        setInwardMails(response.data);
        setError('');
      } else {
        console.log('❌ API returned error:', response.message);
        setError('Failed to fetch inward mails: ' + response.message);
      }
    } catch (err) {
      console.error('💥 Error fetching inward mails:', err);
      setError('Error fetching inward mails');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchInwardMails();
  }, [searchTerm, selectedPriority, selectedStatus, selectedDepartment, refreshTrigger]);

  // CRUD Operations
  const handleViewMail = (mailId: string) => {
    setSelectedMailId(mailId);
    setCurrentView('detail');
    onViewMail?.(mailId);
  };

  const handleEditMail = (mailId: string) => {
    setSelectedMailId(mailId);
    setCurrentView('edit');
    onEditMail?.(mailId);
  };

  const handleDeleteMail = async (mailId: string) => {
    if (!window.confirm('Are you sure you want to delete this mail?')) {
      return;
    }

    try {
      const response = await inwardMailService.deleteInwardMail(mailId);

      if (response.success) {
        console.log('✅ Mail deleted successfully');
        alert('Mail deleted successfully!');
        setRefreshTrigger(prev => prev + 1); // Refresh the list
      } else {
        console.log('❌ Delete failed:', response.message);
        alert('Failed to delete mail: ' + response.message);
      }
    } catch (err) {
      console.error('💥 Error deleting mail:', err);
      alert('Error deleting mail');
    }
  };

  const handleCreateMail = () => {
    onCreateMail?.();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedMailId(null);
  };

  const handleMailSaved = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh the list
    handleBackToList();
  };

  // Detail View Component
  if (currentView === 'detail' && selectedMailId) {
    return (
      <InwardMailDetail
        mailId={selectedMailId}
        onBack={handleBackToList}
        onEdit={handleEditMail}
      />
    );
  }

  // Edit View Component
  if (currentView === 'edit' && selectedMailId) {
    return (
      <EditInwardMail
        mailId={selectedMailId}
        onBack={handleBackToList}
        onSave={handleMailSaved}
      />
    );
  }

  // List View Component
  const filteredMails = inwardMails.filter((mail) => {
    const matchesSearch = searchTerm === '' ||
      mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || mail.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || mail.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || mail.department === selectedDepartment;

    return matchesSearch && matchesPriority && matchesStatus && matchesDepartment;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inward Mails</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all incoming correspondence</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateMail}>
          <Plus className="w-4 h-4 mr-2" />
          Add Inward Mail
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 relative">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, sender, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="HR">Human Resources</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Received By</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMails.length > 0 ? (
                filteredMails.map((mail) => (
                  <TableRow key={mail.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{mail.id}</TableCell>
                    <TableCell>{mail.receivedBy}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={mail.sender}>
                      {mail.sender}
                    </TableCell>
                    <TableCell className="text-xs">{mail.date}</TableCell>
                    <TableCell>
                      <Badge className="text-xs bg-gray-100 text-gray-700">
                        {mail.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(mail.priority)}>
                        {mail.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(mail.status)}>
                        {mail.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMail(mail.id)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEditMail(mail.id)}
                          title="Edit Mail"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteMail(mail.id)}
                          title="Delete Mail"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 mb-2 text-gray-400" />
                      <p>No inward mails found matching your filters</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedPriority('all');
                          setSelectedStatus('all');
                          setSelectedDepartment('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{inwardMails.length}</div>
          <div className="text-sm text-gray-500">Total Mails</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {inwardMails.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {inwardMails.filter(m => m.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-500">Approved</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {inwardMails.filter(m => m.priority === 'High' || m.priority === 'Important').length}
          </div>
          <div className="text-sm text-gray-500">High Priority</div>
        </Card>
      </div>
    </div>
  );
}
