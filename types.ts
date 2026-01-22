
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DEACTIVATED = 'DEACTIVATED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  rank: number;
  groupName?: string;
  groupId?: string; // Strictly track which circle the user belongs to
  totalContributed: number;
  profileImage?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: TransactionStatus;
  accountNumber?: string;
  rawMessage?: string;
  adminNotes?: string;
}

export interface SavingsTarget {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  motive: string;
  lastUpdated?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
  recipientId?: string;
}
