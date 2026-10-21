export type Role = 'user' | 'admin';

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: SessionUser;
}

export interface PublicStats {
  message: string;
  registeredUsers: number;
  serverTime: string;
}

export interface ProfileResponse {
  message: string;
  user: SessionUser;
  accountAgeDays: number;
}

export interface AdminMetrics {
  totalUsers: number;
  adminUsers: number;
  userUsers: number;
  uptimeSeconds: number;
  memoryRssMb: number;
  timestamp: string;
}

export interface AdminUsersResponse {
  users: SessionUser[];
}
