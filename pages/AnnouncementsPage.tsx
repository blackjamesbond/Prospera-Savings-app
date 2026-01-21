
import React, { useState } from 'react';
import { Megaphone, Send, Clock, User as UserIcon, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { UserRole } from '../types.ts';

const AnnouncementsPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const { announcements, addAnnouncement, addNotification, showToast } = useAppContext();
  const [newAnn, setNewAnn] = useState({ title: '', content: '' });

  const handlePost = () => {
    if (newAnn.title && newAnn.content) {
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Add standard announcement to ledger
      addAnnouncement({
        ...newAnn,
        date: today,
        author: 'Admin'
      });

      // BROADCAST: Trigger a global notification for all users to see in their sidebar/feed
      addNotification({
        title: `Group Broadcast: ${newAnn.title}`,
        message: newAnn.content,
        type: 'info'
      });

      setNewAnn({ title: '', content: '' });
      showToast('Global broadcast successful.', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-black flex items-center gap-3 dark:text-white text-gray-900 tracking-tight">
          <Megaphone className="text-prospera-accent w-6 h-6" />
          Broadcast Center
        </h1>
      </div>

      {role === UserRole.ADMIN && (
        <div className="p-6 bg-white dark:bg-prospera-dark border dark:border-white/5 border-gray-100 rounded-[2rem] shadow-xl">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 dark:text-white text-gray-900">
            <Sparkles className="text-prospera-accent w-4 h-4" />
            Create Transmission
          </h2>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Bulletin Header"
              className="w-full px-5 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white"
              value={newAnn.title}
              onChange={e => setNewAnn({...newAnn, title: e.target.value})}
            />
            <textarea 
              placeholder="What do you want to tell the group? (Updates, meetings, targets...)"
              className="w-full px-5 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none h-24 text-xs dark:text-white leading-relaxed"
              value={newAnn.content}
              onChange={e => setNewAnn({...newAnn, content: e.target.value})}
            />
            <button 
              onClick={handlePost}
              disabled={!newAnn.title || !newAnn.content}
              className="w-full py-4 bg-prospera-accent text-white font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-prospera-accent/20 disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              Propagate to All Members
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-prospera-gray uppercase tracking-widest px-2">Recent Bulletin Logs</h2>
        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className="p-5 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-2xl hover:border-prospera-accent/30 transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-black dark:text-white text-gray-900">{ann.title}</h3>
                <div className="flex items-center gap-3 text-[8px] text-prospera-gray font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {ann.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-2.5 h-2.5" />
                    {ann.author}
                  </span>
                </div>
              </div>
              <p className="text-xs text-prospera-gray leading-relaxed font-medium">{ann.content}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="text-center py-16 bg-gray-50 dark:bg-prospera-dark/30 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-prospera-gray font-black uppercase tracking-widest text-[9px]">No broadcasts active in current cycle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
