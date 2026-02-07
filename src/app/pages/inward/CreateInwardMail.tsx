import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '../../components/ui';
import { UploadCloud, Search, ArrowLeft, Send, Calendar, User, Building, Brain, Globe } from 'lucide-react';
import { aiService, DuplicateResult, PriorityResult, DescriptionSuggestion, ContentSuggestion } from '../../services/ai-service';
import { AIDuplicateAlert } from '../../components/ai/AIDuplicateAlert';
import { AIPrioritySuggestion } from '../../components/ai/AIPrioritySuggestion';
import { AIDescriptionSuggestions } from '../../components/ai/AIDescriptionSuggestions';
import { AIContentSuggestions } from '../../components/ai/AIContentSuggestions';
import { apiService } from '../../../services/api-service';

interface CreateInwardMailProps {
    onBack?: () => void;
}

export function CreateInwardMail({ onBack }: CreateInwardMailProps) {
    const { t, i18n } = useTranslation();
    const [senderName, setSenderName] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [receivedDate, setReceivedDate] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [referenceNumber, setReferenceNumber] = useState('');

    // AI States
    const [duplicateResult, setDuplicateResult] = useState<DuplicateResult | null>(null);
    const [priorityResult, setPriorityResult] = useState<PriorityResult | null>(null);
    const [descriptionSuggestions, setDescriptionSuggestions] = useState<DescriptionSuggestion[]>([]);
    const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(true);
    const [showPrioritySuggestion, setShowPrioritySuggestion] = useState(true);
    const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(true);
    const [showContentSuggestions, setShowContentSuggestions] = useState(true);
    const [existingMails, setExistingMails] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Fetch existing mails and departments
    useEffect(() => {
        fetchExistingData();
    }, []);

    const fetchExistingData = async () => {
        try {
            // For now, we'll use static data for AI suggestions
            const allMails = [
                {
                    subject: 'Meeting Schedule for Next Week',
                    description: 'This is regarding the meeting scheduled for next week',
                    sender: 'John Doe',
                    department: 'Administration',
                    priority: 'High'
                },
                {
                    subject: 'Budget Approval Request',
                    description: 'Request for budget approval for Q4 projects',
                    sender: 'Finance Department',
                    department: 'Finance',
                    priority: 'High'
                },
                {
                    subject: 'Policy Update Notification',
                    description: 'Notification regarding recent policy changes',
                    sender: 'All Staff',
                    department: 'Administration',
                    priority: 'Normal'
                },
                {
                    subject: 'Training Schedule',
                    description: 'Employee training program schedule for next month',
                    sender: 'HR Department',
                    department: 'Human Resources',
                    priority: 'Medium'
                }
            ];

            setExistingMails(allMails);
            setDepartments(['Finance', 'HR', 'Procurement', 'Administration', 'IT', 'Legal']);
        } catch (error) {
            console.error('Error fetching existing data:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAttachedFiles(Array.from(event.target.files));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
            setAttachedFiles(Array.from(event.dataTransfer.files));
        }
    };

    // AI Effects
    useEffect(() => {
        // Check for duplicates when subject or sender changes
        if (subject || senderName) {
            checkForDuplicates();
        }
    }, [subject, senderName]);

    useEffect(() => {
        // Assign priority when subject or description changes
        if (subject || description) {
            assignAIPriority();
        }
    }, [subject, description]);

    useEffect(() => {
        // Get description suggestions and check for duplicates when subject changes
        if (subject) {
            getDescriptionSuggestions();
            checkForDuplicates();
            getContentSuggestions();
        }
    }, [subject]);

    useEffect(() => {
        // Check for duplicates and get content suggestions when sender name or department changes
        if (senderName || department) {
            checkForDuplicates();
            getContentSuggestions();
        }
    }, [senderName, department]);

    const checkForDuplicates = async () => {
        const newMail = {
            subject,
            description,
            sender: senderName,
            department,
            priority
        };

        const result = await aiService.detectDuplicate(newMail, existingMails);
        setDuplicateResult(result);
    };

    const assignAIPriority = async () => {
        const content = `${subject} ${description}`;
        const result = await aiService.assignPriority(content);
        setPriorityResult(result);
    };

    const getContentSuggestions = async () => {
        const currentMail = {
            subject,
            description,
            sender: senderName,
            department,
            priority
        };
        const suggestions = await aiService.getContentSuggestions(currentMail, existingMails);
        setContentSuggestions(suggestions);
    };

    const handleApplyContentSuggestion = (type: string, suggestion: string) => {
        switch (type) {
            case 'subject':
                setSubject(suggestion);
                break;
            case 'description':
                setDescription(suggestion);
                break;
            case 'sender':
                setSenderName(suggestion);
                break;
            case 'priority':
                setPriority(suggestion);
                break;
        }
        setShowContentSuggestions(false);
    };

    const getDescriptionSuggestions = async () => {
        const suggestions = await aiService.getDescriptionSuggestions(subject);
        setDescriptionSuggestions(suggestions);
    };

    const handleApplyPriority = (suggestedPriority: string) => {
        setPriority(suggestedPriority);
        setShowPrioritySuggestion(false);
    };

    const handleSelectDescription = (suggestion: string) => {
        setDescription(suggestion);
        setShowDescriptionSuggestions(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validation
        if (!senderName.trim()) {
            alert(t('createInwardMail.validation.senderNameRequired'));
            return;
        }

        if (!department) {
            alert(t('createInwardMail.validation.departmentRequired'));
            return;
        }

        if (!description.trim()) {
            alert(t('createInwardMail.validation.descriptionRequired'));
            return;
        }

        console.log('🚀 Starting mail submission...');
        console.log('Form data:', {
            senderName,
            senderAddress,
            subject,
            description,
            department,
            priority,
            receivedDate,
            attachedFiles,
            referenceNumber
        });

        try {
            // Create JSON data for serverless environment
            const mailData = {
                receivedBy: 'System Admin',
                handoverTo: 'System Admin',
                sender: senderName,
                deliveryMode: 'Courier',
                details: description,
                referenceDetails: referenceNumber,
                priority: priority,
                department: department,
                date: receivedDate || new Date().toISOString().slice(0, 10),
                attachments: attachedFiles.map(file => ({
                    filename: file.name,
                    originalName: file.name,
                    size: file.size,
                    mimetype: file.type || 'application/octet-stream'
                }))
            };

            console.log('📤 Sending to API:', mailData);

            const response = await apiService.createInwardMail(mailData);

            console.log('📥 API Response:', response);

            if (response.success) {
                console.log('✅ Mail saved successfully!');
                alert(t('createInwardMail.success'));
                // Clear form fields
                setSenderName('');
                setSenderAddress('');
                setSubject('');
                setDescription('');
                setDepartment('');
                setPriority('Normal');
                setReceivedDate('');
                setReferenceNumber('');
                setAttachedFiles([]);
                onBack?.();
            } else {
                console.log('❌ API returned error:', response.message);
                alert(t('createInwardMail.error') + ': ' + response.message);
            }
        } catch (error) {
            console.error('💥 Error creating inward mail:', error);
            alert(t('createInwardMail.error'));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} className="p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">{t('createInwardMail.title')}</h1>
                        <p className="text-gray-500 text-sm">{t('createInwardMail.subtitle')}</p>
                    </div>
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
                {/* AI Alerts and Suggestions */}
                {showDuplicateAlert && duplicateResult && duplicateResult.isDuplicate && (
                    <AIDuplicateAlert
                        duplicateResult={duplicateResult}
                        onDismiss={() => setShowDuplicateAlert(false)}
                    />
                )}

                {showPrioritySuggestion && priorityResult && (
                    <AIPrioritySuggestion
                        priorityResult={priorityResult}
                        onApplyPriority={handleApplyPriority}
                        onDismiss={() => setShowPrioritySuggestion(false)}
                    />
                )}

                {showDescriptionSuggestions && descriptionSuggestions.length > 0 && !description && (
                    <AIDescriptionSuggestions
                        suggestions={descriptionSuggestions}
                        onSelectSuggestion={handleSelectDescription}
                        onDismiss={() => setShowDescriptionSuggestions(false)}
                    />
                )}

                {showContentSuggestions && contentSuggestions.length > 0 && (
                    <AIContentSuggestions
                        suggestions={contentSuggestions}
                        onApplySuggestion={handleApplyContentSuggestion}
                        onDismiss={() => setShowContentSuggestions(false)}
                    />
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {t('createInwardMail.senderInformation')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="senderName">{t('createInwardMail.senderName')} {t('createInwardMail.required')}</Label>
                                <Input
                                    id="senderName"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    placeholder={t('createInwardMail.senderNamePlaceholder')}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="department">{t('createInwardMail.department')} {t('createInwardMail.required')}</Label>
                                <Select value={department} onValueChange={setDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('createInwardMail.selectDepartment')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Finance">{t('departments.finance')}</SelectItem>
                                        <SelectItem value="HR">{t('departments.hr')}</SelectItem>
                                        <SelectItem value="Procurement">{t('departments.procurement')}</SelectItem>
                                        <SelectItem value="Administration">{t('departments.administration')}</SelectItem>
                                        <SelectItem value="IT">{t('departments.it')}</SelectItem>
                                        <SelectItem value="Legal">{t('departments.legal')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="senderAddress">{t('createInwardMail.senderAddress')}</Label>
                            <Textarea
                                id="senderAddress"
                                value={senderAddress}
                                onChange={(e) => setSenderAddress(e.target.value)}
                                placeholder={t('createInwardMail.senderAddressPlaceholder')}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('createInwardMail.mailDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="subject">{t('createInwardMail.subject')} {t('createInwardMail.required')}</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder={t('createInwardMail.subjectPlaceholder')}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">{t('createInwardMail.description')}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('createInwardMail.descriptionPlaceholder')}
                                rows={5}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="priority">{t('createInwardMail.priority')}</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">{t('createInwardMail.low')}</SelectItem>
                                        <SelectItem value="Normal">{t('createInwardMail.normal')}</SelectItem>
                                        <SelectItem value="High">{t('createInwardMail.high')}</SelectItem>
                                        <SelectItem value="Important">{t('createInwardMail.important')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="receivedDate">{t('createInwardMail.receivedDate')}</Label>
                                <Input
                                    id="receivedDate"
                                    type="date"
                                    value={receivedDate}
                                    onChange={(e) => setReceivedDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="referenceNumber">{t('createInwardMail.referenceNumber')}</Label>
                                <Input
                                    id="referenceNumber"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder={t('createInwardMail.referenceNumberPlaceholder')}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" />
                            {t('createInwardMail.attachments')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">{t('createInwardMail.dragDropText')}</p>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                {t('createInwardMail.browseFiles')}
                            </Button>
                        </div>
                        {attachedFiles.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">{t('createInwardMail.attachedFiles')}</p>
                                <ul className="space-y-1">
                                    {attachedFiles.map((file, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4 mr-2" />
                        {t('createInwardMail.saveInwardMail')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                        {t('common.cancel')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
