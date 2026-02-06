import React, { useState } from 'react';
import { ArrowLeft, Eye, Trash2, Upload, FileIcon } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Mail } from '../../App';

interface MailDetailProps {
  mail: Mail;
  onBack: () => void;
}

export function MailDetail({ mail, onBack }: MailDetailProps) {
  const [attachments, setAttachments] = useState([
    { name: 'TAN.jpeg', size: '82.8 KB' }
  ]);

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'closed': 'bg-green-100 text-green-700',
      'delivered': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Extract sender information based on mail type
  const getSenderInfo = () => {
    return {
      name: mail.sender || mail.sentBy || 'Unknown',
      address: mail.address || 'Not specified',
      department: mail.department || 'General',
      registeredBy: mail.registeredBy || 'System'
    };
  };

  const senderInfo = getSenderInfo();

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mail.id}</h1>
            <p className="text-gray-500 text-sm mt-1">Created: {mail.createdAt || mail.date || new Date().toLocaleString()}</p>
          </div>
        </div>
        <Badge className={getStatusBadgeColor(mail.status)}>
          {mail.status}
        </Badge>
      </div>

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            👤 Assign / Forward
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            ⚙️ Change Status
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            🔄 Reopen File
          </Button>
        </div>
      </Card>

      {/* Details Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
              📧 {mail.subject || mail.details || 'No subject'}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Sender</label>
            <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
              👤 {senderInfo.name}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
              📍 {senderInfo.address}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Department</label>
            <div className="text-gray-900 font-medium mt-1">
              {senderInfo.department}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Priority</label>
            <div className="text-gray-900 font-medium mt-1">
              {mail.priority || 'Normal'}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Registered By</label>
            <div className="text-gray-900 font-medium mt-1">
              {senderInfo.registeredBy}
            </div>
          </div>
        </div>
      </Card>

      {/* Movement History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Movement History</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1 pb-4">
              <p className="font-semibold text-gray-900">
                📧 {mail.id} Created
              </p>
              <p className="text-sm text-gray-600 mt-1">Action: Created</p>
              <p className="text-sm text-gray-600">Remarks: Mail entry created in system</p>
              <p className="text-xs text-gray-400 mt-2">📅 {mail.createdAt || mail.date || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Attachments */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">📎</span>
          <h2 className="text-xl font-bold text-gray-900">Attachments</h2>
        </div>
        
        <Button variant="outline" className="w-full h-12 mb-4 text-gray-700 border-2 border-dashed">
          <Upload className="w-4 h-4 mr-2" />
          Upload Attachment
        </Button>

        <div className="space-y-3">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
