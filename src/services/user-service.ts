import { apiService, ApiResponse } from './api-service';

export class UserService {
  // Get all users
  async getUsers(): Promise<ApiResponse<any>> {
    return apiService.getUsers();
  }

  // Get single user by ID
  async getUser(id: string): Promise<ApiResponse<any>> {
    return apiService.getUser(id);
  }

  // Create new user
  async createUser(userData: any): Promise<ApiResponse<any>> {
    return apiService.createUser(userData);
  }

  // Update user
  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return apiService.updateUser(id, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.deleteUser(id);
  }
}

export const userService = new UserService();
