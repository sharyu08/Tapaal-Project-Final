// Backup Service for Inward Mails
class BackupService {
    // Export inward mails data to JSON file
    async exportInwardMailsData(mails, filename = null) {
        try {
            // Create backup data with metadata
            const backupData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    exportType: 'inward_mails_backup',
                    totalRecords: mails.length,
                    version: '1.0'
                },
                data: mails.map(mail => ({
                    id: mail.id,
                    trackingId: mail.trackingId,
                    subject: mail.subject,
                    sender: mail.sender,
                    department: mail.department?.name || mail.department,
                    status: mail.status,
                    priority: mail.priority,
                    date: mail.date || mail.createdAt,
                    description: mail.description,
                    attachments: mail.attachments || [],
                    createdAt: mail.createdAt,
                    updatedAt: mail.updatedAt
                }))
            };

            // Generate filename if not provided
            const defaultFilename = `inward_mails_backup_${new Date().toISOString().split('T')[0]}.json`;
            const finalFilename = filename || defaultFilename;

            // Convert to JSON string
            const jsonString = JSON.stringify(backupData, null, 2);
            
            // Create blob and download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = finalFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            return {
                success: true,
                filename: finalFilename,
                message: `Successfully exported ${mails.length} inward mails to ${finalFilename}`
            };
        } catch (error) {
            console.error('Error exporting inward mails:', error);
            return {
                success: false,
                message: `Failed to export inward mails: ${error.message}`
            };
        }
    }

    // Import inward mails data from JSON file
    async importInwardMailsData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    
                    // Validate the imported data structure
                    if (!jsonData.data || !Array.isArray(jsonData.data)) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    resolve({
                        success: true,
                        data: jsonData.data,
                        metadata: jsonData.metadata,
                        message: `Successfully imported ${jsonData.data.length} inward mails`
                    });
                } catch (error) {
                    reject({
                        success: false,
                        message: `Failed to parse backup file: ${error.message}`
                    });
                }
            };
            
            reader.onerror = () => {
                reject({
                    success: false,
                    message: 'Failed to read the file'
                });
            };
            
            reader.readAsText(file);
        });
    }

    // Create a backup summary
    createBackupSummary(mails) {
        const statusCounts = mails.reduce((acc, mail) => {
            acc[mail.status] = (acc[mail.status] || 0) + 1;
            return acc;
        }, {});

        const priorityCounts = mails.reduce((acc, mail) => {
            acc[mail.priority] = (acc[mail.priority] || 0) + 1;
            return acc;
        }, {});

        const departmentCounts = mails.reduce((acc, mail) => {
            const dept = mail.department?.name || mail.department || 'Unknown';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        return {
            totalMails: mails.length,
            statusBreakdown: statusCounts,
            priorityBreakdown: priorityCounts,
            departmentBreakdown: departmentCounts,
            dateRange: {
                earliest: mails.length > 0 ? mails.reduce((earliest, mail) => 
                    new Date(mail.date || mail.createdAt) < new Date(earliest) ? mail.date || mail.createdAt : earliest
                ) : null,
                latest: mails.length > 0 ? mails.reduce((latest, mail) => 
                    new Date(mail.date || mail.createdAt) > new Date(latest) ? mail.date || mail.createdAt : latest
                ) : null
            }
        };
    }
}

export const backupService = new BackupService();
