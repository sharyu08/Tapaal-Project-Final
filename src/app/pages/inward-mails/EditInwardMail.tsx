import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '../../components/ui';
import { ArrowLeft, Save, UploadCloud, Calendar, User, Building } from 'lucide-react';
import { inwardMailService } from '../../../services/inward-mail-service';

interface EditInwardMailProps {
  mailId: string;
  onBack: () => void;
  onSave: () => void;
}

export function EditInwardMail({ mailId, onBack, onSave }: EditInwardMailProps) {
  const [mail, setMail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [receivedDate, setReceivedDate] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [status, setStatus] = useState('pending');
  const [deliveryMode, setDeliveryMode] = useState('Courier');

  useEffect(() => {
    fetchMailDetail();
  }, [mailId]);

  const fetchMailDetail = async () => {
    try {
      setLoading(true);
      const response = await inwardMailService.getInwardMail(mailId);
      
      if (response.success) {
        const mailData = response.data;
        setMail(mailData);
        
        // Populate form fields
        setSenderName(mailData.sender || '');
        setSubject(mailData.details || '');
        setDescription(mailData.details || '');
        setDepartment(mailData.department || '');
        setPriority(mailData.priority || 'Normal');
        setReceivedDate(mailData.date || '');
        setReferenceNumber(mailData.referenceDetails || '');
        setStatus(mailData.status || 'pending');
        setDeliveryMode(mailData.deliveryMode || 'Courier');
        
        setError('');
      } else {
        setError('Failed to fetch mail details');
      }
    } catch (err) {
      setError('Error fetching mail details');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError('');

    try {
      const mailData = {
        sender: senderName,
        deliveryMode: deliveryMode,
        details: description,
        referenceDetails: referenceNumber,
        priority: priority,
        department: department,
        status: status,
        date: receivedDate || new Date().toISOString().slice(0, 10)
      };

      console.log('📤 Updating mail:', mailData);

      const response = await inwardMailService.updateInwardMail(mailId, mailData);

      console.log('📥 Update Response:', response);

      if (response.success) {
        console.log('✅ Mail updated successfully!');
        alert('Inward mail updated successfully!');
        onSave();
      } else {
        console.log('❌ Update failed:', response.message);
        setError('Failed to update inward mail: ' + response.message);
      }
    } catch (error) {
      console.error('💥 Error updating inward mail:', error);
      setError('Failed to update inward mail. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !mail) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <Button onClick={fetchMailDetail} className="mt-4">
            Retry
          </Button>
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
          <h1 className="text-2xl font-semibold text-gray-800">Edit Inward Mail</h1>
          <p className="text-gray-500 text-sm">Update mail information and status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Sender Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderName">Sender Name *</Label>
                <Input
                  id="senderName"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender name"
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
              <Label htmlFor="senderAddress">Sender Address</Label>
              <Textarea
                id="senderAddress"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="Enter complete sender address"
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
              <Label htmlFor="subject">Subject/Details *</Label>
              <Textarea
                id="subject"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter mail subject or details"
                rows={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter reference number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Important">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                    <SelectItem value="Post">Post</SelectItem>
                    <SelectItem value="Hand Delivery">Hand Delivery</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Fax">Fax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="receivedDate">Received Date</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5" />
              Attachments (Optional)
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
                <p className="text-sm font-medium text-gray-700 mb-2">New Attachments:</p>
                <ul className="space-y-1">
                  {attachedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mail && mail.attachments && mail.attachments.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Existing Attachments:</p>
                <ul className="space-y-1">
                  {mail.attachments.map((attachment: any, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {attachment.originalName || attachment.filename}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
