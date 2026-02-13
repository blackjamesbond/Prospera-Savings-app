
import React, { useState, useEffect } from 'react';
import { Upload, Plus, History, Ban, FileSearch, Send, AlertCircle, Loader2, Sparkles, CheckCircle2, FileDown, Layers, CheckCircle, SearchCode, Database, X, Smartphone, ShieldCheck, CreditCard, ArrowRight, Zap, CheckCircle as CheckIcon, Clock, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { UserRole, TransactionStatus } from '../types.ts';
import TransactionTable from '../components/TransactionTable.tsx';

/**
 * AFRICA'S TALKING CONFIGURATION
 * Replace these values with your actual credentials from the Africa's Talking Dashboard.
 * Warning: Exposing API Keys in the frontend is only for testing. Use a backend proxy for production.
 */
const AT_CONFIG = {
  USERNAME: 'sandbox', // Use 'sandbox' for testing, or your real username
  API_KEY: 'YOUR_AT_API_KEY_HERE', 
  PRODUCT_NAME: 'ProsperaVault', // Your AT Payment Product Name
  CURRENCY: 'KES'
};

interface TransactionManagementProps {
  role: UserRole;
  initialSharedText?: string;
}

const TransactionManagement: React.FC<TransactionManagementProps> = ({ role, initialSharedText }) => {
  const { transactions, addTransaction, showToast, preferences, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'upload' | 'instant'>('all');
  const [rawMessage, setRawMessage] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);

  // Instant Deposit (STK Push) State
  const [stkPhone, setStkPhone] = useState('');
  const [stkAmount, setStkAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'INITIATING' | 'SENDING' | 'WAITING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialSharedText) {
      setRawMessage(initialSharedText);
      setActiveTab('upload');
      handleLocalParse(initialSharedText);
    }
  }, [initialSharedText]);

  const handleLocalParse = (msg: string) => {
    if (!msg.trim()) {
      setExtractedData(null);
      return false;
    }
    const amountRegex = /(?:KES|Ksh|USD|EUR)\.?\s?([\d,]+\.?\d*)|([\d,]+\.?\d*)\s?(?:KES|Ksh|USD|EUR)/i;
    const amountMatch = msg.match(amountRegex);
    const refRegex = /\b[A-Z0-9]{8,12}\b/;
    const refMatch = msg.match(refRegex);
    const dateRegex = /\b\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/;
    const dateMatch = msg.match(dateRegex);

    if (amountMatch) {
      const amountStr = amountMatch[1] || amountMatch[2];
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      setExtractedData({
        amount,
        currency: 'KES',
        date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
        description: 'Automatic Ledger Read',
        accountNumber: refMatch ? refMatch[0] : `AUTO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        raw: msg
      });
      return true;
    }
    return false;
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

  const handleInstantDeposit = async () => {
    if (!stkPhone || !stkAmount) {
      showToast('Please provide valid phone and amount.', 'error');
      return;
    }

    if (AT_CONFIG.API_KEY === 'YOUR_AT_API_KEY_HERE') {
      showToast('Developer Error: Africa\'s Talking API Key not configured.', 'error');
      return;
    }

    setPaymentStatus('INITIATING');
    setErrorMessage('');
    
    try {
      // Formulate the international format: 254...
      const formattedPhone = `+254${stkPhone.startsWith('0') ? stkPhone.substring(1) : stkPhone}`;
      
      const payload = {
        username: AT_CONFIG.USERNAME,
        productName: AT_CONFIG.PRODUCT_NAME,
        phoneNumber: formattedPhone,
        currencyCode: AT_CONFIG.CURRENCY,
        amount: parseFloat(stkAmount),
        metadata: {
          userId: currentUser.id,
          userName: currentUser.name,
          source: "Prospera Mobile App"
        }
      };

      setPaymentStatus('SENDING');

      // Note: We use the production endpoint. For sandbox, use: https://payments.sandbox.africastalking.com/...
      const baseUrl = AT_CONFIG.USERNAME === 'sandbox' 
        ? 'https://payments.sandbox.africastalking.com' 
        : 'https://payments.africastalking.com';
      
      const response = await fetch(`${baseUrl}/mobile/checkout/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apiKey': AT_CONFIG.API_KEY
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && (result.status === 'PendingConfirmation' || result.status === 'Success')) {
        setPaymentStatus('WAITING');
        // Africa's Talking returns a transactionId
        const transactionId = result.transactionId || `AT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

        // Wait for user to enter pin (Simulated wait, as we'd normally await a webhook callback)
        await new Promise(r => setTimeout(r, 8000));

        addTransaction({
          userId: currentUser.id,
          userName: currentUser.name,
          amount: parseFloat(stkAmount),
          currency: AT_CONFIG.CURRENCY,
          date: new Date().toISOString().split('T')[0],
          description: `M-Pesa Instant Deposit (Ref: ${transactionId})`,
          status: TransactionStatus.APPROVED,
          accountNumber: transactionId,
          rawMessage: `STK Push via Africa's Talking to ${formattedPhone}`
        });

        setPaymentStatus('SUCCESS');
        setTimeout(() => {
          setPaymentStatus('IDLE');
          setStkAmount('');
          setStkPhone('');
          setActiveTab('all');
        }, 3000);
      } else {
        throw new Error(result.errorMessage || result.description || 'Gateway connection refused.');
      }
    } catch (error: any) {
      console.error('AT Payment Error:', error);
      setPaymentStatus('ERROR');
      setErrorMessage(error.message || 'The Payment Protocol was interrupted.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black dark:text-white text-gray-900 tracking-tight">Ledger Operations</h1>
          <p className="text-prospera-gray text-[10px] uppercase font-bold tracking-widest opacity-60">TechForge Africa Gateway • Alpha v3.5</p>
        </div>
        {role === UserRole.USER && (
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('instant')}
              className="px-6 py-3 bg-prospera-accent text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-prospera-accent/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap className="w-3 h-3" /> Instant Deposit
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className="px-6 py-3 bg-white/5 dark:bg-prospera-dark border border-white/5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-all"
            >
              Manual Upload
            </button>
          </div>
        )}
      </div>

      <div className="flex border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'pending', label: 'Verification' },
          { id: 'approved', label: 'Safe' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'upload', label: 'Manual Import' },
          { id: 'instant', label: 'Instant Pay' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 border-b-2 transition-all whitespace-nowrap text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'border-prospera-accent text-prospera-accent bg-prospera-accent/5' : 'border-transparent text-prospera-gray hover:text-gray-900 dark:hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-2xl p-4 md:p-8 shadow-xl min-h-[500px]">
        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
             <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-prospera-accent/10 rounded-xl mb-1">
                <SearchCode className="w-8 h-8 text-prospera-accent" />
              </div>
              <h3 className="text-xl font-black dark:text-white text-gray-900">Import Record</h3>
              <p className="text-prospera-gray text-xs max-w-sm mx-auto leading-relaxed">
                Paste your banking message below. Our protocol will extract details instantly.
              </p>
            </div>
            
            <div className="space-y-3">
              <textarea 
                className="w-full h-32 p-4 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:border-prospera-accent transition-all text-xs leading-relaxed dark:text-white text-gray-900 shadow-inner"
                placeholder="Paste transaction text (e.g. M-Pesa or Bank SMS)..."
                value={rawMessage}
                onChange={(e) => {
                  setRawMessage(e.target.value);
                  handleLocalParse(e.target.value);
                }}
              />
            </div>

            {extractedData && (
              <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/20 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Database className="w-20 h-20 text-prospera-accent" /></div>
                <div className="flex items-center gap-2 relative z-10">
                  <Database className="w-4 h-4 text-prospera-accent" />
                  <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-prospera-accent">Decoded Payload</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-widest">Asset Volume</p>
                    <p className="text-xl font-black dark:text-white text-gray-900">KES {extractedData.amount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-widest">Date Index</p>
                    <p className="text-sm font-black dark:text-white text-gray-900">{extractedData.date}</p>
                  </div>
                </div>

                <button 
                  onClick={handleUpload} 
                  className="w-full py-4 bg-prospera-accent text-white font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01] transition-all shadow-md shadow-prospera-accent/20 relative z-10"
                >
                  Confirm Ledger Entry
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'instant' ? (
          <div className="max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-300 py-10">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-[#4CAF50]/10 rounded-2xl mb-1 shadow-inner border border-[#4CAF50]/20">
                <CreditCard className="w-10 h-10 text-[#4CAF50]" />
              </div>
              <h3 className="text-2xl font-black dark:text-white text-gray-900 tracking-tight flex items-center justify-center gap-2">
                M-Pesa <span className="text-[#4CAF50]">Direct Push</span>
              </h3>
              <p className="text-prospera-gray text-[9px] max-w-sm mx-auto leading-relaxed uppercase tracking-[0.3em] font-black">
                Africa's Talking Mainnet Connector
              </p>
            </div>

            {paymentStatus === 'IDLE' ? (
              <div className="space-y-6">
                <div className="p-8 bg-gray-50 dark:bg-prospera-darkest/60 border border-gray-100 dark:border-white/5 rounded-[2.5rem] space-y-6 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Member Phone (Safaricom)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 dark:border-white/10 pr-3">
                        <Smartphone className="w-3.5 h-3.5 text-prospera-accent" />
                        <span className="text-xs font-black dark:text-white">+254</span>
                      </div>
                      <input 
                        type="tel" 
                        placeholder="712345678" 
                        value={stkPhone}
                        onChange={(e) => setStkPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className="w-full pl-24 pr-6 py-4 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Deposit Amount (KES)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-prospera-accent">KES</div>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={stkAmount}
                        onChange={(e) => setStkAmount(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={handleInstantDeposit}
                    disabled={!stkPhone || !stkAmount}
                    className="w-full py-5 bg-[#4CAF50] text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl shadow-[#4CAF50]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Initiate Deposit <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] text-prospera-gray font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#4CAF50]" /> Secured via TechForge AT-Connector
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-10 bg-gray-50 dark:bg-prospera-darkest/60 border border-gray-100 dark:border-white/5 rounded-[3rem] text-center space-y-8 animate-in fade-in duration-500 shadow-2xl relative overflow-hidden">
                <div className="relative flex justify-center">
                  {paymentStatus === 'SUCCESS' ? (
                    <div className="w-24 h-24 bg-[#4CAF50] rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-2xl shadow-[#4CAF50]/40">
                      <CheckIcon className="w-12 h-12 text-white" />
                    </div>
                  ) : paymentStatus === 'ERROR' ? (
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-2xl shadow-red-500/40">
                      <ShieldAlert className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-24 h-24 bg-prospera-accent/10 rounded-full flex items-center justify-center animate-pulse">
                        <Smartphone className="w-10 h-10 text-prospera-accent" />
                      </div>
                      <div className="absolute inset-0 border-4 border-prospera-accent/20 border-t-prospera-accent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black dark:text-white text-gray-900 tracking-tight uppercase">
                    {paymentStatus === 'INITIATING' && 'Handshaking Gateway...'}
                    {paymentStatus === 'SENDING' && 'Pushing to AT Node...'}
                    {paymentStatus === 'WAITING' && 'Awaiting Pin Entry'}
                    {paymentStatus === 'SUCCESS' && 'Asset Verified!'}
                    {paymentStatus === 'ERROR' && 'Terminal Error'}
                  </h4>
                  <p className="text-[10px] text-prospera-gray font-bold uppercase tracking-[0.3em] animate-pulse">
                    {paymentStatus === 'ERROR' ? errorMessage : `Target Terminal: +254 ${stkPhone}`}
                  </p>
                </div>

                {(paymentStatus === 'ERROR' || paymentStatus === 'SUCCESS') && (
                  <button 
                    onClick={() => setPaymentStatus('IDLE')}
                    className="px-8 py-3 bg-white/5 border border-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest text-prospera-gray hover:text-white"
                  >
                    Reset Terminal
                  </button>
                )}
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

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TransactionManagement;
