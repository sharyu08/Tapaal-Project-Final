import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Badge } from '../../components/ui';
import { ArrowLeft, Building, User, Mail, Phone, MapPin, Users, Settings, Brain, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import { aiService } from '../../services/ai-service';
import { apiService } from '../../../services/api-service';

interface CreateDepartmentProps {
    onBack?: () => void;
    onDepartmentCreated?: () => void;
}

export function CreateDepartment({ onBack, onDepartmentCreated }: CreateDepartmentProps) {
    const { t, i18n } = useTranslation();
    const [departmentName, setDepartmentName] = useState('');
    const [departmentCode, setDepartmentCode] = useState('');
    const [departmentHead, setDepartmentHead] = useState('');
    const [headEmail, setHeadEmail] = useState('');
    const [headPhone, setHeadPhone] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [employeeCount, setEmployeeCount] = useState('');
    const [budget, setBudget] = useState('');
    const [status, setStatus] = useState('active');
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

    // Fetch existing departments
    useEffect(() => {
        fetchExistingDepartments();
    }, []);

    const fetchExistingDepartments = async () => {
        try {
            const response = await apiService.getDepartments();
            setExistingDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            // Mock data for demo with realistic department information
            setExistingDepartments([
                {
                    name: 'Education',
                    code: 'EDU',
                    employeeCount: 45,
                    budget: 5000000,
                    head: 'Dr. Sarah Johnson',
                    headEmail: 'sarah.johnson@education.gov',
                    headPhone: '+91 98765 43210',
                    location: 'Floor 2, Building A'
                },
                {
                    name: 'Revenue',
                    code: 'REV',
                    employeeCount: 120,
                    budget: 8000000,
                    head: 'Mr. Rajesh Kumar',
                    headEmail: 'rajesh.kumar@revenue.gov',
                    headPhone: '+91 98765 43211',
                    location: 'Floor 3, Building B'
                },
                {
                    name: 'Health',
                    code: 'HLT',
                    employeeCount: 85,
                    budget: 12000000,
                    head: 'Dr. Priya Sharma',
                    headEmail: 'priya.sharma@health.gov',
                    headPhone: '+91 98765 43212',
                    location: 'Floor 1, Building A'
                }
            ]);
        }
    };

    // AI Duplicate Detection for Department Name
    useEffect(() => {
        if (departmentName) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.name.toLowerCase() === departmentName.toLowerCase()
            );
            setNameDuplicate(isDuplicate);
        } else {
            setNameDuplicate(false);
        }
    }, [departmentName, existingDepartments]);

    // AI Duplicate Detection for Department Code
    useEffect(() => {
        if (departmentCode) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.code === departmentCode.toUpperCase()
            );
            setCodeDuplicate(isDuplicate);
        } else {
            setCodeDuplicate(false);
        }
    }, [departmentCode, existingDepartments]);

    // AI Duplicate Detection for Department Head
    useEffect(() => {
        if (departmentHead) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.head && dept.head.toLowerCase() === departmentHead.toLowerCase()
            );
            setHeadDuplicate(isDuplicate);
        } else {
            setHeadDuplicate(false);
        }
    }, [departmentHead, existingDepartments]);

    // AI Duplicate Detection for Head Email
    useEffect(() => {
        if (headEmail) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.headEmail && dept.headEmail.toLowerCase() === headEmail.toLowerCase()
            );
            setEmailDuplicate(isDuplicate);
        } else {
            setEmailDuplicate(false);
        }
    }, [headEmail, existingDepartments]);

    // AI Duplicate Detection for Head Phone
    useEffect(() => {
        if (headPhone) {
            const normalizedPhone = headPhone.replace(/\D/g, ''); // Remove all non-digits
            const isDuplicate = existingDepartments.some(dept =>
                dept.headPhone && dept.headPhone.replace(/\D/g, '') === normalizedPhone
            );
            setPhoneDuplicate(isDuplicate);
        } else {
            setPhoneDuplicate(false);
        }
    }, [headPhone, existingDepartments]);

    // AI Duplicate Detection for Location
    useEffect(() => {
        if (location) {
            const isDuplicate = existingDepartments.some(dept =>
                dept.location && dept.location.toLowerCase() === location.toLowerCase()
            );
            setLocationDuplicate(isDuplicate);
        } else {
            setLocationDuplicate(false);
        }
    }, [location, existingDepartments]);

    // AI Warnings Generator
    useEffect(() => {
        const warnings = [];

        if (nameDuplicate) {
            warnings.push({
                type: 'name',
                message: t('createDepartment.aiWarnings.nameExists'),
                severity: 'high'
            });
        }

        if (codeDuplicate) {
            warnings.push({
                type: 'code',
                message: t('createDepartment.aiWarnings.codeExists'),
                severity: 'high'
            });
        }

        if (headDuplicate) {
            warnings.push({
                type: 'head',
                message: t('createDepartment.aiWarnings.headExists'),
                severity: 'medium'
            });
        }

        if (emailDuplicate) {
            warnings.push({
                type: 'email',
                message: t('createDepartment.aiWarnings.emailExists'),
                severity: 'medium'
            });
        }

        if (phoneDuplicate) {
            warnings.push({
                type: 'phone',
                message: t('createDepartment.aiWarnings.phoneExists'),
                severity: 'medium'
            });
        }

        if (locationDuplicate) {
            warnings.push({
                type: 'location',
                message: t('createDepartment.aiWarnings.locationExists'),
                severity: 'low'
            });
        }

        setAiWarnings(warnings);
    }, [nameDuplicate, codeDuplicate, headDuplicate, emailDuplicate, phoneDuplicate, locationDuplicate]);

    // AI Budget and Employee Count Suggestions based on department type
    useEffect(() => {
        if (departmentName) {
            const deptName = departmentName.toLowerCase();

            // Suggest budget based on department type
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

    // Auto-generate department code from name
    useEffect(() => {
        if (departmentName && !departmentCode) {
            const code = departmentName
                .split(' ')
                .map(word => word.charAt(0).toUpperCase())
                .join('')
                .substring(0, 3);
            setDepartmentCode(code);
        }
    }, [departmentName, departmentCode]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check for high-severity warnings before submission
        const highSeverityWarnings = aiWarnings.filter(w => w.severity === 'high');
        if (highSeverityWarnings.length > 0) {
            alert(t('createDepartment.aiWarnings.resolveConflicts') +
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
            // Call the API service to create the department
            const response = await apiService.createDepartment(departmentData);

            if (!response.success) {
                throw new Error(response.message || 'Failed to create department');
            }

            console.log('Department created successfully:', response);

            alert(t('createDepartment.success'));

            // Call the callback to refresh the department list
            if (onDepartmentCreated) {
                onDepartmentCreated();
            }

            // Go back to the department list
            if (onBack) {
                onBack();
            }
        } catch (error) {
            console.error('Error creating department:', error);
            alert(`${t('createDepartment.error')}: ${error.message}`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={onBack} className="p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{t('createDepartment.title')}</h1>
                    <p className="text-gray-500 text-sm">{t('createDepartment.subtitle')}</p>
                </div>

                {/* Language Selector */}
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी</SelectItem>
                            <SelectItem value="mr">मराठी</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* AI Warnings Summary */}
                {aiWarnings.length > 0 && (
                    <Card className={`border-l-4 ${aiWarnings.some(w => w.severity === 'high') ? 'border-red-500 bg-red-50' : aiWarnings.some(w => w.severity === 'medium') ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50'}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Brain className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{t('createDepartment.aiWarnings.title')}</h4>
                                        <Badge className={aiWarnings.some(w => w.severity === 'high') ? 'bg-red-100 text-red-800' : aiWarnings.some(w => w.severity === 'medium') ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {aiWarnings.length} {t('createDepartment.aiWarnings.issuesFound', { count: aiWarnings.length })}
                                        </Badge>
                                    </div>
                                    <p className="text-sm mb-3">
                                        {t('createDepartment.aiWarnings.description')}
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
                            {t('createDepartment.basicInformation')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="departmentName">{t('createDepartment.departmentName')} {t('createDepartment.required')}</Label>
                                <Input
                                    id="departmentName"
                                    value={departmentName}
                                    onChange={(e) => setDepartmentName(e.target.value)}
                                    placeholder={t('createDepartment.departmentNamePlaceholder')}
                                    className={nameDuplicate ? 'border-red-500' : ''}
                                    required
                                />
                                {nameDuplicate && (
                                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-700">
                                            {t('createDepartment.aiWarnings.nameDuplicate')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="departmentCode">{t('createDepartment.departmentCode')} {t('createDepartment.required')}</Label>
                                <Input
                                    id="departmentCode"
                                    value={departmentCode}
                                    onChange={(e) => setDepartmentCode(e.target.value)}
                                    placeholder={t('createDepartment.departmentCodePlaceholder')}
                                    maxLength={10}
                                    className={codeDuplicate ? 'border-red-500' : ''}
                                    required
                                />
                                {codeDuplicate && (
                                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-700">
                                            {t('createDepartment.aiWarnings.codeDuplicate')}
                                        </span>
                                    </div>
                                )}
                                {departmentCode && !codeDuplicate && (
                                    <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-700">
                                            {t('createDepartment.aiWarnings.aiGeneratedCode')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">{t('createDepartment.description')}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('createDepartment.descriptionPlaceholder')}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location">{t('createDepartment.location')}</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder={t('createDepartment.locationPlaceholder')}
                                    className={locationDuplicate ? 'border-red-500' : ''}
                                />
                                {locationDuplicate && (
                                    <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-700">
                                            {t('createDepartment.aiWarnings.locationDuplicate')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="status">{t('createDepartment.status')}</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">{t('createDepartment.active')}</SelectItem>
                                        <SelectItem value="inactive">{t('createDepartment.inactive')}</SelectItem>
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
                            {t('createDepartment.departmentHeadInformation')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="departmentHead">{t('createDepartment.departmentHead')} {t('createDepartment.required')}</Label>
                            <Input
                                id="departmentHead"
                                value={departmentHead}
                                onChange={(e) => setDepartmentHead(e.target.value)}
                                placeholder={t('createDepartment.departmentHeadPlaceholder')}
                                className={headDuplicate ? 'border-red-500' : ''}
                                required
                            />
                            {headDuplicate && (
                                <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm text-orange-700">
                                        {t('createDepartment.aiWarnings.headDuplicate')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="headEmail">{t('createDepartment.emailAddress')}</Label>
                                <Input
                                    id="headEmail"
                                    type="email"
                                    value={headEmail}
                                    onChange={(e) => setHeadEmail(e.target.value)}
                                    placeholder={t('createDepartment.emailPlaceholder')}
                                    className={emailDuplicate ? 'border-red-500' : ''}
                                />
                                {emailDuplicate && (
                                    <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm text-orange-700">
                                            {t('createDepartment.aiWarnings.emailDuplicate')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="headPhone">{t('createDepartment.phoneNumber')}</Label>
                                <Input
                                    id="headPhone"
                                    type="tel"
                                    value={headPhone}
                                    onChange={(e) => setHeadPhone(e.target.value)}
                                    placeholder={t('createDepartment.phonePlaceholder')}
                                    className={phoneDuplicate ? 'border-red-500' : ''}
                                />
                                {phoneDuplicate && (
                                    <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm text-orange-700">
                                            {t('createDepartment.aiWarnings.phoneDuplicate')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            {t('createDepartment.departmentDetails')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="employeeCount">{t('createDepartment.employeeCount')}</Label>
                                <Input
                                    id="employeeCount"
                                    type="number"
                                    value={employeeCount}
                                    onChange={(e) => setEmployeeCount(e.target.value)}
                                    placeholder="0"
                                    min="0"
                                />
                                {suggestedEmployeeCount && !employeeCount && showAISuggestions && (
                                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-700">
                                            {t('createDepartment.aiSuggestions.suggests')} {suggestedEmployeeCount} {t('createDepartment.aiSuggestions.employees')}
                                        </span>
                                        <button
                                            onClick={() => setEmployeeCount(suggestedEmployeeCount.split('-')[0])}
                                            className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            {t('createDepartment.aiSuggestions.apply')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="budget">{t('createDepartment.annualBudget')}</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {suggestedBudget && !budget && showAISuggestions && (
                                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-700">
                                            {t('createDepartment.aiSuggestions.suggests')} {suggestedBudget} {t('createDepartment.aiSuggestions.budget')}
                                        </span>
                                        <button
                                            onClick={() => setBudget(suggestedBudget.replace(/[₹,]/g, ''))}
                                            className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            {t('createDepartment.aiSuggestions.apply')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="parentDepartment">{t('createDepartment.parentDepartment')}</Label>
                                <Select value={parentDepartment} onValueChange={setParentDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('createDepartment.selectParentDepartment')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        <SelectItem value="Administration">{t('departments.administration')}</SelectItem>
                                        <SelectItem value="Finance">{t('departments.finance')}</SelectItem>
                                        <SelectItem value="Operations">{t('departments.operations')}</SelectItem>
                                        <SelectItem value="Legal">{t('departments.legal')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900">{t('createDepartment.setupSummary')}</h4>
                            <div className="mt-2 text-sm text-blue-700">
                                <p><strong>{t('createDepartment.name')}:</strong> {departmentName || t('createDepartment.notSpecified')}</p>
                                <p><strong>{t('createDepartment.code')}:</strong> {departmentCode || t('createDepartment.notSpecified')}</p>
                                <p><strong>{t('createDepartment.head')}:</strong> {departmentHead || t('createDepartment.notSpecified')}</p>
                                <p><strong>{t('createDepartment.status')}:</strong> {status}</p>
                                {employeeCount && <p><strong>{t('createDepartment.employees')}:</strong> {employeeCount}</p>}
                                {budget && <p><strong>{t('createDepartment.budget')}:</strong> ₹{parseFloat(budget).toLocaleString()}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        <Building className="w-4 h-4 mr-2" />
                        {t('createDepartment.createDepartment')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                        {t('common.cancel')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
