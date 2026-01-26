
import React, { useState } from 'react';
import { Check, X, Trash2, Search, Filter, AlertTriangle, Calendar, User, Info, FileText, ChevronRight, XCircle, CheckCircle2, MessageSquare, ExternalLink, Target, Terminal, ShieldAlert, Lock, Trash, Download, StickyNote, Save } from 'lucide-react';
import { Transaction, TransactionStatus, UserRole } from '../types.ts';
import { useAppContext } from '../context/AppContext.tsx';

interface TransactionTableProps {
  transactions: Transaction[];
  showActions?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, showActions = true }) => {
  const { updateTransaction, deleteTransaction, currentUser, showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ id: string, status: TransactionStatus } | null>(null);

  const filteredTransactions = transactions.filter(t => 
    t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAction = () => {
    if (pendingAction) {
      updateTransaction(pendingAction.id, { status: pendingAction.status, adminNotes: adminNote });
      setPendingAction(null);
      setSelectedTransaction(null);
      setAdminNote('');
    }
  };

  const handleUpdateNoteOnly = () => {
    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, { adminNotes: adminNote });
      showToast('Transaction notes updated.', 'success');
      setSelectedTransaction(prev => prev ? { ...prev, adminNotes: adminNote } : null);
    }
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setIsDeleting(null);
    setSelectedTransaction(null);
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      showToast('No records to export.', 'info');
      return;
    }

    const headers = ['Timestamp', 'Source Member', 'Asset Reference', 'Amount', 'Currency', 'Status', 'Description', 'Admin Notes'];
    const rows = filteredTransactions.map(tx => [
      tx.date,
      `"${tx.userName.replace(/"/g, '""')}"`,
      `"${(tx.accountNumber || 'SYSTEM-RECON').replace(/"/g, '""')}"`,
      tx.amount,
      tx.currency,
      tx.status,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${(tx.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Prospera_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported Successfully.', 'success');
  };

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray" />
          <input 
            type="text" 
            placeholder="Filter Ledger Records..." 
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:border-prospera-accent transition-all dark:text-white text-gray-900 text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {isAdmin && (
             <button 
               onClick={exportToCSV}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-xl hover:bg-prospera-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-prospera-accent"
             >
              <Download className="w-3.5 h-3.5" /> Export CSV
             </button>
           )}
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl hover:bg-prospera-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-prospera-gray">
            <Filter className="w-3.5 h-3.5" /> Filter
           </button>
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-2.5">
          <thead>
            <tr className="text-prospera-gray text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="pb-2 px-6">Timestamp</th>
              <th className="pb-2 px-6">Source Member</th>
              <th className="pb-2 px-6">Asset Reference</th>
              <th className="pb-2 px-6">Volume</th>
              <th className="pb-2 px-6 text-center">Status</th>
              <th className="pb-2 px-6 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTransactions.map((tx) => (
              <tr 
                key={tx.id} 
                className="bg-white dark:bg-prospera-dark group hover:scale-[1.005] transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-prospera-accent/5 rounded-xl"
                onClick={() => { setSelectedTransaction(tx); setAdminNote(tx.adminNotes || ''); }}
              >
                <td className="py-5 px-6 first:rounded-l-xl dark:text-gray-400 text-gray-500 font-mono text-xs">{tx.date}</td>
                <td className="py-5 px-6 font-black dark:text-white text-gray-900">{tx.userName}</td>
                <td className="py-5 px-6">
                  <span className="font-mono text-[9px] bg-prospera-accent/10 text-prospera-accent px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider">
                    {tx.accountNumber || 'SYSTEM-RECON'}
                  </span>
                </td>
                <td className="py-5 px-6 font-black text-prospera-accent whitespace-nowrap text-base">
                  {tx.amount.toLocaleString()} <span className="text-[10px] opacity-60">{tx.currency}</span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    tx.status === TransactionStatus.APPROVED ? 'bg-prospera-accent/5 text-prospera-accent border-prospera-accent/20' :
                    tx.status === TransactionStatus.PENDING ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' :
                    'bg-red-500/5 text-red-500 border-red-500/20'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-5 px-6 last:rounded-r-xl text-right">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 group-hover:bg-prospera-accent group-hover:text-white transition-all ml-auto">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredTransactions.map((tx) => (
          <div 
            key={tx.id} 
            onClick={() => { setSelectedTransaction(tx); setAdminNote(tx.adminNotes || ''); }}
            className="p-5 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-2xl space-y-4 shadow-xl active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-prospera-accent/10 rounded-xl">
                  <User className="w-4 h-4 text-prospera-accent" />
                </div>
                <div>
                  <p className="font-black text-sm dark:text-white text-gray-900">{tx.userName}</p>
                  <p className="font-mono text-[9px] text-prospera-gray uppercase">{tx.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                tx.status === TransactionStatus.APPROVED ? 'bg-prospera-accent/10 text-prospera-accent' :
                tx.status === TransactionStatus.PENDING ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {tx.status}
              </span>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-prospera-darkest/50 rounded-xl border border-gray-100 dark:border-white/5">
              <p className="text-[8px] font-black text-prospera-gray uppercase tracking-widest mb-1">Code</p>
              <p className="font-mono text-[10px] dark:text-prospera-accent text-prospera-dark truncate uppercase">{tx.accountNumber || 'SYSTEM-RECON'}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xl font-black text-prospera-accent">{tx.amount.toLocaleString()} <span className="text-[10px] font-bold opacity-60">{tx.currency}</span></p>
              <div className="flex items-center gap-1 text-[8px] font-black text-prospera-gray uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                View More
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-prospera-gray mx-auto opacity-20" />
          <p className="text-prospera-gray font-black uppercase tracking-widest text-[9px]">No Records Found</p>
        </div>
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 dark:bg-prospera-darkest/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl terminal-grid">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-prospera-accent text-white rounded-xl shadow-xl shadow-prospera-accent/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black dark:text-white text-gray-900">Savings Details</h3>
                  <p className="text-[9px] text-prospera-gray uppercase tracking-widest font-black">LOG_REF: {selectedTransaction.accountNumber || 'AUTO'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-prospera-gray"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 no-scrollbar">
              <div className="p-6 sm:p-8 bg-white dark:bg-prospera-darkest/80 border border-gray-100 dark:border-white/5 rounded-2xl shadow-inner space-y-6 relative">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest">Saved By</p>
                    <p className="text-base sm:text-lg font-black dark:text-white text-gray-900">{selectedTransaction.userName}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest">Date</p>
                    <p className="text-base sm:text-lg font-black dark:text-white text-gray-900 font-mono uppercase">{selectedTransaction.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest">Money</p>
                    <p className="text-2xl sm:text-3xl font-black text-prospera-accent tracking-tighter">{selectedTransaction.amount.toLocaleString()} <span className="text-xs opacity-50">{selectedTransaction.currency}</span></p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest">Status</p>
                    <div className="flex justify-end pt-2">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        selectedTransaction.status === TransactionStatus.APPROVED ? 'bg-prospera-accent text-prospera-darkest border-prospera-accent' :
                        selectedTransaction.status === TransactionStatus.PENDING ? 'bg-yellow-500 text-prospera-darkest border-yellow-500' :
                        'bg-red-500 text-white border-red-500'
                      }`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                      <Terminal className="w-2.5 h-2.5" /> Details Found
                    </p>
                    <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl font-mono text-xs dark:text-prospera-accent text-prospera-dark leading-relaxed italic border dark:border-white/5 border-gray-100">
                      "{selectedTransaction.description}"
                    </div>
                </div>

                {/* Admin Notes Section */}
                <div className="pt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest flex items-center gap-2">
                      <StickyNote className="w-2.5 h-2.5" /> Admin Dossier Notes
                    </p>
                    {isAdmin && (
                      <button 
                        onClick={handleUpdateNoteOnly}
                        className="text-[8px] font-black uppercase text-prospera-accent hover:underline flex items-center gap-1"
                      >
                        <Save className="w-2 h-2" /> Quick Save
                      </button>
                    )}
                  </div>
                  {isAdmin ? (
                    <textarea 
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Enter internal audit notes or feedback for the member..."
                      className="w-full h-24 p-4 bg-white dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:border-prospera-accent transition-all text-xs dark:text-white text-gray-900 shadow-inner font-medium resize-none"
                    />
                  ) : (
                    <div className="p-4 bg-prospera-accent/5 dark:bg-prospera-accent/5 rounded-xl text-xs font-medium dark:text-gray-300 text-gray-600 leading-relaxed border border-prospera-accent/10">
                      {selectedTransaction.adminNotes || "No audit feedback provided by the Lead Founder yet."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              {showActions && selectedTransaction.status === TransactionStatus.PENDING ? (
                <div className="flex gap-4">
                  <button onClick={() => setPendingAction({ id: selectedTransaction.id, status: TransactionStatus.REJECTED })} className="flex-1 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-500/30 hover:scale-[1.01] transition-all"><XCircle className="w-4 h-4" /> No</button>
                  <button onClick={() => setPendingAction({ id: selectedTransaction.id, status: TransactionStatus.APPROVED })} className="flex-1 py-4 bg-prospera-accent text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-prospera-accent/40 hover:scale-[1.01] transition-all"><CheckCircle2 className="w-4 h-4" /> Yes</button>
                </div>
              ) : (
                <button onClick={() => setSelectedTransaction(null)} className="w-full py-4 bg-prospera-darkest text-white font-black uppercase tracking-widest text-[9px] rounded-xl border border-white/5">Close Dossier</button>
              )}
            </div>
          </div>
        </div>
      )}

      {pendingAction && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl terminal-grid">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl ${pendingAction.status === TransactionStatus.APPROVED ? 'bg-prospera-accent/10' : 'bg-red-500/10'}`}>
              <ShieldAlert className={`w-8 h-8 ${pendingAction.status === TransactionStatus.APPROVED ? 'text-prospera-accent' : 'text-red-500'} animate-pulse`} />
            </div>
            <h3 className="text-2xl font-black mb-2 dark:text-white text-gray-900 tracking-tighter">Confirm Audit</h3>
            <p className="text-prospera-gray text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
              Marking this entry as <span className={pendingAction.status === TransactionStatus.APPROVED ? 'text-prospera-accent' : 'text-red-500'}>{pendingAction.status}</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPendingAction(null)} className="flex-1 py-4 bg-white/5 border border-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest text-prospera-gray hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleConfirmAction} className={`flex-1 py-4 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl transition-all ${pendingAction.status === TransactionStatus.APPROVED ? 'bg-prospera-accent shadow-prospera-accent/40' : 'bg-red-500 shadow-red-500/40'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
