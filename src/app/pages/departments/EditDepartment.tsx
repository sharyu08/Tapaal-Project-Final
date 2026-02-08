import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Badge } from '../../components/ui';
import { ArrowLeft, Building, User, Mail, Phone, MapPin, Users, Settings, Brain, AlertTriangle, Save } from 'lucide-react';
import { aiService } from '../../services/ai-service';
import { apiService } from '../../../services/api-service';

interface EditDepartmentProps {
    onBack?: () => void;
    departmentId?: string;
    onDepartmentUpdated?: () => void;
}

export function EditDepartment({ onBack, departmentId, onDepartmentUpdated }: EditDepartmentProps) {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentCode, setDepartmentCode] = useState('');
    const [departmentHead, setDepartmentHead] = useState('');
    const [headEmail, setHeadEmail] = useState('');
    const [headPhone, setHeadPhone] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [employeeCount, setEmployeeCount] = useState('');
    const [budget, setBudget] = useState('');
    const [status, setStatus] = useState('Active');
    const [parentDepartment, setParentDepartment] = useState('');

    // AI States
    const [nameDuplicate, setNameDuplicate] = useState(false);
    const [codeDuplicate, setCodeDuplicate] = useState(false);
    const [headDuplicate, setHeadDuplicate] = useState(false);
    const [emailDuplicate, setEmailDuplicate] = useState(false);
    const [phoneDuplicate, setPhoneDuplicate] = useState(false);
    const [locationDuplicate, setLocationDuplicate] = useState(false);
    const [suggestedBudget, setSuggestedBudget] = useState('');
    const [suggestedEmployeeCount, setSuggestedEmployeeCount] = useState('');
    const [existingDepartments, setExistingDepartments] = useState([]);
    const [showAISuggestions, setShowAISuggestions] = useState(true);
    const [aiWarnings, setAiWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch existing departments and current department data
    useEffect(() => {
        fetchExistingDepartments();
        if (departmentId) {
            fetchDepartmentData();
        }
    }, [departmentId]);

    const fetchExistingDepartments = async () => {
        try {
            const response = await apiService.getDepartments();
            setExistingDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchDepartmentData = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://tapaal-backend.vercel.app/api';
            const response = await fetch(`${apiUrl}/departments/${departmentId}`);
            if (response.ok) {
                const data = await response.json();
                const dept = data.data;
                setDepartmentName(dept.name || '');
                setDepartmentCode(dept.code || '');
                setDepartmentHead(dept.headOfDepartment || '');
                setHeadEmail(dept.email || '');
                setHeadPhone(dept.phone || '');
                setDescription(dept.description || '');
                setLocation(dept.location || '');
                setStatus(dept.status || 'Active');
            }
        } catch (error) {
            console.error('Error fetching department data:', error);
        } finally {
            setLoading(false);
        }
    };

    // AI Duplicate Detection for Department Name
    useEffect(() => {
        if (departmentName) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.name.toLowerCase() === departmentName.toLowerCase() && dept.id !== departmentId
            );
            setNameDuplicate(isDuplicate);
        } else {
            setNameDuplicate(false);
        }
    }, [departmentName, existingDepartments, departmentId]);

    // AI Duplicate Detection for Department Code
    useEffect(() => {
        if (departmentCode) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.code === departmentCode.toUpperCase() && dept.id !== departmentId
            );
            setCodeDuplicate(isDuplicate);
        } else {
            setCodeDuplicate(false);
        }
    }, [departmentCode, existingDepartments, departmentId]);

    // AI Duplicate Detection for Department Head
    useEffect(() => {
        if (departmentHead) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.head && dept.head.toLowerCase() === departmentHead.toLowerCase() && dept.id !== departmentId
            );
            setHeadDuplicate(isDuplicate);
        } else {
            setHeadDuplicate(false);
        }
    }, [departmentHead, existingDepartments, departmentId]);

    // AI Duplicate Detection for Head Email
    useEffect(() => {
        if (headEmail) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.headEmail && dept.headEmail.toLowerCase() === headEmail.toLowerCase() && dept.id !== departmentId
            );
            setEmailDuplicate(isDuplicate);
        } else {
            setEmailDuplicate(false);
        }
    }, [headEmail, existingDepartments, departmentId]);

    // AI Duplicate Detection for Head Phone
    useEffect(() => {
        if (headPhone) {
            const normalizedPhone = headPhone.replace(/\D/g, '');
            const isDuplicate = existingDepartments.some(dept =>
                dept.headPhone && dept.headPhone.replace(/\D/g, '') === normalizedPhone && dept.id !== departmentId
            );
            setPhoneDuplicate(isDuplicate);
        } else {
            setPhoneDuplicate(false);
        }
    }, [headPhone, existingDepartments, departmentId]);

    // AI Duplicate Detection for Location
    useEffect(() => {
        if (location) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.location && dept.location.toLowerCase() === location.toLowerCase() && dept.id !== departmentId
            );
            setLocationDuplicate(isDuplicate);
        } else {
            setLocationDuplicate(false);
        }
    }, [location, existingDepartments, departmentId]);

    // AI Warnings Generator
    useEffect(() => {
        const warnings = [];

        if (nameDuplicate) {
            warnings.push({
                type: 'name',
                message: 'Department name already exists',
                severity: 'high'
            });
        }

        if (codeDuplicate) {
            warnings.push({
                type: 'code',
                message: 'Department code already exists',
                severity: 'high'
            });
        }

        if (headDuplicate) {
            warnings.push({
                type: 'head',
                message: 'This person is already head of another department',
                severity: 'medium'
            });
        }

        if (emailDuplicate) {
            warnings.push({
                type: 'email',
                message: 'Email already exists in system',
                severity: 'medium'
            });
        }

        if (phoneDuplicate) {
            warnings.push({
                type: 'phone',
                message: 'Phone number already exists in system',
                severity: 'medium'
            });
        }

        if (locationDuplicate) {
            warnings.push({
                type: 'location',
                message: 'This location is already assigned to another department',
                severity: 'low'
            });
        }

        setAiWarnings(warnings);
    }, [nameDuplicate, codeDuplicate, headDuplicate, emailDuplicate, phoneDuplicate, locationDuplicate]);

    // AI Budget and Employee Count Suggestions based on department type
    useEffect(() => {
        if (departmentName) {
            const deptName = departmentName.toLowerCase();

            if (deptName.includes('education') || deptName.includes('school')) {
                setSuggestedBudget('₹50,00,000');
                setSuggestedEmployeeCount('25-50');
            } else if (deptName.includes('health') || deptName.includes('medical')) {
                setSuggestedBudget('₹1,20,00,000');
                setSuggestedEmployeeCount('50-100');
            } else if (deptName.includes('revenue') || deptName.includes('finance')) {
                setSuggestedBudget('₹80,00,000');
                setSuggestedEmployeeCount('30-60');
            } else if (deptName.includes('admin') || deptName.includes('administration')) {
                setSuggestedBudget('₹30,00,000');
                setSuggestedEmployeeCount('15-30');
            } else {
                setSuggestedBudget('₹40,00,000');
                setSuggestedEmployeeCount('20-40');
            }
        }
    }, [departmentName]);

    const handleUpdateDepartment = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check for high-severity warnings before submission
        const highSeverityWarnings = aiWarnings.filter(w => w.severity === 'high');
        if (highSeverityWarnings.length > 0) {
            alert('Please resolve high-severity conflicts before updating the department:\n' +
                highSeverityWarnings.map(w => `• ${w.message}`).join('\n'));
            return;
        }

        const departmentData = {
            name: departmentName,
            code: departmentCode,
            headOfDepartment: departmentHead,
            email: headEmail,
            phone: headPhone,
            description,
            location,
            status,
        };

        try {
            setSaving(true);
            // Call the API to update the department
            const apiUrl = import.meta.env.VITE_API_URL || 'https://tapaal-backend.vercel.app/api';
            const response = await fetch(`${apiUrl}/departments/${departmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(departmentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update department');
            }

            const result = await response.json();
            console.log('Department updated successfully:', result);

            alert('Department Updated successfully!');

            // Call the callback to refresh the department list
            if (onDepartmentUpdated) {
                onDepartmentUpdated();
            }

            // Go back to the department list
            if (onBack) {
                onBack();
            }
        } catch (error) {
            console.error('Error updating department:', error);
            alert(`Error updating department: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading department data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={onBack} className="p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Department</h1>
                    <p className="text-gray-500 text-sm">Update department information</p>
                </div>
            </div>

            <form onSubmit={handleUpdateDepartment} className="space-y-6">
                {/* AI Warnings Summary */}
                {aiWarnings.length > 0 && (
                    <Card className={`border-l-4 ${aiWarnings.some(w => w.severity === 'high') ? 'border-red-500 bg-red-50' : aiWarnings.some(w => w.severity === 'medium') ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50'}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Brain className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">AI Detection Alert</h4>
                                        <Badge className={aiWarnings.some(w => w.severity === 'high') ? 'bg-red-100 text-red-800' : aiWarnings.some(w => w.severity === 'medium') ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {aiWarnings.length} Potential Issue{aiWarnings.length > 1 ? 's' : ''} Found
                                        </Badge>
                                    </div>
                                    <p className="text-sm mb-3">
                                        AI has detected potential conflicts with existing department information. Please review before proceeding.
                                    </p>
                                    <div className="space-y-2">
                                        {aiWarnings.map((warning, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <AlertTriangle className={`w-4 h-4 ${warning.severity === 'high' ? 'text-red-600' : warning.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'}`} />
                                                <span className={warning.severity === 'high' ? 'text-red-700' : warning.severity === 'medium' ? 'text-orange-700' : 'text-yellow-700'}>
                                                    {warning.message}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="departmentName">Department Name *</Label>
                                <Input
                                    id="departmentName"
                                    value={departmentName}
                                    onChange={(e) => setDepartmentName(e.target.value)}
                                    placeholder="Enter department name"
                                    className={nameDuplicate ? 'border-red-500' : ''}
                                    required
                                />
                                {nameDuplicate && (
                                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-700">
                                            Department name already exists! Choose a different name.
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="departmentCode">Department Code *</Label>
                                <Input
                                    id="departmentCode"
                                    value={departmentCode}
                                    onChange={(e) => setDepartmentCode(e.target.value)}
                                    placeholder="e.g., IT, HR, FIN"
                                    maxLength={10}
                                    className={codeDuplicate ? 'border-red-500' : ''}
                                    required
                                />
                                {codeDuplicate && (
                                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-700">
                                            Department code already exists! Use a unique code.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter department description and responsibilities"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Floor 3, Building A"
                                    className={locationDuplicate ? 'border-red-500' : ''}
                                />
                                {locationDuplicate && (
                                    <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-700">
                                            This location is already assigned to another department!
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Under Review">Under Review</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Department Head Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="departmentHead">Department Head *</Label>
                            <Input
                                id="departmentHead"
                                value={departmentHead}
                                onChange={(e) => setDepartmentHead(e.target.value)}
                                placeholder="Enter department head name"
                                className={headDuplicate ? 'border-red-500' : ''}
                                required
                            />
                            {headDuplicate && (
                                <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm text-orange-700">
                                        This person is already head of another department!
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="headEmail">Email Address</Label>
                                <Input
                                    id="headEmail"
                                    type="email"
                                    value={headEmail}
                                    onChange={(e) => setHeadEmail(e.target.value)}
                                    placeholder="head@company.com"
                                    className={emailDuplicate ? 'border-red-500' : ''}
                                />
                                {emailDuplicate && (
                                    <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm text-orange-700">
                                            Email already exists in system!
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="headPhone">Phone Number</Label>
                                <Input
                                    id="headPhone"
                                    type="tel"
                                    value={headPhone}
                                    onChange={(e) => setHeadPhone(e.target.value)}
                                    placeholder="+1 234 567 8900"
                                    className={phoneDuplicate ? 'border-red-500' : ''}
                                />
                                {phoneDuplicate && (
                                    <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm text-orange-700">
                                            Phone number already exists in system!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Suggestions */}
                {showAISuggestions && (suggestedBudget || suggestedEmployeeCount) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                AI Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {suggestedBudget && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-blue-900">Suggested Budget</p>
                                            <p className="text-blue-700">{suggestedBudget}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setBudget(suggestedBudget)}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {suggestedEmployeeCount && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-blue-900">Suggested Employee Count</p>
                                            <p className="text-blue-700">{suggestedEmployeeCount}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEmployeeCount(suggestedEmployeeCount)}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Department
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
