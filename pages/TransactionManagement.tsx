
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

  // LOCAL PARSER (Regex based - reinforced for multiple E-Africa message styles)
  const handleLocalParse = (msg: string) => {
    if (!msg.trim()) {
      setExtractedData(null);
      return false;
    }
    
    setParseMethod('LOCAL');
    // Amount patterns: handles KES 100, Ksh.100, USD 100, 100.00 KES
    const amountRegex = /(?:KES|Ksh|USD|EUR)\.?\s?([\d,]+\.?\d*)|([\d,]+\.?\d*)\s?(?:KES|Ksh|USD|EUR)/i;
    // Transaction codes (M-Pesa, bank refs)
    const refRegex = /\b[A-Z0-9]{8,12}\b/;
    // Date patterns (DD/MM/YYYY, YYYY-MM-DD, Month DD YYYY)
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}\s[A-Za-z]{3}\s\d{2,4})/;
    
    const amountMatch = msg.match(amountRegex);
    const refMatch = msg.match(refRegex);
    const dateMatch = msg.match(dateRegex);

    if (amountMatch) {
      const amountStr = amountMatch[1] || amountMatch[2];
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      
      setExtractedData({
        amount,
        currency: 'KES', // Defaulting to KES if not explicitly caught
        date: dateMatch ? new Date(dateMatch[0]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: 'Instant Local Extraction',
        accountNumber: refMatch ? refMatch[0] : `LOCAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        raw: msg
      });
      return true;
    }
    return false;
  };

  const parseWithAI = async () => {
    if (rawMessage.length < 10) {
      showToast('Message too short for deep analysis.', 'error');
      return;
    }
    setIsParsing(true);
    setParseMethod('AI');
    const currentYear = new Date().getFullYear();
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Strictly extract financial metadata from this text: "${rawMessage}". Year: ${currentYear}. Platform: Prospera. Respond in JSON.`;

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
      setExtractedData({ ...data, raw: rawMessage });
      showToast('AI synthesis successful.', 'success');
    } catch (error) {
      showToast('AI Engine Error. Falling back to local data.', 'error');
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
        description: extractedData.description || 'Verified Contribution',
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white text-gray-900 tracking-tight">Ledger Operations</h1>
          <p className="text-prospera-gray text-sm">Offline-first deterministic contribution processing.</p>
        </div>
        {role === UserRole.USER && (
          <button 
            onClick={() => setActiveTab('upload')}
            className="px-8 py-4 bg-prospera-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-prospera-accent/20 hover:scale-105 transition-all"
          >
            New Contribution
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
        {['all', 'pending', 'approved', 'rejected', 'upload'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-5 border-b-2 transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'border-prospera-accent text-prospera-accent bg-prospera-accent/5' : 'border-transparent text-prospera-gray hover:text-gray-900 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-4 md:p-12 shadow-2xl min-h-[600px]">
        {activeTab === 'upload' ? (
          <div className="max-w-3xl mx-auto space-y-10 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="inline-flex p-5 bg-prospera-accent/10 rounded-3xl mb-2">
                <SearchCode className="w-10 h-10 text-prospera-accent" />
              </div>
              <h3 className="text-3xl font-black dark:text-white text-gray-900">Contribution Logic</h3>
              <p className="text-prospera-gray max-w-lg mx-auto leading-relaxed">
                Paste your bank or M-Pesa message. The local system handles standard formats instantly. Use the Cloud Engine for complex text.
              </p>
            </div>
            
            <div className="space-y-4">
              <textarea 
                className="w-full h-48 p-6 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-3xl focus:outline-none focus:border-prospera-accent transition-all text-sm leading-relaxed dark:text-white text-gray-900 shadow-inner"
                placeholder="Paste transaction text here..."
                value={rawMessage}
                onChange={(e) => {
                  setRawMessage(e.target.value);
                  handleLocalParse(e.target.value);
                }}
              />
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-prospera-gray">
                  {rawMessage.length > 0 ? `${rawMessage.length} bytes input` : 'Ready for input'}
                </span>
                <button 
                  onClick={parseWithAI}
                  disabled={isParsing || rawMessage.length < 5}
                  className="flex items-center gap-3 text-prospera-accent hover:text-white hover:bg-prospera-accent px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-prospera-accent/20"
                >
                  {isParsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isParsing ? 'Processing...' : 'Deep Sync'}
                </button>
              </div>
            </div>

            {extractedData && (
              <div className="p-8 bg-prospera-accent/5 border border-prospera-accent/20 rounded-[2rem] space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-prospera-accent" />
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-prospera-accent">Extracted Data</h4>
                  </div>
                  <span className="text-[8px] font-black px-2 py-1 bg-prospera-accent text-prospera-darkest rounded-full uppercase">
                    VIA {parseMethod} Engine
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-prospera-gray uppercase font-black tracking-widest">Amount</p>
                    <p className="text-3xl font-black dark:text-white text-gray-900">{extractedData.currency} {extractedData.amount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-prospera-gray uppercase font-black tracking-widest">Post Date</p>
                    <p className="text-xl font-black dark:text-white text-gray-900">{extractedData.date}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <p className="text-[10px] text-prospera-gray uppercase font-black tracking-widest">System Reference</p>
                    <p className="text-sm font-mono bg-white dark:bg-black/20 p-4 rounded-xl dark:text-prospera-accent text-prospera-dark border dark:border-white/5 border-gray-100">
                      {extractedData.accountNumber}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleUpload} 
                  className="w-full py-5 bg-prospera-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.01] transition-all shadow-lg shadow-prospera-accent/20"
                >
                  Confirm Entry
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
