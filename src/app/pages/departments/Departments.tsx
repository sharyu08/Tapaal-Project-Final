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
        <div className="p-3 sm:p-4 md:p-6 w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{t('departments.title')}</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">{t('departments.subtitle')}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('common.new')} {t('departments.newDepartment')}
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
                    placeholder={t('departments.searchPlaceholder')}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Filter Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="w-full sm:w-auto"
                >
                  Clear Search
                </Button>
                <Button 
                  onClick={fetchDepartments}
                  className="w-full sm:w-auto"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          {/* Departments List */}
          <Card className="p-4 sm:p-6">
            {/* Mobile View - Stacked Cards */}
            <div className="md:hidden space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm sm:text-base">Loading departments...</span>
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm sm:text-base">
                    {searchTerm ? t('departments.noDepartmentsFound') : t('departments.noDepartments')}
                  </p>
                  {!searchTerm && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 mt-4"
                      onClick={() => setShowCreateForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('departments.createFirstDepartment')}
                    </Button>
                  )}
                </div>
              ) : (
                filteredDepartments.map((dept) => (
                  <div key={dept._id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-500">{t('departments.departmentId')}</span>
                          <p className="font-medium text-blue-600 text-sm sm:text-base truncate">{dept._id}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDepartment(dept._id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">{t('departments.departmentName')}</span>
                        <p className="font-medium text-sm sm:text-base truncate">{dept.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-xs text-gray-500">{t('departments.code')}</span>
                          <div className="mt-1">
                            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                              {dept.code}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">{t('departments.head')}</span>
                        <p className="text-sm sm:text-base truncate">{dept.headOfDepartment}</p>
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
                      <TableHead className="font-semibold min-w-[100px]">{t('departments.departmentId')}</TableHead>
                      <TableHead className="font-semibold min-w-[150px]">{t('departments.departmentName')}</TableHead>
                      <TableHead className="font-semibold min-w-[80px]">{t('departments.code')}</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">{t('departments.head')}</TableHead>
                      <TableHead className="font-semibold text-right min-w-[100px]">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm sm:text-base">Loading departments...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          <p className="text-sm sm:text-base">
                            {searchTerm ? t('departments.noDepartmentsFound') : t('departments.noDepartments')}
                          </p>
                          {!searchTerm && (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 mt-4"
                              onClick={() => setShowCreateForm(true)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {t('departments.createFirstDepartment')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((dept) => (
                        <TableRow key={dept._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-blue-600 text-sm">{dept._id}</TableCell>
                          <TableCell className="font-medium text-sm">{dept.name}</TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {dept.code}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{dept.headOfDepartment}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDepartment(dept._id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  );
}
