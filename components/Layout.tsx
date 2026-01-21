
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  Users, 
  Megaphone, 
  FileText, 
  BrainCircuit, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Home,
  Zap,
  WifiOff,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types.ts';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MainLayout: React.FC<LayoutProps> = ({ children, role, onLogout, currentPath, onNavigate, isDarkMode, toggleDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { notifications, markNotificationRead, currentUser, preferences } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Filter notifications: Show if global (no recipientId) OR matches current user
  const personalizedNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter(n => !n.recipientId || n.recipientId === currentUser.id);
  }, [notifications, currentUser]);

  const unreadCount = personalizedNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
    { name: 'Savings Target', icon: Target, path: 'savings-target' },
    { name: 'Users', icon: Users, path: 'users' },
    { name: 'Announcements', icon: Megaphone, path: 'announcements' },
    { name: 'Reports', icon: FileText, path: 'reports' },
    { name: 'AI Insights', icon: BrainCircuit, path: 'ai-insights' },
    { name: 'Analytics', icon: BarChart3, path: 'analytics' },
    { name: 'Settings', icon: Settings, path: 'settings' },
  ];

  const userLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
    { name: 'Savings Target', icon: Target, path: 'savings-target' },
    { name: 'Reports', icon: FileText, path: 'reports' },
    { name: 'AI Insights', icon: BrainCircuit, path: 'ai-insights' },
    { name: 'Analytics', icon: BarChart3, path: 'analytics' },
    { name: 'Settings', icon: Settings, path: 'settings' },
  ];

  const bottomNavLinks = [
    { name: 'Home', icon: Home, path: 'dashboard' },
    { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
    { name: 'Insights', icon: Zap, path: 'ai-insights' },
    { name: 'Settings', icon: Settings, path: 'settings' },
  ];

  const links = role === UserRole.ADMIN ? adminLinks : userLinks;

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!currentUser) return null;

  const avatarSrc = currentUser.profileImage || AVATAR_SILHOUETTES[currentUser.gender || 'male'];

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-prospera-darkest text-white' : 'bg-gray-50 text-gray-900'}`}>
      <aside className={`hidden md:flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-56' : 'w-20'} ${isDarkMode ? 'bg-prospera-dark' : 'bg-white border-r border-gray-200'} sticky top-0 h-screen z-40 shadow-2xl shadow-black/10`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center shadow-lg shadow-prospera-accent/20">
                <Target className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-prospera-accent">Prospera</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-prospera-accent/20">
              <Target className="text-white w-5 h-5" />
            </div>
          )}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`flex items-center w-full p-2.5 rounded-xl transition-all ${
                currentPath === link.path 
                ? 'bg-prospera-accent text-white font-bold shadow-lg shadow-prospera-accent/20' 
                : isDarkMode ? 'hover:bg-prospera-accent/10 hover:text-prospera-accent text-gray-400' : 'hover:bg-prospera-accent/10 hover:text-prospera-accent text-gray-500'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <link.icon className="w-4.5 h-4.5" />
              {isSidebarOpen && <span className="ml-3 text-xs">{link.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700/10 border-gray-200">
          <button 
            onClick={onLogout}
            className={`flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-4.5 h-4.5" />
            {isSidebarOpen && <span className="ml-3 font-bold text-xs">Logout</span>}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`mt-4 w-full flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-prospera-accent transition-colors ${isDarkMode ? 'bg-prospera-darkest/50' : 'bg-gray-100'}`}
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-0">
        <header className={`sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 ${isDarkMode ? 'bg-prospera-darkest/80 backdrop-blur-md border-b border-white/5' : 'bg-white/80 backdrop-blur-md border-b border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 dark:text-white text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold dark:text-white text-gray-900">
                  {getGreeting()}, <span className="text-prospera-accent">{currentUser.name}</span>
                </h1>
                {role === UserRole.ADMIN && <ShieldCheck className="w-3.5 h-3.5 text-prospera-accent" />}
              </div>
              <p className="text-[8px] text-prospera-gray uppercase tracking-widest font-black">
                {role === UserRole.ADMIN ? 'Lead Founder' : 'Member'} • {preferences.groupName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {!isOnline && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
                <WifiOff className="w-2.5 h-2.5" />
                Offline
              </div>
            )}
            
            <button onClick={toggleDarkMode} className="p-1.5 rounded-full hover:bg-gray-700/20 transition-colors dark:text-white text-gray-900">
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-full hover:bg-gray-700/20 transition-colors relative dark:text-white text-gray-900"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 dark:border-prospera-darkest border-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 dark:bg-prospera-dark bg-white border dark:border-white/10 border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b dark:border-white/5 border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-xs dark:text-white text-gray-900">Notifications</h3>
                    <span className="text-[8px] bg-prospera-accent/20 text-prospera-accent px-1.5 py-0.5 rounded-full font-bold uppercase">{unreadCount} NEW</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar">
                    {personalizedNotifications.length > 0 ? (
                      personalizedNotifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 border-b dark:border-white/5 border-gray-50 cursor-pointer hover:bg-prospera-accent/5 transition-colors ${!n.read ? (isDarkMode ? 'bg-prospera-accent/5' : 'bg-gray-50') : ''}`}
                        >
                          <p className={`text-[11px] ${!n.read ? 'font-bold dark:text-white text-gray-900' : 'font-medium text-gray-400'}`}>{n.title}</p>
                          <p className="text-[10px] text-prospera-gray mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[8px] text-prospera-gray mt-1.5 font-bold uppercase">{n.date}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-prospera-gray text-xs">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-1 pl-1 sm:pl-3 border-l dark:border-white/10 border-gray-200">
              <img src={avatarSrc} alt="Avatar" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-prospera-accent shadow-lg object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-5 md:p-6 overflow-x-hidden pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {role === UserRole.USER && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around items-center p-2 border-t backdrop-blur-xl ${isDarkMode ? 'bg-prospera-darkest/90 border-white/5 shadow-2xl' : 'bg-white/90 border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'}`}>
          {bottomNavLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
                currentPath === link.path ? 'text-prospera-accent scale-105' : 'text-prospera-gray'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">{link.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainLayout;
