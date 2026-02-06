import { apiService } from './api-service';

class OutwardMailService {
  // Get all outward mails with optional filters
  async getOutwardMails(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await apiService.get(`/outward-mails?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching outward mails:', error);
      throw error;
    }
  }

  // Get single outward mail by ID
  async getOutwardMail(mailId: string) {
    try {
      const response = await apiService.get(`/outward-mails/${mailId}`);
      return response;
    } catch (error) {
      console.error('Error fetching outward mail:', error);
      throw error;
    }
  }

  // Create new outward mail
  async createOutwardMail(mailData: any, files: File[] = []) {
    try {
      console.log('🚀 Creating outward mail with data:', mailData);
      console.log('📁 Files to upload:', files.length);

      // If files are present, use FormData
      if (files.length > 0) {
        const formData = new FormData();

        // Add mail data to FormData
        Object.keys(mailData).forEach(key => {
          formData.append(key, mailData[key]);
        });

        // Add files to FormData
        files.forEach((file, index) => {
          formData.append(`attachments`, file);
        });

        console.log('📤 Sending FormData to API...');
        const response = await apiService.uploadFile('/outward-mails', formData);
        return response;
      } else {
        // No files, send as JSON
        console.log('📤 Sending JSON to API...');
        const response = await apiService.post('/outward-mails', mailData);
        return response;
      }
    } catch (error) {
      console.error('Error creating outward mail:', error);
      throw error;
    }
  }

  // Update outward mail
  async updateOutwardMail(mailId: string, mailData: any, files: File[] = []) {
    try {
      console.log('🚀 Updating outward mail with data:', mailData);
      console.log('📁 Files to upload:', files.length);

      // If files are present, use FormData
      if (files.length > 0) {
        const formData = new FormData();

        // Add mail data to FormData
        Object.keys(mailData).forEach(key => {
          formData.append(key, mailData[key]);
        });

        // Add files to FormData
        files.forEach((file, index) => {
          formData.append(`attachments`, file);
        });

        console.log('📤 Sending FormData to API...');
        const response = await apiService.uploadFile(`/outward-mails/${mailId}`, formData);
        return response;
      } else {
        // No files, send as JSON
        console.log('📤 Sending JSON to API...');
        const response = await apiService.put(`/outward-mails/${mailId}`, mailData);
        return response;
      }
    } catch (error) {
      console.error('Error updating outward mail:', error);
      throw error;
    }
  }

  // Delete outward mail
  async deleteOutwardMail(mailId: string) {
    try {
      console.log('🗑️ Deleting outward mail:', mailId);
      const response = await apiService.delete(`/outward-mails/${mailId}`);
      return response;
    } catch (error) {
      console.error('Error deleting outward mail:', error);
      throw error;
    }
  }

  // Get outward mail statistics
  async getOutwardMailStats() {
    try {
      const response = await apiService.get('/outward-mails/stats');
      return response;
    } catch (error) {
      console.error('Error fetching outward mail stats:', error);
      throw error;
    }
  }

  // Generate file download URL
  getFileUrl(filename: string, type: string = 'outward') {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/uploads/${type}/${filename}`;
  }

  // Export outward mails to Excel/CSV
  async exportOutwardMails(format = 'excel', filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await apiService.get(`/outward-mails/export?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error exporting outward mails:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateOutwardMails(mailIds: string[], updateData: any) {
    try {
      const response = await apiService.post('/outward-mails/bulk-update', {
        mailIds,
        updateData
      });
      return response;
    } catch (error) {
      console.error('Error bulk updating outward mails:', error);
      throw error;
    }
  }

  async bulkDeleteOutwardMails(mailIds: string[]) {
    try {
      const response = await apiService.post('/outward-mails/bulk-delete', {
        mailIds
      });
      return response;
    } catch (error) {
      console.error('Error bulk deleting outward mails:', error);
      throw error;
    }
  }
}

export const outwardMailService = new OutwardMailService();
