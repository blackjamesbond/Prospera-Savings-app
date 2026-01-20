
import React, { useState } from 'react';
import { Megaphone, Send, Clock, User as UserIcon, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { UserRole } from '../types.ts';

const AnnouncementsPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const { announcements, addAnnouncement } = useAppContext();
  const [newAnn, setNewAnn] = useState({ title: '', content: '' });

  const handlePost = () => {
    if (newAnn.title && newAnn.content) {
      addAnnouncement({
        ...newAnn,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
      });
      setNewAnn({ title: '', content: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Megaphone className="text-prospera-accent" />
          Announcements
        </h1>
      </div>

      {role === UserRole.ADMIN && (
        <div className="p-8 bg-prospera-dark border border-white/5 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-prospera-accent w-5 h-5" />
            Post New Announcement
          </h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Announcement Title"
              className="w-full px-5 py-3 bg-prospera-darkest border border-white/10 rounded-xl focus:border-prospera-accent outline-none"
              value={newAnn.title}
              onChange={e => setNewAnn({...newAnn, title: e.target.value})}
            />
            <textarea 
              placeholder="What do you want to tell the group?"
              className="w-full px-5 py-4 bg-prospera-darkest border border-white/10 rounded-xl focus:border-prospera-accent outline-none h-32"
              value={newAnn.content}
              onChange={e => setNewAnn({...newAnn, content: e.target.value})}
            />
            <button 
              onClick={handlePost}
              className="w-full py-4 bg-prospera-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(1,195,141,0.4)]"
            >
              <Send className="w-5 h-5" />
              Broadcast to All Members
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-prospera-gray uppercase tracking-widest">Recent Updates</h2>
        {announcements.map(ann => (
          <div key={ann.id} className="p-6 bg-prospera-dark border border-white/5 rounded-2xl hover:border-prospera-accent/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">{ann.title}</h3>
              <div className="flex items-center gap-4 text-xs text-prospera-gray font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {ann.date}
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3" />
                  {ann.author}
                </span>
              </div>
            </div>
            <p className="text-prospera-gray leading-relaxed">{ann.content}</p>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-20 bg-prospera-dark/30 rounded-2xl border border-dashed border-white/10">
            <p className="text-prospera-gray">No announcements yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
