import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '../../components/ui';
import { ArrowLeft, Save, UploadCloud, Calendar, User, Building, MapPin, DollarSign, Globe } from 'lucide-react';
import { apiService } from '../../../services/api-service';

interface CreateOutwardMailProps {
  onBack: () => void;
  onRefresh?: () => void; // Add refresh callback
}

export function CreateOutwardMail({ onBack, onRefresh }: CreateOutwardMailProps) {
  const { t, i18n } = useTranslation();

  // Form state
  const [sentBy, setSentBy] = useState('');
  const [receiver, setReceiver] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [sentDate, setSentDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('Courier');
  const [cost, setCost] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    if (!sentBy.trim()) {
      alert(t('createOutwardMail.validation.sentByRequired'));
      return;
    }

    if (!receiver.trim()) {
      alert(t('createOutwardMail.validation.receiverRequired'));
      return;
    }

    if (!receiverAddress.trim()) {
      alert(t('createOutwardMail.validation.receiverAddressRequired'));
      return;
    }

    if (!subject.trim()) {
      alert(t('createOutwardMail.validation.subjectRequired'));
      return;
    }

    if (!details.trim()) {
      alert(t('createOutwardMail.validation.detailsRequired'));
      return;
    }

    if (!department) {
      alert(t('createOutwardMail.validation.departmentRequired'));
      return;
    }

    console.log('🚀 Starting outward mail submission...');
    console.log('Form data:', {
      sentBy,
      receiver,
      receiverAddress,
      subject,
      details,
      department,
      priority,
      sentDate,
      dueDate,
      referenceNumber,
      deliveryMode,
      cost,
      attachedFiles
    });

    try {
      // Create JSON data for serverless environment
      const mailData = {
        sentBy: sentBy,
        receiver: receiver,
        receiverAddress: receiverAddress,
        subject: subject,
        details: details,
        referenceDetails: referenceNumber,
        priority: priority,
        department: department,
        status: 'pending',
        deliveryMode: deliveryMode,
        date: sentDate || new Date().toISOString().slice(0, 10),
        dueDate: dueDate,
        cost: parseFloat(cost) || 0,
        attachments: attachedFiles.map(file => ({
          filename: file.name,
          originalName: file.name,
          size: file.size,
          mimetype: file.type || 'application/octet-stream'
        }))
      };

      console.log('📤 Sending to API:', mailData);

      const response = await apiService.createOutwardMail(mailData);

      console.log('📥 API Response:', response);

      if (response.success) {
        console.log('✅ Mail saved successfully!');
        alert(t('createOutwardMail.success'));
        // Clear form fields
        setSentBy('');
        setReceiver('');
        setReceiverAddress('');
        setSubject('');
        setDetails('');
        setDepartment('');
        setPriority('Normal');
        setSentDate('');
        setDueDate('');
        setReferenceNumber('');
        setDeliveryMode('Courier');
        setCost('');
        setAttachedFiles([]);

        // Trigger parent refresh
        onBack?.();
        onRefresh?.(); // Trigger table refresh
      } else {
        console.log('❌ API returned error:', response.message);
        alert(t('createOutwardMail.error') + ': ' + response.message);
      }
    } catch (error) {
      console.error('💥 Error creating outward mail:', error);
      alert(t('createOutwardMail.error'));
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
            <h1 className="text-2xl font-semibold text-gray-800">{t('createOutwardMail.title')}</h1>
            <p className="text-gray-500 text-sm">{t('createOutwardMail.subtitle')}</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('createOutwardMail.senderReceiverInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sentBy">{t('createOutwardMail.sentBy')} {t('createOutwardMail.required')}</Label>
                <Input
                  id="sentBy"
                  value={sentBy}
                  onChange={(e) => setSentBy(e.target.value)}
                  placeholder={t('createOutwardMail.sentByPlaceholder')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="receiver">{t('createOutwardMail.receiver')} {t('createOutwardMail.required')}</Label>
                <Input
                  id="receiver"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder={t('createOutwardMail.receiverPlaceholder')}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="receiverAddress">{t('createOutwardMail.receiverAddress')}</Label>
              <Textarea
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder={t('createOutwardMail.receiverAddressPlaceholder')}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">{t('createOutwardMail.department')} {t('createOutwardMail.required')}</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('createOutwardMail.selectDepartment')} />
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
              <div>
                <Label htmlFor="deliveryMode">{t('createOutwardMail.deliveryMode')}</Label>
                <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Courier">{t('createOutwardMail.deliveryModes.courier')}</SelectItem>
                    <SelectItem value="Post">{t('createOutwardMail.deliveryModes.post')}</SelectItem>
                    <SelectItem value="Hand Delivery">{t('createOutwardMail.deliveryModes.handDelivery')}</SelectItem>
                    <SelectItem value="Email">{t('createOutwardMail.deliveryModes.email')}</SelectItem>
                    <SelectItem value="Registered Post">{t('createOutwardMail.deliveryModes.registeredPost')}</SelectItem>
                    <SelectItem value="Speed Post">{t('createOutwardMail.deliveryModes.speedPost')}</SelectItem>
                    <SelectItem value="Fax">{t('createOutwardMail.deliveryModes.fax')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('createOutwardMail.mailDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">{t('createOutwardMail.subject')} {t('createOutwardMail.required')}</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('createOutwardMail.subjectPlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="details">{t('createOutwardMail.details')} {t('createOutwardMail.required')}</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('createOutwardMail.detailsPlaceholder')}
                rows={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="referenceNumber">{t('createOutwardMail.referenceNumber')}</Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={t('createOutwardMail.referenceNumberPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="priority">{t('createOutwardMail.priority')}</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">{t('createOutwardMail.low')}</SelectItem>
                    <SelectItem value="Normal">{t('createOutwardMail.normal')}</SelectItem>
                    <SelectItem value="Medium">{t('createOutwardMail.medium')}</SelectItem>
                    <SelectItem value="High">{t('createOutwardMail.high')}</SelectItem>
                    <SelectItem value="Important">{t('createOutwardMail.important')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sentDate">{t('createOutwardMail.sentDate')}</Label>
                <Input
                  id="sentDate"
                  type="date"
                  value={sentDate}
                  onChange={(e) => setSentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">{t('createOutwardMail.dueDate')}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cost">{t('createOutwardMail.cost')}</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5" />
              {t('createOutwardMail.attachments')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">{t('createOutwardMail.dragDropText')}</p>
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
                {t('createOutwardMail.browseFiles')}
              </Button>
            </div>
            {attachedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{t('createOutwardMail.attachedFiles')}</p>
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
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {t('createOutwardMail.saveOutwardMail')}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
