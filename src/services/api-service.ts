// Real API service for connecting to backend
const API_BASE_URL = (window as any).VITE_API_URL || import.meta.env.VITE_API_URL || 'https://tapaal-backend.vercel.app/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalDepartments: number;
  totalMails: number;
  totalTrackingEvents: number;
  totalInwardMails: number;
  totalOutwardMails: number;
  pendingMails: number;
  assignedMails: number;
  registeredMails: number;
}

export interface DashboardData {
  stats: DashboardStats;
  statusData: Array<{ name: string; value: number; color: string }>;
  monthlyData: Array<{ name: string; inward: number; outward: number }>;
  recentMails: Array<{
    id: string;
    subject: string;
    senderName: string;
    status: string;
    department: string;
    priority: string;
    type: 'INWARD' | 'OUTWARD';
  }>;
}

export interface DashboardResponse {
  stats: DashboardStats;
  realData: DashboardData;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      // Return mock data for dashboard when API is not available
      if (endpoint === '/dashboard/stats') {
        const mockData: DashboardResponse = {
          stats: {
            totalUsers: 0,
            totalDepartments: 0,
            totalMails: 0,
            totalTrackingEvents: 0,
            totalInwardMails: 0,
            totalOutwardMails: 0,
            pendingMails: 0,
            assignedMails: 0,
            registeredMails: 0,
          },
          realData: {
            stats: {
              totalUsers: 0,
              totalDepartments: 0,
              totalMails: 0,
              totalTrackingEvents: 0,
              totalInwardMails: 0,
              totalOutwardMails: 0,
              pendingMails: 0,
              assignedMails: 0,
              registeredMails: 0,
            },
            statusData: [],
            monthlyData: [],
            recentMails: []
          }
        };
        return {
          success: true,
          data: mockData
        } as ApiResponse<T>;
      }
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardResponse>> {
    return this.request<DashboardResponse>('/dashboard/stats');
  }

  // Department APIs
  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/departments');
  }

  async createDepartment(department: any): Promise<ApiResponse<any>> {
    return this.request<any>('/departments', {
      method: 'POST',
      body: JSON.stringify(department),
    });
  }

  async updateDepartment(id: string, department: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(department),
    });
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Inward Mail APIs
  async getInwardMails(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
    status?: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/inward-mails${queryString ? `?${queryString}` : ''}`);
  }

  async getInwardMail(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/inward-mails/${id}`);
  }

  async createInwardMail(mailData: FormData): Promise<ApiResponse<any>> {
    return this.request<any>('/inward-mails', {
      method: 'POST',
      body: mailData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async updateInwardMail(id: string, mailData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/inward-mails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mailData),
    });
  }

  async deleteInwardMail(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/inward-mails/${id}`, {
      method: 'DELETE',
    });
  }

  // Outward Mail APIs
  async getOutwardMails(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
    status?: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/outward-mails${queryString ? `?${queryString}` : ''}`);
  }

  async createOutwardMail(mailData: FormData): Promise<ApiResponse<any>> {
    return this.request<any>('/outward-mails', {
      method: 'POST',
      body: mailData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async updateOutwardMail(id: string, mailData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/outward-mails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mailData),
    });
  }

  async deleteOutwardMail(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/outward-mails/${id}`, {
      method: 'DELETE',
    });
  }

  // User APIs
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/users');
  }

  async getUser(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
