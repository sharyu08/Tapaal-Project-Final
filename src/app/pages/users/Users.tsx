import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Plus, Pencil, Trash2 } from 'lucide-react';

// Primitive UI Imports
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { cn } from '../../components/ui/utils';
import { CreateUser } from './CreateUser';
import { userService } from '../../../services/user-service.js';

// Type assertion for the imported service
const service = userService as any;

// --- Types & Constants ---

interface User {
  name: string;
  email: string;
  role: 'Admin' | 'HOD' | 'Clerk' | 'Officer';
  department: string;
  status: 'Active' | 'Inactive';
}

const USERS_DATA: User[] = [
  { name: 'John Doe', email: 'john.doe@gov.in', role: 'Admin', department: 'Administration', status: 'Active' },
  { name: 'Jane Smith', email: 'jane.smith@gov.in', role: 'HOD', department: 'Finance', status: 'Active' },
  { name: 'Mike Johnson', email: 'mike.j@gov.in', role: 'Clerk', department: 'HR', status: 'Active' },
  { name: 'Sarah Williams', email: 'sarah.w@gov.in', role: 'Officer', department: 'IT', status: 'Active' },
  { name: 'Robert Brown', email: 'robert.b@gov.in', role: 'HOD', department: 'Operations', status: 'Active' },
  { name: 'Emily Davis', email: 'emily.d@gov.in', role: 'Clerk', department: 'Finance', status: 'Inactive' },
];

// --- Sub-components for Badges ---

const UserRoleBadge = ({ role }: { role: User['role'] }) => {
  const variants: Record<string, string> = {
    Admin: 'bg-red-50 text-red-700 border-red-100',
    HOD: 'bg-purple-50 text-purple-700 border-purple-100',
    Clerk: 'bg-blue-50 text-blue-700 border-blue-100',
    Officer: 'bg-green-50 text-green-700 border-green-100',
  };
  return (
    <Badge className={cn("border font-medium shadow-none", variants[role])}>
      {role}
    </Badge>
  );
};

const UserStatusBadge = ({ status }: { status: User['status'] }) => (
  <Badge
    className={cn(
      "border font-medium shadow-none",
      status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-100'
    )}
  >
    {status}
  </Badge>
);

// --- Main Component ---

export function Users() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [deptFilter, setDeptFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await service.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Performance Optimization: Only filter when search or filters change
  const filteredUsers = React.useMemo(() => {
    return users.filter((user: any) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesDept = deptFilter === 'all' || user.department === deptFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, deptFilter, statusFilter]);

  return (
    <div>
      {showCreateForm ? (
        <CreateUser onBack={() => {
          setShowCreateForm(false);
          fetchUsers(); // Refresh users list after creating new user
        }} />
      ) : (
        <div className="p-3 sm:p-4 md:p-6 w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
          {/* Page Header */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{t('users.title')}</h1>
              <p className="text-gray-500 text-sm sm:text-base font-medium">{t('users.subtitle')}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full sm:w-auto" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('users.addNewUser')}
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
                    placeholder={t('users.searchPlaceholder')}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Grid - Responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('users.role')}</label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('users.allRoles')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                      <SelectItem value="Admin">{t('users.admin')}</SelectItem>
                      <SelectItem value="HOD">{t('users.hod')}</SelectItem>
                      <SelectItem value="Clerk">{t('users.clerk')}</SelectItem>
                      <SelectItem value="Officer">{t('users.officer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('users.department')}</label>
                  <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('users.allDepartments')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('users.allDepartments')}</SelectItem>
                      <SelectItem value="Administration">{t('users.administration')}</SelectItem>
                      <SelectItem value="Finance">{t('users.finance')}</SelectItem>
                      <SelectItem value="HR">{t('users.hr')}</SelectItem>
                      <SelectItem value="IT">{t('users.it')}</SelectItem>
                      <SelectItem value="Operations">{t('users.operations')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('users.status')}</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('users.allStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('users.allStatus')}</SelectItem>
                      <SelectItem value="Active">{t('users.active')}</SelectItem>
                      <SelectItem value="Inactive">{t('users.inactive')}</SelectItem>
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
                    setRoleFilter('all');
                    setDeptFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full sm:w-auto"
                >
                  {t('common.clear')}
                </Button>
                <Button 
                  onClick={fetchUsers}
                  className="w-full sm:w-auto"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          {/* Users List */}
          <Card className="p-4 sm:p-6 border-gray-200 shadow-sm overflow-hidden">
            {/* Mobile View - Stacked Cards */}
            <div className="md:hidden space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm sm:text-base">Loading users...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <div key={user.email} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-500">{t('users.userDetails')}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.name}</span>
                            <span className="text-xs text-gray-500 font-medium truncate">{user.email}</span>
                          </div>
                        </div>
                        <UserStatusBadge status={user.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500">{t('users.role')}</span>
                          <UserRoleBadge role={user.role} />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">{t('users.department')}</span>
                          <p className="font-medium text-gray-600 text-sm sm:text-base truncate">{user.department}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button variant="ghost" size="sm" className="flex-1 justify-center text-blue-600 hover:bg-blue-50">
                          <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline ml-1 text-xs">{t('common.edit')}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 justify-center text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline ml-1 text-xs">{t('common.delete')}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm sm:text-base">{t('users.noUsersFound')}</p>
                </div>
              )}
            </div>
            
            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-gray-50/50">
                      <TableHead className="font-bold text-gray-600 min-w-[200px]">{t('users.userDetails')}</TableHead>
                      <TableHead className="font-bold text-gray-600 min-w-[100px]">{t('users.role')}</TableHead>
                      <TableHead className="font-bold text-gray-600 min-w-[120px]">{t('users.department')}</TableHead>
                      <TableHead className="font-bold text-gray-600 min-w-[80px]">{t('users.status')}</TableHead>
                      <TableHead className="font-bold text-gray-600 text-right min-w-[150px]">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm sm:text-base">Loading users...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user, idx) => (
                        <TableRow key={user.email} className="group">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                              <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell><UserRoleBadge role={user.role} /></TableCell>
                          <TableCell className="font-medium text-gray-600 text-sm">{user.department}</TableCell>
                          <TableCell><UserStatusBadge status={user.status} /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                <Pencil className="w-4 h-4 mr-1" />
                                <span className="hidden lg:inline">{t('common.edit')}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4 mr-1" />
                                <span className="hidden lg:inline">{t('common.delete')}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                          <p className="text-sm sm:text-base">{t('users.noUsersFound')}</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}