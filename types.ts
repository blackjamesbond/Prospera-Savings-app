
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
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
  rank: number;
  groupName?: string;
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
  lastUpdated?: number; // Timestamp of last change
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
}
