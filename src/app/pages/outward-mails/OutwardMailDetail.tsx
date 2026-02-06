import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { ArrowLeft, Edit, Trash2, Download, Eye, Calendar, User, Building, Tag, FileText, MapPin, DollarSign } from 'lucide-react';
import { outwardMailService } from '../../../services/outward-mail-service';

interface OutwardMailDetailProps {
  mailId: string;
  onBack: () => void;
  onEdit: (mailId: string) => void;
}

export function OutwardMailDetail({ mailId, onBack, onEdit }: OutwardMailDetailProps) {
  const [mail, setMail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMailDetail();
  }, [mailId]);

  const fetchMailDetail = async () => {
    try {
      setLoading(true);
      const response = await outwardMailService.getOutwardMail(mailId);
      
      if (response.success) {
        setMail(response.data);
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this mail?')) {
      return;
    }

    try {
      const response = await outwardMailService.deleteOutwardMail(mailId);
      
      if (response.success) {
        alert('Mail deleted successfully!');
        onBack();
      } else {
        alert('Failed to delete mail');
      }
    } catch (err) {
      alert('Error deleting mail');
    }
  };

  const handleDownloadAttachment = (attachment: any) => {
    // Create download link for attachment
    const link = document.createElement('a');
    link.href = outwardMailService.getFileUrl(attachment.filename, 'outward');
    link.download = attachment.originalName;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      waiting: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      sent: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      Low: 'bg-gray-100 text-gray-800',
      Normal: 'bg-blue-100 text-blue-800',
      Medium: 'bg-orange-100 text-orange-800',
      High: 'bg-red-100 text-red-800',
      Important: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority}
      </span>
    );
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

  if (error) {
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

  if (!mail) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <p>Mail not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Outward Mail Details</h1>
            <p className="text-gray-500 text-sm">ID: {mail.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(mailId)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Mail Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Subject</h3>
                <p className="text-gray-600">{mail.subject}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Details</h3>
                <p className="text-gray-600">{mail.details}</p>
              </div>
              
              {mail.referenceDetails && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Reference Details</h3>
                  <p className="text-gray-600">{mail.referenceDetails}</p>
                </div>
              )}

              {mail.attachments && mail.attachments.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {mail.attachments.map((attachment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{attachment.originalName}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAttachment(attachment)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Sent By</p>
                  <p className="font-medium">{mail.sentBy}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Receiver</p>
                  <p className="font-medium">{mail.receiver}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Receiver Address</p>
                  <p className="font-medium text-sm">{mail.receiverAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{mail.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{mail.dueDate || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{mail.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Mode</p>
                  <p className="font-medium">{mail.deliveryMode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Cost</p>
                  <p className="font-medium">${mail.cost || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                {getStatusBadge(mail.status)}
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Priority</p>
                {getPriorityBadge(mail.priority)}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Tracking ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{mail.trackingId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
