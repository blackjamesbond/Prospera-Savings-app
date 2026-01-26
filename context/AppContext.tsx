
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Transaction, SavingsTarget, Announcement, Notification, TransactionStatus, UserRole, UserStatus, Message } from '../types.ts';

export interface Group {
  id: string;
  name: string;
  currency: string;
  adminId: string;
  creationDate: string;
}

interface DashboardConfig {
  showAnalytics: boolean;
  showLogs: boolean;
  showTarget: boolean;
  showRecentTransactions: boolean;
  showQuickActions: boolean;
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
  fontSize: 'small' | 'medium' | 'large';
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
  dashboardConfig: DashboardConfig;
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
  messages: Message[];
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
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessagesRead: (senderId: string) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  requestReset: () => void;
  login: (email: string, role: UserRole, groupId: string, name?: string, groupOverride?: Group) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const STORAGE_KEY = 'prospera_v3_state';

const getInitialPreferences = (): AppPreferences => ({
  biometricsEnabled: true,
  notificationsEnabled: true,
  emailNotifications: true,
  twoFactorAuth: false,
  groupName: 'Prospera Vault',
  currency: 'KES',
  timezone: 'UTC+3',
  theme: 'dark',
  fontSize: 'medium',
  primaryColor: '#01C38D',
  appVersion: '3.1.0-stable',
  appPin: '1234',
  autoLockTimeout: 5,
  lockOnBlur: false,
  setupComplete: false,
  failedAttempts: 0,
  isBlocked: false,
  resetAuthorized: false,
  dashboardConfig: {
    showAnalytics: true,
    showLogs: true,
    showTarget: true,
    showRecentTransactions: true,
    showQuickActions: true
  }
});

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

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : [];
  });

  const [target, setTargetState] = useState<SavingsTarget>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_target`);
    return saved ? JSON.parse(saved) : {
      id: 't1', title: 'Target Not Set', targetAmount: 0, currentAmount: 0, deadline: '2025-12-31', motive: 'Define your first group goal.'
    };
  });

  const [preferences, setPreferences] = useState<AppPreferences>(getInitialPreferences());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_groups`, JSON.stringify(groups));
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
    localStorage.setItem(`${STORAGE_KEY}_target`, JSON.stringify(target));
    localStorage.setItem(`${STORAGE_KEY}_activeGroupId`, activeGroupId || '');
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
  }, [groups, users, transactions, messages, target, activeGroupId, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const savedPrefs = localStorage.getItem(`${STORAGE_KEY}_prefs_${currentUser.id}`);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      } else {
        const freshDefaults = getInitialPreferences();
        setPreferences({ ...freshDefaults, groupName: currentUser.groupName || 'Prospera Vault' });
      }
    } else {
      setPreferences(getInitialPreferences());
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_prefs_${currentUser.id}`, JSON.stringify(preferences));
    }
  }, [preferences, currentUser?.id]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    setNotifications(prev => [{ ...notif, id: Math.random().toString(36).substr(2, 9), date: 'Today', read: false }, ...prev]);
  }, []);

  const createGroup = (groupName: string, adminName: string, email: string, currency: string): Group => {
    const groupId = groupName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 4);
    const adminId = 'admin-' + Math.random().toString(36).substr(2, 5);
    const newGroup: Group = { id: groupId, name: groupName, currency, adminId, creationDate: new Date().toISOString() };
    const adminUser: User = { 
      id: adminId, 
      name: adminName, 
      email, 
      role: UserRole.ADMIN, 
      status: UserStatus.ACTIVE, 
      rank: 0, 
      groupName, 
      groupId, 
      totalContributed: 0, 
      gender: 'male' 
    };
    setGroups(prev => [...prev, newGroup]);
    setUsers(prev => [...prev, adminUser]);
    return newGroup;
  };

  const login = (email: string, role: UserRole, groupId: string, name?: string, groupOverride?: Group) => {
    const group = groups.find(g => g.id === groupId) || groupOverride;
    if (!group) return;

    const existingUser = users.find(u => u.email === email && u.groupId === groupId);
    
    if (!existingUser && !name && !groupOverride) {
      throw new Error("MEMBER_NOT_FOUND");
    }

    const userData: User = existingUser || {
      id: role === UserRole.ADMIN ? group.adminId : 'user-' + Math.random().toString(36).substr(2, 5),
      name: name || email.split('@')[0],
      email,
      role,
      status: role === UserRole.ADMIN ? UserStatus.ACTIVE : UserStatus.PENDING,
      rank: role === UserRole.ADMIN ? 0 : 1,
      groupName: group.name,
      groupId: group.id,
      totalContributed: 0,
      gender: 'male'
    };

    if (!existingUser) {
      setUsers(prev => [...prev, userData]);
      addNotification({ title: 'New Access Request', message: `${userData.name} is requesting ingress to the vault.`, type: 'info', recipientId: group.adminId });
    }
    
    setActiveGroupId(groupId);
    setCurrentUser(userData);
  };

  const logout = () => { setActiveGroupId(null); setCurrentUser(null); };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const activeGroup = groups.find(g => g.id === activeGroupId);
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTx, ...prev]);
    if (activeGroup) {
      addNotification({ title: 'Ledger Audit Required', message: `${tx.userName} uploaded a deposit for verification.`, type: 'warning', recipientId: activeGroup.adminId });
    }
    showToast('Ledger entry recorded.', 'success');
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMsg: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);
    
    if (msg.recipientId === 'ADMIN') {
      const group = groups.find(g => g.id === activeGroupId);
      if (group) {
        addNotification({
          title: 'Direct Message',
          message: `New message from ${msg.senderName}: "${msg.text.substring(0, 30)}..."`,
          type: 'info',
          recipientId: group.adminId
        });
      }
    }
  };

  const markMessagesRead = (senderId: string) => {
    setMessages(prev => prev.map(m => m.senderId === senderId ? { ...m, isRead: true } : m));
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus, notes?: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, adminNotes: notes } : t));
    addNotification({
      title: status === TransactionStatus.APPROVED ? 'Capital Verified' : 'Audit Rejected',
      message: status === TransactionStatus.APPROVED ? `Deposit of ${tx.currency} ${tx.amount.toLocaleString()} is now active.` : `Deposit rejected. Notes: ${notes}`,
      type: status === TransactionStatus.APPROVED ? 'success' : 'error',
      recipientId: tx.userId
    });
  };

  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, status } : null);
    addNotification({ title: 'Vault Access Update', message: `Your status has been updated to ${status}.`, type: status === UserStatus.ACTIVE ? 'success' : 'info', recipientId: id });
  };

  const setTarget = (newTarget: SavingsTarget) => {
    setTargetState({ ...newTarget, lastUpdated: Date.now() });
    addNotification({ title: 'Governance Update', message: `Goal adjusted: ${newTarget.title}. Target: ${preferences.currency} ${newTarget.targetAmount.toLocaleString()}`, type: 'info' });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => setAnnouncements(prev => [{ ...ann, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  const updateUser = (id: string, updates: Partial<User>) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  const updateCurrentUser = (updates: Partial<User>) => { if (currentUser) { const newUser = { ...currentUser, ...updates }; setCurrentUser(newUser); updateUser(currentUser.id, updates); showToast('Dossier updated.', 'success'); } };
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const updatePreferences = (updates: Partial<AppPreferences>) => setPreferences(prev => ({ ...prev, ...updates }));
  const requestReset = () => showToast('Request sent.', 'success');

  return (
    <AppContext.Provider value={{ 
      groups, activeGroupId, users, currentUser, transactions, messages, target, announcements, notifications, preferences, toast,
      createGroup, setActiveGroup: setActiveGroupId, setTarget, addTransaction, updateTransaction, 
      updateTransactionStatus, deleteTransaction, addAnnouncement, updateUser, updateUserStatus, updateCurrentUser, 
      deleteUser, addNotification, markNotificationRead, sendMessage, markMessagesRead, updatePreferences, showToast, requestReset, login, logout
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
