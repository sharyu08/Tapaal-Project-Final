import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge } from '../../components/ui';
import { Plus, Edit, Trash2, User, Mail, Phone, Shield, Calendar } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  address: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users from API...');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://tapaal-backend.vercel.app/api';
      const response = await fetch(`${apiUrl}/users`);
      const data = await response.json();

      if (data.success) {
        console.log('📥 Users fetched successfully:', data.data.length);
        setUsers(data.data);
        setError('');
      } else {
        console.log('❌ Failed to fetch users:', data.message);
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('💥 Error fetching users:', err);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    const variants: { [key: string]: string } = {
      'admin': 'bg-purple-100 text-purple-700',
      'manager': 'bg-blue-100 text-blue-700',
      'user': 'bg-gray-100 text-gray-700'
    };
    return variants[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all users</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-red-500">
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    {error}
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(user.isActive)}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
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
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <User className="w-8 h-8 mb-2 text-gray-400" />
                    <p>No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Create your first user to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
