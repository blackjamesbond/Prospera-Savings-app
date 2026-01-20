
import React, { useState, useEffect } from 'react';
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
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

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

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (!currentUser) return null;

  const avatarSrc = currentUser.profileImage || AVATAR_SILHOUETTES[currentUser.gender || 'male'];

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-prospera-darkest text-white' : 'bg-gray-50 text-gray-900'}`}>
      <aside className={`hidden md:flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'bg-prospera-dark' : 'bg-white border-r border-gray-200'} sticky top-0 h-screen z-40 shadow-2xl shadow-black/10`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center shadow-lg shadow-prospera-accent/20">
                <Target className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-prospera-accent">Prospera</span>
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
              className={`flex items-center w-full p-3 rounded-xl transition-all ${
                currentPath === link.path 
                ? 'bg-prospera-accent text-white font-bold shadow-lg shadow-prospera-accent/20' 
                : isDarkMode ? 'hover:bg-prospera-accent/10 hover:text-prospera-accent text-gray-400' : 'hover:bg-prospera-accent/10 hover:text-prospera-accent text-gray-500'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <link.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3 text-sm">{link.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700/10 border-gray-200">
          <button 
            onClick={onLogout}
            className={`flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 font-bold text-sm">Logout</span>}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`mt-4 w-full flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-prospera-accent transition-colors ${isDarkMode ? 'bg-prospera-darkest/50' : 'bg-gray-100'}`}
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-0">
        <header className={`sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 ${isDarkMode ? 'bg-prospera-darkest/80 backdrop-blur-md border-b border-white/5' : 'bg-white/80 backdrop-blur-md border-b border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 dark:text-white text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold dark:text-white text-gray-900">
                  {getGreeting()}, <span className="text-prospera-accent">{currentUser.name}</span>
                </h1>
                {role === UserRole.ADMIN && <ShieldCheck className="w-4 h-4 text-prospera-accent" />}
              </div>
              <p className="text-[10px] text-prospera-gray uppercase tracking-widest font-black">
                {role === UserRole.ADMIN ? 'Lead Founder' : 'Member'} • {preferences.groupName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {!isOnline && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <WifiOff className="w-3 h-3" />
                Offline
              </div>
            )}
            
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700/20 transition-colors dark:text-white text-gray-900">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-700/20 transition-colors relative dark:text-white text-gray-900"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 dark:border-prospera-darkest border-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 dark:bg-prospera-dark bg-white border dark:border-white/10 border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b dark:border-white/5 border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm dark:text-white text-gray-900">Notifications</h3>
                    <span className="text-[10px] bg-prospera-accent/20 text-prospera-accent px-2 py-0.5 rounded-full font-bold uppercase">{unreadCount} NEW</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-4 border-b dark:border-white/5 border-gray-50 cursor-pointer hover:bg-prospera-accent/5 transition-colors ${!n.read ? (isDarkMode ? 'bg-prospera-accent/5' : 'bg-gray-50') : ''}`}
                        >
                          <p className={`text-sm ${!n.read ? 'font-bold dark:text-white text-gray-900' : 'font-medium text-gray-400'}`}>{n.title}</p>
                          <p className="text-xs text-prospera-gray mt-1">{n.message}</p>
                          <p className="text-[10px] text-prospera-gray mt-2 font-bold uppercase">{n.date}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-prospera-gray text-sm">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 ml-2 pl-2 sm:pl-4 border-l dark:border-white/10 border-gray-200">
              <img src={avatarSrc} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-prospera-accent shadow-lg object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {role === UserRole.USER && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around items-center p-3 border-t backdrop-blur-xl ${isDarkMode ? 'bg-prospera-darkest/90 border-white/5 shadow-2xl' : 'bg-white/90 border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'}`}>
          {bottomNavLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentPath === link.path ? 'text-prospera-accent scale-110' : 'text-prospera-gray'
              }`}
            >
              <link.icon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">{link.name}</span>
            </button>
          ))}
        </div>
      )}

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-[100] md:hidden flex flex-col animate-in slide-in-from-left duration-300 ${isDarkMode ? 'bg-prospera-darkest' : 'bg-white'}`}>
          <div className={`p-6 items-center justify-between border-b flex ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center">
                <Target className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-prospera-accent">Prospera</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              <X className="w-8 h-8" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`flex items-center w-full p-4 rounded-2xl text-left transition-all ${
                  currentPath === link.path 
                  ? 'bg-prospera-accent text-white font-bold shadow-lg shadow-prospera-accent/20' 
                  : isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <link.icon className="w-6 h-6 mr-4" />
                <span className="text-lg">{link.name}</span>
              </button>
            ))}
          </nav>
          <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <button 
              onClick={onLogout}
              className="flex items-center w-full p-4 rounded-2xl text-red-500 bg-red-500/5 font-bold"
            >
              <LogOut className="w-6 h-6 mr-4" />
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
