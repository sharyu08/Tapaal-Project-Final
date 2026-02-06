import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../../components/ui';
import { Plus, Search, Eye, Edit, Trash2, AlertCircle, Filter, X } from 'lucide-react';
import { outwardMailService } from '../../../services/outward-mail-service';
import { OutwardMailDetail } from './OutwardMailDetail';
import { EditOutwardMail } from './EditOutwardMail';
import { CreateOutwardMail } from './CreateOutwardMail';

interface OutwardMailsProps {
  onViewMail?: (mail: any) => void;
  onEditMail?: (mail: any) => void;
  onCreateMail?: () => void;
  onRefresh?: () => void;
}

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'approved': 'bg-blue-100 text-blue-700',
    'waiting': 'bg-orange-100 text-orange-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    'sent': 'bg-green-100 text-green-700',
    'delivered': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700',
  };
  return variants[status] || 'bg-gray-100 text-gray-700';
};

const getPriorityBadge = (priority: string) => {
  const variants: { [key: string]: string } = {
    'Low': 'bg-gray-100 text-gray-700',
    'Normal': 'bg-blue-100 text-blue-700',
    'Medium': 'bg-orange-100 text-orange-700',
    'High': 'bg-red-100 text-red-700',
    'Important': 'bg-purple-100 text-purple-700',
  };
  return variants[priority] || 'bg-gray-100 text-gray-700';
};

export function OutwardMailsCRUD({ onViewMail, onEditMail, onCreateMail, onRefresh }: OutwardMailsProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [outwardMails, setOutwardMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState('list');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

  // Fetch data from API
  const fetchOutwardMails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching outward mails...');
      
      const response = await outwardMailService.getOutwardMails({
        search: searchTerm,
        priority: selectedPriority,
        status: selectedStatus,
        department: selectedDepartment
      });

      console.log('📥 API Response:', response);

      if (response.success) {
        console.log('✅ Data fetched successfully:', response.data);
        setOutwardMails(response.data);
        setError('');
      } else {
        console.log('❌ API returned error:', response.message);
        setError('Failed to fetch outward mails: ' + response.message);
      }
    } catch (err) {
      console.error('💥 Error fetching outward mails:', err);
      setError('Error fetching outward mails');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    console.log('🔄 Triggering fetch due to change...');
    fetchOutwardMails();
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
      const response = await outwardMailService.deleteOutwardMail(mailId);

      if (response.success) {
        console.log('✅ Mail deleted successfully');
        alert('Mail deleted successfully!');
        setRefreshTrigger(prev => prev + 1);
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
    setCurrentView('create');
    onCreateMail?.();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedMailId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleMailSaved = () => {
    console.log('🔄 Mail saved, refreshing list...');
    setRefreshTrigger(prev => prev + 1);
    handleBackToList();
    onRefresh?.();
  };

  // View Components
  if (currentView === 'detail' && selectedMailId) {
    return (
      <OutwardMailDetail
        mailId={selectedMailId}
        onBack={handleBackToList}
        onEdit={handleEditMail}
      />
    );
  }

  if (currentView === 'edit' && selectedMailId) {
    return (
      <EditOutwardMail
        mailId={selectedMailId}
        onBack={handleBackToList}
        onSave={handleMailSaved}
        onRefresh={handleMailSaved}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateOutwardMail
        onBack={handleBackToList}
        onRefresh={handleMailSaved}
      />
    );
  }

  // List View Component
  const filteredMails = outwardMails.filter((mail) => {
    console.log('🔍 Filtering mail:', mail);
    
    const matchesSearch = searchTerm === '' ||
      (mail.receiver && mail.receiver.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mail.id && mail.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mail.subject && mail.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mail.details && mail.details.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = selectedPriority === 'all' || mail.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || mail.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || mail.department === selectedDepartment;

    const shouldShow = matchesSearch && matchesPriority && matchesStatus && matchesDepartment;
    console.log('📊 Filter result:', { mailId: mail.id, shouldShow });
    
    return shouldShow;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Outward Mails</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all outgoing correspondence</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateMail}>
          <Plus className="w-4 h-4 mr-2" />
          Add Outward Mail
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ID, receiver, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
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
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
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

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedPriority('all');
                setSelectedStatus('all');
                setSelectedDepartment('all');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
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
                <TableHead>Sent By</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Subject</TableHead>
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
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-red-500">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMails.length > 0 ? (
                filteredMails.map((mail) => (
                  <TableRow key={mail.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{mail.id || 'N/A'}</TableCell>
                    <TableCell>{mail.sentBy || 'N/A'}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={mail.receiver}>
                      {mail.receiver || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={mail.subject}>
                      {mail.subject || 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs">{mail.date || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className="text-xs bg-gray-100 text-gray-700">
                        {mail.department || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(mail.priority)}>
                        {mail.priority || 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(mail.status)}>
                        {mail.status || 'pending'}
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
                          onClick={() => handleEditMail(mail.id)}
                          title="Edit Mail"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
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
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 mb-2 text-gray-400" />
                      <p>No outward mails found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {outwardMails.length > 0 
                          ? "Try adjusting your filters" 
                          : "Create your first outward mail to get started"
                        }
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleCreateMail}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Outward Mail
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
          <div className="text-2xl font-bold text-blue-600">{outwardMails.length}</div>
          <div className="text-sm text-gray-500">Total Mails</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {outwardMails.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {outwardMails.filter(m => m.status === 'sent' || m.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-500">Sent/Delivered</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {outwardMails.filter(m => m.priority === 'High' || m.priority === 'Important').length}
          </div>
          <div className="text-sm text-gray-500">High Priority</div>
        </Card>
      </div>
    </div>
  );
}
