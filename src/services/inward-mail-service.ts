import { apiService, ApiResponse } from './api-service';

export class InwardMailService {
  // Get all inward mails with pagination and filters
  async getInwardMails(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
    status?: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    return apiService.getInwardMails(params);
  }

  // Get single inward mail by ID
  async getInwardMail(id: string): Promise<ApiResponse<any>> {
    return apiService.getInwardMail(id);
  }

  // Create new inward mail with file attachments
  async createInwardMail(mailData: FormData): Promise<ApiResponse<any>> {
    return apiService.createInwardMail(mailData);
  }

  // Update inward mail
  async updateInwardMail(id: string, mailData: any): Promise<ApiResponse<any>> {
    return apiService.updateInwardMail(id, mailData);
  }

  // Delete inward mail
  async deleteInwardMail(id: string): Promise<ApiResponse<void>> {
    return apiService.deleteInwardMail(id);
  }

  // Get inward mail statistics
  async getInwardMailStats(): Promise<ApiResponse<any>> {
    return apiService.getInwardMails(); // This is a temporary fix - need to add stats method
  }

  // Get file download URL
  getFileUrl(filename: string, type: string = 'inward'): string {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/uploads/${type}/${filename}`;
  }
}

export const inwardMailService = new InwardMailService();
