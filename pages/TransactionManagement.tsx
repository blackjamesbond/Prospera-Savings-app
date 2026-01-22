
import React, { useState, useEffect } from 'react';
import { Upload, Plus, History, Ban, FileSearch, Send, AlertCircle, Loader2, Sparkles, CheckCircle2, FileDown, Layers, CheckCircle, SearchCode, Database } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from '../context/AppContext.tsx';
import { UserRole, TransactionStatus } from '../types.ts';
import TransactionTable from '../components/TransactionTable.tsx';

interface TransactionManagementProps {
  role: UserRole;
  initialSharedText?: string;
}

const TransactionManagement: React.FC<TransactionManagementProps> = ({ role, initialSharedText }) => {
  const { transactions, addTransaction, showToast, preferences, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'upload'>('all');
  const [rawMessage, setRawMessage] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseMethod, setParseMethod] = useState<'LOCAL' | 'AI' | null>(null);

  useEffect(() => {
    if (initialSharedText) {
      setRawMessage(initialSharedText);
      setActiveTab('upload');
      handleLocalParse(initialSharedText);
    }
  }, [initialSharedText]);

  // Helper to turn any date string into YYYY-MM-DD safely
  const parseSafeDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        // If basic Date() fails, try to split by / or -
        const parts = dateStr.split(/[\/\-]/);
        if (parts.length === 3) {
          // If first part is 4 digits, assume YYYY-MM-DD
          if (parts[0].length === 4) {
             return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          }
          // Else assume DD-MM-YYYY
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          return `${year}-${month}-${day}`;
        }
        return new Date().toISOString().split('T')[0];
      }
      return d.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  // LOCAL PARSER - Improved to fix the date bug
  const handleLocalParse = (msg: string) => {
    if (!msg.trim()) {
      setExtractedData(null);
      return false;
    }
    
    setParseMethod('LOCAL');
    // Patterns for money: KES 100, 100.00 KES, etc.
    const amountRegex = /(?:KES|Ksh|USD|EUR)\.?\s?([\d,]+\.?\d*)|([\d,]+\.?\d*)\s?(?:KES|Ksh|USD|EUR)/i;
    // Patterns for transaction codes
    const refRegex = /\b[A-Z0-9]{8,12}\b/;
    
    // IMPROVED DATE REGEX: Handles YYYY/MM/DD, DD/MM/YYYY, and Month dates
    const dateRegex = /\b(?:\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b|\b\d{1,2}\s[A-Za-z]{3}\s\d{2,4}\b/;
    
    const amountMatch = msg.match(amountRegex);
    const refMatch = msg.match(refRegex);
    const dateMatch = msg.match(dateRegex);

    if (amountMatch) {
      const amountStr = amountMatch[1] || amountMatch[2];
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      
      setExtractedData({
        amount,
        currency: 'KES', 
        date: dateMatch ? parseSafeDate(dateMatch[0]) : new Date().toISOString().split('T')[0],
        description: 'Automatic Read',
        accountNumber: refMatch ? refMatch[0] : `CODE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        raw: msg
      });
      return true;
    }
    return false;
  };

  const parseWithAI = async () => {
    if (rawMessage.length < 10) {
      showToast('Text is too short.', 'error');
      return;
    }
    setIsParsing(true);
    setParseMethod('AI');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Read this message and find: amount, money type (currency), date (YYYY-MM-DD), and the secret code (accountNumber). Text: "${rawMessage}".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              accountNumber: { type: Type.STRING },
            },
            required: ['amount', 'currency', 'date', 'description']
          }
        }
      });

      const data = JSON.parse(response.text.trim());
      setExtractedData({ ...data, date: parseSafeDate(data.date), raw: rawMessage });
      showToast('Finished checking.', 'success');
    } catch (error) {
      showToast('Error. Using basic reader instead.', 'error');
      handleLocalParse(rawMessage);
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpload = () => {
    if (extractedData) {
      addTransaction({
        userId: currentUser.id,
        userName: currentUser.name,
        amount: extractedData.amount,
        currency: extractedData.currency || preferences.currency,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        description: extractedData.description || 'Verified Savings',
        status: TransactionStatus.PENDING,
        accountNumber: extractedData.accountNumber,
        rawMessage: extractedData.raw
      });
      setRawMessage('');
      setExtractedData(null);
      setActiveTab('all');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black dark:text-white text-gray-900 tracking-tight">Money List</h1>
          <p className="text-prospera-gray text-xs">Easy way to add and see your savings.</p>
        </div>
        {role === UserRole.USER && (
          <button 
            onClick={() => setActiveTab('upload')}
            className="px-6 py-3 bg-prospera-accent text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-prospera-accent/20 hover:scale-105 transition-all"
          >
            Add Savings
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
        {['all', 'pending', 'approved', 'rejected', 'upload'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-4 border-b-2 transition-all whitespace-nowrap text-[9px] font-black uppercase tracking-widest ${activeTab === tab ? 'border-prospera-accent text-prospera-accent bg-prospera-accent/5' : 'border-transparent text-prospera-gray hover:text-gray-900 dark:hover:text-white'}`}
          >
            {tab === 'all' ? 'Show All' : tab === 'pending' ? 'Wait List' : tab === 'approved' ? 'Safe' : tab === 'rejected' ? 'No' : 'Add New'}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] p-4 md:p-8 shadow-xl min-h-[500px]">
        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-prospera-accent/10 rounded-2xl mb-1">
                <SearchCode className="w-8 h-8 text-prospera-accent" />
              </div>
              <h3 className="text-xl font-black dark:text-white text-gray-900">Add My Savings</h3>
              <p className="text-prospera-gray text-xs max-w-md mx-auto leading-relaxed">
                Paste your bank or M-Pesa message here. We will find the details for you.
              </p>
            </div>
            
            <div className="space-y-3">
              <textarea 
                className="w-full h-32 p-4 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:outline-none focus:border-prospera-accent transition-all text-xs leading-relaxed dark:text-white text-gray-900 shadow-inner"
                placeholder="Paste the message from your phone here..."
                value={rawMessage}
                onChange={(e) => {
                  setRawMessage(e.target.value);
                  handleLocalParse(e.target.value);
                }}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-prospera-gray">
                  {rawMessage.length > 0 ? `${rawMessage.length} letters` : 'Waiting for text'}
                </span>
                <button 
                  onClick={parseWithAI}
                  disabled={isParsing || rawMessage.length < 5}
                  className="flex items-center gap-2 text-prospera-accent hover:text-white hover:bg-prospera-accent px-3 py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest border border-prospera-accent/20"
                >
                  {isParsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isParsing ? 'Checking...' : 'Smart Help'}
                </button>
              </div>
            </div>

            {extractedData && (
              <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/20 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-prospera-accent" />
                    <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-prospera-accent">What we found</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-widest">Money Amount</p>
                    <p className="text-xl font-black dark:text-white text-gray-900">{extractedData.currency} {extractedData.amount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-widest">Date</p>
                    <p className="text-sm font-black dark:text-white text-gray-900">{extractedData.date}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-widest">Code</p>
                    <p className="text-xs font-mono bg-white dark:bg-black/20 p-3 rounded-lg dark:text-prospera-accent text-prospera-dark border dark:border-white/5 border-gray-100">
                      {extractedData.accountNumber}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleUpload} 
                  className="w-full py-4 bg-prospera-accent text-white font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01] transition-all shadow-md shadow-prospera-accent/20"
                >
                  Yes, Save This
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <TransactionTable 
              transactions={activeTab === 'all' ? transactions : transactions.filter(t => t.status.toLowerCase() === activeTab)} 
              showActions={role === UserRole.ADMIN} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
