import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, Trash2, X } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Mail } from '../../App';

interface EditMailProps {
  mail: Mail;
  onBack: () => void;
}

export function EditMail({ mail, onBack }: EditMailProps) {
  const [formData, setFormData] = useState({
    relatedInward: '',
    department: mail.department || '',
    receiverName: mail.sender || mail.sentBy || '',
    receiverAddress: mail.address || '',
    subject: mail.subject || mail.details || '',
    description: mail.details || '',
    attachments: []
  });

  const [existingAttachments, setExistingAttachments] = useState([
    { name: 'Jaltara-Report (1).pdf', size: '5.9 KB' }
  ]);

  const isOutwardMail = mail.id?.startsWith('OUT');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      }));
      setExistingAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = () => {
    console.log('Updated mail:', formData);
    alert(`${isOutwardMail ? 'Outward' : 'Inward'} mail updated successfully!`);
    onBack();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="p-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit {isOutwardMail ? 'Outward' : 'Inward'} Mail
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Modify details and manage attachments for this {isOutwardMail ? 'outward' : 'inward'} file.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* Related Inward Section - Only for Outward Mails */}
          {isOutwardMail && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Related Inward (optional)
              </label>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search tracking or subject..."
                  className="h-10"
                />
                <Select value={formData.relatedInward} onValueChange={(value) => handleSelectChange('relatedInward', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- None --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- None --</SelectItem>
                    <SelectItem value="inw-001">INW-2024-001</SelectItem>
                    <SelectItem value="inw-002">INW-2024-002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Receiver Name / Sender Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isOutwardMail ? 'Receiver Name' : 'Sender Name'} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="h-10"
              />
            </div>
          </div>

          {/* Receiver Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isOutwardMail ? 'Receiver Address' : 'Sender Address'} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="receiverAddress"
              value={formData.receiverAddress}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              className="h-10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
          </div>

          {/* Add New Attachments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Attachments</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Drag & Drop files here</p>
              <p className="text-gray-500 text-sm">or</p>
              <Button className="mt-3 bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Existing Attachments */}
          {existingAttachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Existing Attachments</h3>
              <div className="space-y-3">
                {existingAttachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <span className="text-red-500 font-semibold text-sm">
                          {attachment.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveAttachment(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 mt-8"
          >
            Update {isOutwardMail ? 'Outward' : 'Inward'} Mail
          </Button>
        </div>
      </Card>
    </div>
  );
}
