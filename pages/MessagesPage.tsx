
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, User, ShieldCheck, Clock, Terminal, CheckCheck, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';
import { UserRole, Message } from '../types.ts';
import { GoogleGenAI } from '@google/genai';

const MessagesPage: React.FC = () => {
  const { currentUser, messages, users, sendMessage, markMessagesRead, preferences } = useAppContext();
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'AI'>('ADMIN');
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Group messages for Admin view
  const threads = useMemo(() => {
    if (!isAdmin) return [];
    const memberMessages = messages.filter(m => m.type === 'DIRECT');
    const uniqueSenders = Array.from(new Set(memberMessages.map(m => m.senderId === currentUser.id ? m.recipientId : m.senderId)));
    
    return uniqueSenders.map(sid => {
      const user = users.find(u => u.id === sid);
      const threadMessages = memberMessages.filter(m => m.senderId === sid || m.recipientId === sid);
      const lastMsg = threadMessages[threadMessages.length - 1];
      const unread = threadMessages.filter(m => m.recipientId === 'ADMIN' && !m.isRead).length;
      return { user, lastMsg, unread, id: sid };
    }).filter(t => t.user);
  }, [messages, users, isAdmin, currentUser.id]);

  // Current conversation messages
  const activeMessages = useMemo(() => {
    if (activeTab === 'AI') {
      return messages.filter(m => m.type === 'AI' && (m.senderId === currentUser.id || m.recipientId === currentUser.id));
    }
    
    if (isAdmin) {
      if (!selectedUserChat) return [];
      return messages.filter(m => (m.senderId === selectedUserChat && m.recipientId === 'ADMIN') || (m.senderId === currentUser.id && m.recipientId === selectedUserChat));
    } else {
      return messages.filter(m => m.type === 'DIRECT' && (m.senderId === currentUser.id || m.recipientId === currentUser.id));
    }
  }, [messages, activeTab, isAdmin, selectedUserChat, currentUser.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  useEffect(() => {
    if (isAdmin && selectedUserChat) {
      markMessagesRead(selectedUserChat);
    } else if (!isAdmin && activeTab === 'ADMIN') {
      markMessagesRead('ADMIN');
    }
  }, [selectedUserChat, activeTab, isAdmin]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput('');

    if (activeTab === 'AI') {
      sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: 'AI',
        text,
        type: 'AI'
      });
      
      setIsAiLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `You are the Prospera System Bot. Provide financial assistance. Context: User ${currentUser.name}.\n\nUser: ${text}`,
        });
        
        sendMessage({
          senderId: 'AI',
          senderName: 'Prospera AI',
          recipientId: currentUser.id,
          text: response.text || "I'm having trouble connecting to the system core.",
          type: 'AI'
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsAiLoading(false);
      }
    } else {
      sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: isAdmin ? (selectedUserChat || '') : 'ADMIN',
        text,
        type: 'DIRECT'
      });
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Thread List (Admin Only) */}
      {isAdmin && (
        <div className="w-full md:w-80 flex flex-col bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-6 border-b dark:border-white/5">
            <h2 className="text-lg font-black dark:text-white text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="text-prospera-accent w-5 h-5" />
              Member Threads
            </h2>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prospera-gray" />
              <input type="text" placeholder="Filter threads..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-prospera-accent transition-all dark:text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {threads.map(thread => (
              <button 
                key={thread.id}
                onClick={() => setSelectedUserChat(thread.id)}
                className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 ${selectedUserChat === thread.id ? 'bg-prospera-accent text-white shadow-lg shadow-prospera-accent/20' : 'hover:bg-prospera-accent/5 dark:text-white text-gray-900'}`}
              >
                <img src={thread.user?.profileImage || AVATAR_SILHOUETTES[thread.user?.gender || 'male']} className="w-10 h-10 rounded-xl border-2 border-white/20 object-cover" />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-xs truncate">{thread.user?.name}</p>
                    {thread.unread > 0 && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{thread.unread}</span>}
                  </div>
                  <p className={`text-[10px] truncate ${selectedUserChat === thread.id ? 'text-white/70' : 'text-prospera-gray'}`}>{thread.lastMsg?.text}</p>
                </div>
              </button>
            ))}
            {threads.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-20">
                <Terminal className="w-10 h-10 mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">No Active Threads</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-xl terminal-grid">
        
        {/* Chat Header */}
        <div className="p-4 sm:p-6 border-b dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-4">
             {!isAdmin && (
               <div className="flex bg-gray-200 dark:bg-prospera-darkest p-1 rounded-xl">
                 <button onClick={() => setActiveTab('ADMIN')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'ADMIN' ? 'bg-prospera-accent text-white shadow-md' : 'text-prospera-gray hover:text-white'}`}>Direct Admin</button>
                 <button onClick={() => setActiveTab('AI')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'AI' ? 'bg-prospera-accent text-white shadow-md' : 'text-prospera-gray hover:text-white'}`}>AI Terminal</button>
               </div>
             )}
             {isAdmin && selectedUserChat && (
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-prospera-accent/10 rounded-xl">
                   <User className="w-5 h-5 text-prospera-accent" />
                 </div>
                 <div>
                   <h3 className="text-sm font-black dark:text-white text-gray-900">{users.find(u => u.id === selectedUserChat)?.name}</h3>
                   <p className="text-[8px] text-prospera-gray uppercase font-black tracking-[0.2em]">Member Terminal Active</p>
                 </div>
               </div>
             )}
             {!isAdmin && activeTab === 'ADMIN' && (
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-prospera-accent/10 rounded-xl">
                   <ShieldCheck className="w-5 h-5 text-prospera-accent" />
                 </div>
                 <div>
                   <h3 className="text-sm font-black dark:text-white text-gray-900">Lead Founder Support</h3>
                   <p className="text-[8px] text-prospera-gray uppercase font-black tracking-[0.2em]">Encrypted Direct Tunnel</p>
                 </div>
               </div>
             )}
             {!isAdmin && activeTab === 'AI' && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white text-gray-900">Prospera AI Engine</h3>
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-[0.2em]">Heuristic Logic vFlash</p>
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Message Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar scroll-smooth">
          {activeMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm ${
                  msg.senderId === currentUser.id 
                  ? 'bg-prospera-accent text-white rounded-tr-none' 
                  : 'dark:bg-prospera-darkest bg-gray-50 dark:text-gray-200 text-gray-700 rounded-tl-none border dark:border-white/5 border-gray-100'
                }`}>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[7px] font-black text-prospera-gray uppercase tracking-widest">{msg.timestamp}</span>
                  {msg.senderId === currentUser.id && <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-prospera-accent' : 'text-prospera-gray opacity-40'}`} />}
                </div>
              </div>
            </div>
          ))}
          
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="dark:bg-prospera-darkest bg-gray-50 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-prospera-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-prospera-gray">Processing Heuristics...</span>
              </div>
            </div>
          )}

          {activeMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
              <MessageSquare className="w-20 h-20 mb-4" />
              <h4 className="text-xl font-black uppercase tracking-[0.3em]">Clear Channel</h4>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 sm:p-6 border-t dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
           {(isAdmin && !selectedUserChat) ? (
             <div className="text-center py-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-prospera-gray">Select a member thread to initialize communication</p>
             </div>
           ) : (
            <div className="relative max-w-4xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={activeTab === 'AI' ? "Query AI engine..." : "Message Lead Founder..."}
                className="w-full pl-6 pr-14 py-4 dark:bg-prospera-darkest bg-white border dark:border-white/10 border-gray-100 rounded-2xl text-xs sm:text-sm font-medium outline-none focus:border-prospera-accent transition-all shadow-inner dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isAiLoading}
                className="absolute right-2 top-1.5 p-2.5 bg-prospera-accent text-white rounded-xl shadow-lg shadow-prospera-accent/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
           )}
        </div>
      </div>

      {/* System Guidelines (Side Card) */}
      <div className="hidden lg:block w-72 space-y-4">
        <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/10 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 duration-700"><ShieldCheck className="w-16 h-16 text-prospera-accent" /></div>
          <h3 className="font-black text-[9px] uppercase tracking-widest mb-6 flex items-center gap-2 text-prospera-accent">Tunnel Integrity</h3>
          <ul className="space-y-4">
            {[
              { title: 'Peer-to-Admin', desc: 'Direct messages are encrypted and strictly between you and the Lead Founder.' },
              { title: 'AI Constraints', desc: 'The AI model only has access to localized group metrics, not external bank APIs.' },
              { title: 'Audit Trail', desc: 'All communications are logged in the group dossier for future accountability.' }
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-1 h-3 bg-prospera-accent rounded-full mt-1 shrink-0" />
                <div>
                  <h4 className="text-[9px] font-black uppercase dark:text-white text-gray-900 tracking-widest mb-0.5">{item.title}</h4>
                  <p className="text-[10px] text-prospera-gray leading-tight font-medium">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
