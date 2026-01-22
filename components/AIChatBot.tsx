
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, Sparkles, Loader2, Minimize2, Terminal } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '../context/AppContext.tsx';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Prospera Ledger Bot online. Provide query for vault data or algorithmic assistance.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { target, users, transactions, preferences } = useAppContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `
        System Environment:
        - Goal Object: ${target.title}
        - Current Accumulation: ${preferences.currency} ${target.currentAmount} / ${target.targetAmount}
        - Active Members: ${users.length}
        - Registry Count: ${transactions.length}
        
        Directive: You are a direct, algorithmic financial bot. Provide concise, data-driven answers without elaborate synthesis. Use the context above for factual responses.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${context}\n\nQuery: ${userMsg}`,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Query failed. Protocol error." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Terminal connection interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-prospera-accent rounded-full shadow-[0_0_30px_rgba(1,195,141,0.5)] flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <Terminal className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      ) : (
        <div className="w-[90vw] sm:w-[380px] h-[70vh] sm:h-[550px] dark:bg-prospera-dark bg-white border dark:border-white/10 border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-4 sm:p-5 bg-prospera-accent flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Ledger Bot</h3>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Data Engine vFlash</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar ${preferences.theme === 'dark' ? 'bg-prospera-darkest/30' : 'bg-gray-50'}`}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 sm:p-4 rounded-xl text-xs sm:text-sm shadow-sm font-medium ${
                  msg.role === 'user' 
                  ? 'bg-prospera-accent text-white rounded-tr-none' 
                  : 'dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 dark:text-gray-200 text-gray-700 rounded-tl-none font-mono'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 p-3 rounded-xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-prospera-accent" />
                </div>
              </div>
            )}
          </div>

          <div className={`p-3 sm:p-4 border-t ${preferences.theme === 'dark' ? 'bg-prospera-dark border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query system data..."
                className={`w-full pl-4 pr-12 py-3 border rounded-xl outline-none transition-all text-xs sm:text-sm ${preferences.theme === 'dark' ? 'bg-prospera-darkest border-white/10 focus:border-prospera-accent text-white' : 'bg-gray-50 border-gray-200 focus:border-prospera-accent text-gray-900'}`}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1 p-2 bg-prospera-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4 sm:w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
