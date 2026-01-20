
import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible }) => {
  if (!visible) return null;

  const bgStyles = {
    success: 'bg-prospera-accent text-white shadow-prospera-accent/30',
    error: 'bg-red-500 text-white shadow-red-500/30',
    info: 'bg-blue-500 text-white shadow-blue-500/30'
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }[type];

  return (
    <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ${bgStyles[type]}`}>
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm tracking-tight">{message}</span>
    </div>
  );
};

export default Toast;
