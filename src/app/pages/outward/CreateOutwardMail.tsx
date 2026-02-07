import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '../../components/ui';
import { UploadCloud, Search, ArrowLeft, Send, Calendar, User, Building, Brain } from 'lucide-react';
import { aiService, DuplicateResult, PriorityResult, DescriptionSuggestion, ContentSuggestion } from '../../services/ai-service';
import { AIDuplicateAlert } from '../../components/ai/AIDuplicateAlert';
import { AIPrioritySuggestion } from '../../components/ai/AIPrioritySuggestion';
import { AIDescriptionSuggestions } from '../../components/ai/AIDescriptionSuggestions';
import { AIContentSuggestions } from '../../components/ai/AIContentSuggestions';
import { apiService } from '../../../services/api-service';

interface CreateOutwardMailProps {
    onBack?: () => void;
}

export function CreateOutwardMail({ onBack }: CreateOutwardMailProps) {
    const [receiverName, setReceiverName] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [deliveryMode, setDeliveryMode] = useState('Courier');
    const [dueDate, setDueDate] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [cost, setCost] = useState('');

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
            // Fetch both inward and outward mails for duplicate detection
            const [inwardResponse, outwardResponse, deptResponse] = await Promise.all([
                apiService.getInwardMails(),
                apiService.getOutwardMails(),
                apiService.getDepartments()
            ]);

            const allMails = [
                ...(inwardResponse.data || []).map(mail => ({
                    subject: mail.subject,
                    description: mail.description,
                    recipient: mail.sender,
                    department: mail.department?.name,
                    priority: mail.priority
                })),
                ...(outwardResponse.data || []).map(mail => ({
                    subject: mail.subject,
                    description: mail.description,
                    recipient: mail.receiver,
                    department: mail.department?.name,
                    priority: mail.priority
                })),
                // Add test data for duplicate detection and AI suggestions
                {
                    subject: 'Meeting Schedule for Next Week',
                    description: 'This is regarding the meeting scheduled for next week',
                    recipient: 'John Doe',
                    department: 'Administration',
                    priority: 'High'
                },
                {
                    subject: 'Budget Approval Request',
                    description: 'Request for budget approval for Q4 projects',
                    recipient: 'Finance Department',
                    department: 'Finance',
                    priority: 'High'
                },
                {
                    subject: 'Policy Update Notification',
                    description: 'Notification regarding recent policy changes',
                    recipient: 'All Staff',
                    department: 'Administration',
                    priority: 'Normal'
                },
                {
                    subject: 'Training Schedule',
                    description: 'Employee training program schedule for next month',
                    recipient: 'HR Department',
                    department: 'Human Resources',
                    priority: 'Medium'
                }
            ];

            setExistingMails(allMails);
            setDepartments(deptResponse.data || []);
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
        // Check for duplicates when subject or receiver changes
        if (subject || receiverName) {
            checkForDuplicates();
        }
    }, [subject, receiverName]);

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
        // Check for duplicates and get content suggestions when receiver name or department changes
        if (receiverName || department) {
            checkForDuplicates();
            getContentSuggestions();
        }
    }, [receiverName, department]);

    const checkForDuplicates = async () => {
        const newMail = {
            subject,
            description,
            recipient: receiverName,
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

    const getDescriptionSuggestions = async () => {
        const suggestions = await aiService.getDescriptionSuggestions(subject);
        setDescriptionSuggestions(suggestions);
    };

    const getContentSuggestions = async () => {
        const currentMail = {
            subject,
            description,
            recipient: receiverName,
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
            case 'recipient':
                setReceiverName(suggestion);
                break;
            case 'priority':
                setPriority(suggestion);
                break;
        }
        setShowContentSuggestions(false);
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

        const mailData = {
            sentBy: 'System Admin',
            receiver: receiverName,
            receiverAddress: receiverAddress,
            subject: subject,
            details: description,
            department: department,
            priority: priority,
            deliveryMode: deliveryMode,
            date: new Date().toISOString().slice(0, 10),
            dueDate: dueDate,
            cost: cost,
            attachments: attachedFiles.map(file => ({
                filename: file.name,
                originalName: file.name,
                size: file.size,
                mimetype: file.type || 'application/octet-stream'
            }))
        };

        console.log('🚀 Starting outward mail submission...');
        console.log('Form data:', mailData);
        console.log('📤 Sending to API:', mailData);

        try {
            const response = await apiService.createOutwardMail(mailData);
            console.log('📥 API Response:', response);

            if (response.success) {
                console.log('✅ Outward mail saved successfully!');
                alert('Outward mail created successfully!');

                // Clear form fields
                setReceiverName('');
                setReceiverAddress('');
                setSubject('');
                setDescription('');
                setDepartment('');
                setPriority('Normal');
                setDeliveryMode('Courier');
                setDueDate('');
                setCost('');
                setAttachedFiles([]);

                if (onBack) {
                    onBack();
                }
            } else {
                console.log('❌ Failed to save outward mail:', response.message);
                alert('Failed to create outward mail: ' + response.message);
            }
        } catch (error) {
            console.error('💥 Error creating outward mail:', error);
            alert('Error creating outward mail. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={onBack} className="p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Create Outward Mail</h1>
                    <p className="text-gray-500 text-sm">Send new correspondence to external recipients</p>
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
                            <Send className="w-5 h-5" />
                            Recipient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="receiverName">Recipient Name *</Label>
                                <Input
                                    id="receiverName"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    placeholder="Enter recipient name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="department">Department *</Label>
                                <Select value={department} onValueChange={setDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="HR">Human Resources</SelectItem>
                                        <SelectItem value="Procurement">Procurement</SelectItem>
                                        <SelectItem value="Administration">Administration</SelectItem>
                                        <SelectItem value="IT">Information Technology</SelectItem>
                                        <SelectItem value="Legal">Legal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="receiverAddress">Recipient Address</Label>
                            <Textarea
                                id="receiverAddress"
                                value={receiverAddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                placeholder="Enter complete recipient address"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mail Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter mail subject"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description/Content</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter mail content or description"
                                rows={5}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Normal">Normal</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Important">Important</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="deliveryMode">Delivery Mode</Label>
                                <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Courier">Courier</SelectItem>
                                        <SelectItem value="Hand Delivery">Hand Delivery</SelectItem>
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="Post">Post</SelectItem>
                                        <SelectItem value="Fax">Fax</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="cost">Estimated Cost (₹)</Label>
                            <Input
                                id="cost"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" />
                            Attachments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
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
                                Browse Files
                            </Button>
                        </div>
                        {attachedFiles.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Attached Files:</p>
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
                        Send Outward Mail
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
