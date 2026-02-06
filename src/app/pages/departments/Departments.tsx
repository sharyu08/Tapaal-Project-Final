import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { CreateDepartment } from './CreateDepartment';
import { EditDepartment } from './EditDepartment';
import { apiService } from '../../../services/api-service';

export function Departments() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDepartments();

      if (response.success && response.data) {
        setDepartments(response.data);
      } else {
        console.warn('No departments data received, using fallback data');
        // Use minimal fallback data
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Set empty array on error to avoid breaking the UI
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDepartment = (departmentId: string) => {
    setEditingDepartmentId(departmentId);
    setShowEditForm(true);
  };

  const handleDepartmentUpdated = () => {
    fetchDepartments();
    setShowEditForm(false);
    setEditingDepartmentId('');
  };

  return (
    <div>
      {showCreateForm ? (
        <CreateDepartment
          onBack={() => setShowCreateForm(false)}
          onDepartmentCreated={fetchDepartments}
        />
      ) : showEditForm ? (
        <EditDepartment
          onBack={() => setShowEditForm(false)}
          departmentId={editingDepartmentId}
          onDepartmentUpdated={handleDepartmentUpdated}
        />
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{t('departments.title')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('departments.subtitle')}</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('common.new')} {t('departments.newDepartment')}
            </Button>
          </div>

          <Card className="p-6">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('departments.searchPlaceholder')}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading departments...</p>
                  </div>
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? t('departments.noDepartmentsFound') : t('departments.noDepartments')}
                    </p>
                    {!searchTerm && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowCreateForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('departments.createFirstDepartment')}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">{t('departments.departmentId')}</TableHead>
                      <TableHead className="font-semibold">{t('departments.departmentName')}</TableHead>
                      <TableHead className="font-semibold">{t('departments.code')}</TableHead>
                      <TableHead className="font-semibold">{t('departments.head')}</TableHead>
                      <TableHead className="font-semibold text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((dept) => (
                      <TableRow key={dept._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-blue-600">{dept._id}</TableCell>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {dept.code}
                          </span>
                        </TableCell>
                        <TableCell>{dept.headOfDepartment}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDepartment(dept._id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
