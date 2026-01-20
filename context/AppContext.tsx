
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Transaction, SavingsTarget, Announcement, Notification, TransactionStatus, UserRole } from '../types.ts';

export interface Group {
  id: string;
  name: string;
  currency: string;
  adminId: string;
  creationDate: string;
}

interface AppPreferences {
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  groupName: string;
  currency: string;
  timezone: string;
  theme: 'dark' | 'light';
  primaryColor: string;
  developerImage?: string;
  appVersion: string;
  appPin: string;
  autoLockTimeout: number;
  lockOnBlur: boolean;
  setupComplete: boolean;
  failedAttempts: number;
  isBlocked: boolean;
  resetAuthorized: boolean;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface AppContextType {
  groups: Group[];
  activeGroupId: string | null;
  users: User[];
  currentUser: User | null;
  transactions: Transaction[];
  target: SavingsTarget;
  announcements: Announcement[];
  notifications: Notification[];
  preferences: AppPreferences;
  toast: ToastState;
  createGroup: (groupName: string, adminName: string, email: string, currency: string) => Group;
  setActiveGroup: (id: string) => void;
  setTarget: (target: SavingsTarget) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus, notes?: string) => void;
  deleteTransaction: (id: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  requestReset: () => void;
  login: (email: string, role: UserRole, groupId: string, name?: string, groupOverride?: Group) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const STORAGE_KEY = 'prospera_v3_state';

const defaultPreferences: AppPreferences = {
  biometricsEnabled: true,
  notificationsEnabled: true,
  emailNotifications: true,
  twoFactorAuth: false,
  groupName: 'Prospera Vault',
  currency: 'KES',
  timezone: 'UTC+3',
  theme: 'dark',
  primaryColor: '#01C38D',
  appVersion: '3.1.0-stable',
  appPin: '1234',
  autoLockTimeout: 5,
  lockOnBlur: false,
  setupComplete: false,
  failedAttempts: 0,
  isBlocked: false,
  resetAuthorized: false
};

export const AVATAR_SILHOUETTES = {
  male: "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=f1f5f9",
  female: "https://api.dicebear.com/7.x/micah/svg?seed=Bella&backgroundColor=f1f5f9",
  other: "https://api.dicebear.com/7.x/micah/svg?seed=Other&backgroundColor=f1f5f9"
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_groups`);
    return saved ? JSON.parse(saved) : [
      { id: 'elite-savers', name: 'Elite Savers', currency: 'KES', adminId: 'admin-1', creationDate: '2024-01-01' }
    ];
  });

  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_activeGroupId`);
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : [];
  });

  const [target, setTargetState] = useState<SavingsTarget>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_target`);
    return saved ? JSON.parse(saved) : {
      id: 't1', title: 'Target Not Set', targetAmount: 0, currentAmount: 0, deadline: '2025-12-31', motive: 'Define your first group goal in the Savings Target tab.'
    };
  });

  const [preferences, setPreferences] = useState<AppPreferences>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_preferences`);
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_groups`, JSON.stringify(groups));
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${STORAGE_KEY}_target`, JSON.stringify(target));
    localStorage.setItem(`${STORAGE_KEY}_activeGroupId`, activeGroupId || '');
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_preferences`, JSON.stringify(preferences));
  }, [groups, users, transactions, target, activeGroupId, currentUser, preferences]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  const createGroup = (groupName: string, adminName: string, email: string, currency: string): Group => {
    const groupId = groupName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 4);
    const adminId = 'admin-' + Math.random().toString(36).substr(2, 5);
    
    const newGroup: Group = {
      id: groupId,
      name: groupName,
      currency,
      adminId,
      creationDate: new Date().toISOString()
    };

    const adminUser: User = {
      id: adminId,
      name: adminName,
      email,
      role: UserRole.ADMIN,
      rank: 0,
      groupName,
      totalContributed: 0,
      gender: 'male'
    };

    setGroups(prev => [...prev, newGroup]);
    setUsers(prev => [...prev, adminUser]);
    showToast(`${groupName} successfully registered!`, 'success');
    return newGroup;
  };

  const login = (email: string, role: UserRole, groupId: string, name?: string, groupOverride?: Group) => {
    // Check state first, then fallback to override for race-condition mitigation
    const group = groups.find(g => g.id === groupId) || groupOverride;
    
    if (!group) {
      showToast('Vault authentication failed. Group not found.', 'error');
      return;
    }

    setActiveGroupId(groupId);
    
    // Find if user already exists, or create a new one
    const existingUser = users.find(u => u.email === email);
    const userData: User = existingUser || {
      id: role === UserRole.ADMIN ? group.adminId : 'user-' + Math.random().toString(36).substr(2, 5),
      name: name || email.split('@')[0],
      email,
      role,
      rank: role === UserRole.ADMIN ? 0 : 1,
      groupName: group.name,
      totalContributed: 0,
      gender: 'male'
    };

    if (!existingUser) {
      setUsers(prev => [...prev, userData]);
    }

    setCurrentUser(userData);
    setPreferences(prev => ({ 
      ...prev, 
      currency: group.currency, 
      groupName: group.name,
      setupComplete: true 
    }));
  };

  const logout = () => {
    setActiveGroupId(null);
    setCurrentUser(null);
    localStorage.removeItem(`${STORAGE_KEY}_activeGroupId`);
    localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...tx, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
    showToast('Ledger entry recorded.', 'success');
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus, notes?: string) => {
    updateTransaction(id, { status, adminNotes: notes });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const setTarget = (newTarget: SavingsTarget) => {
    setTargetState({ ...newTarget, lastUpdated: Date.now() });
    showToast('Circle goals updated.', 'success');
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    setAnnouncements(prev => [{ ...ann, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updates };
      setCurrentUser(newUser);
      updateUser(currentUser.id, updates);
      showToast('Dossier updated.', 'success');
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    setNotifications(prev => [{ ...notif, id: Math.random().toString(36).substr(2, 9), date: 'Today', read: false }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updatePreferences = (updates: Partial<AppPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const requestReset = () => {
    showToast('Request sent successfully', 'success');
  };

  return (
    <AppContext.Provider value={{ 
      groups, activeGroupId, users, currentUser, transactions, target, announcements, notifications, preferences, toast,
      createGroup, setActiveGroup: setActiveGroupId, setTarget, addTransaction, updateTransaction, 
      updateTransactionStatus, deleteTransaction, addAnnouncement, updateUser, updateCurrentUser, 
      deleteUser, addNotification, markNotificationRead, updatePreferences, showToast, requestReset, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
