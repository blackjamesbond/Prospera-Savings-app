
import React, { useState, useMemo } from 'react';
import { Users, Trash2, ArrowUpCircle, Search, X, History, ChevronRight, ShieldCheck, AlertTriangle, Lock, Unlock, KeyRound, ShieldPlus, Check, XCircle } from 'lucide-react';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';
import { User, UserStatus, TransactionStatus } from '../types.ts';

const UsersManagement: React.FC = () => {
  const { users, transactions, updateUser, updateUserStatus, deleteUser, preferences, updatePreferences, showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const activeMembers = useMemo(() => users.filter(u => u.role !== 'ADMIN' && u.status === UserStatus.ACTIVE), [users]);
  const pendingRequests = useMemo(() => users.filter(u => u.status === UserStatus.PENDING), [users]);

  const filteredList = useMemo(() => {
    const base = activeTab === 'members' ? activeMembers : pendingRequests;
    return base.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeTab, activeMembers, pendingRequests, searchTerm]);

  const getUserStats = (userId: string) => {
    const userTxs = transactions.filter(t => t.userId === userId && t.status === TransactionStatus.APPROVED);
    const total = userTxs.reduce((acc, t) => acc + t.amount, 0);
    return { total, count: userTxs.length };
  };

  const handleAuthorizeReset = (userId: string) => {
    updatePreferences({ resetAuthorized: true });
    showToast('Vault Access Authorization Granted.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-black flex items-center gap-3 dark:text-white text-gray-900 tracking-tight"><Users className="text-prospera-accent" />Member Operations</h1></div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray" />
          <input type="text" placeholder="Filter registry..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-prospera-dark border dark:border-white/10 border-gray-100 rounded-2xl focus:border-prospera-accent outline-none text-xs dark:text-white text-gray-900" />
        </div>
      </div>

      <div className="flex gap-4 border-b dark:border-white/5 border-gray-100 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('members')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'members' ? 'border-prospera-accent text-prospera-accent' : 'border-transparent text-prospera-gray'}`}>Verified Registry ({activeMembers.length})</button>
        <button onClick={() => setActiveTab('requests')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'requests' ? 'border-prospera-accent text-prospera-accent' : 'border-transparent text-prospera-gray'}`}>Pending Ingress ({pendingRequests.length})</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map(user => {
          const stats = getUserStats(user.id);
          const avatarUrl = user.profileImage || AVATAR_SILHOUETTES[user.gender || 'male'];
          return (
            <div key={user.id} className="group bg-white dark:bg-prospera-dark border dark:border-white/5 border-gray-100 rounded-3xl p-5 shadow-xl transition-all hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt="" className="w-12 h-12 rounded-xl border-2 border-prospera-accent/20 p-0.5 object-cover" />
                <div className="min-w-0">
                  <h3 className="text-sm font-black truncate dark:text-white text-gray-900">{user.name}</h3>
                  <p className="text-[8px] text-prospera-gray font-bold uppercase tracking-widest truncate">{user.email}</p>
                </div>
              </div>

              {activeTab === 'members' ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 bg-gray-50 dark:bg-prospera-darkest/50 rounded-xl border dark:border-white/5 border-gray-100"><p className="text-[7px] text-prospera-gray uppercase font-bold">Equity</p><p className="text-xs font-black text-prospera-accent">{preferences.currency} {stats.total.toLocaleString()}</p></div>
                    <div className="p-2.5 bg-gray-50 dark:bg-prospera-darkest/50 rounded-xl border dark:border-white/5 border-gray-100"><p className="text-[7px] text-prospera-gray uppercase font-bold">Rank</p><p className="text-xs font-black dark:text-white">#{user.rank}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(user)} className="flex-1 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-prospera-gray hover:text-prospera-accent">Dossier</button>
                    <button onClick={() => setUserToDelete(user)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => deleteUser(user.id)} className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"><XCircle className="w-3.5 h-3.5" /> Deny</button>
                  <button onClick={() => updateUserStatus(user.id, UserStatus.ACTIVE)} className="flex-1 py-3 bg-prospera-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-prospera-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"><Check className="w-3.5 h-3.5" /> Authorize</button>
                </div>
              )}
            </div>
          );
        })}
        {filteredList.length === 0 && <div className="col-span-full py-20 text-center opacity-30"><ShieldPlus className="w-12 h-12 mx-auto mb-3" /><p className="text-[10px] font-black uppercase tracking-widest">Registry Empty</p></div>}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border dark:border-white/10 border-gray-100 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b dark:border-white/5 border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-prospera-accent" /><h3 className="text-xl font-black dark:text-white text-gray-900">Member Dossier</h3></div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              <div className="flex flex-col items-center text-center pb-8 border-b dark:border-white/5">
                <img src={selectedUser.profileImage || AVATAR_SILHOUETTES[selectedUser.gender || 'male']} alt="" className="w-24 h-24 rounded-3xl border-4 border-prospera-accent/20 mb-4 object-cover" />
                <h4 className="text-2xl font-black dark:text-white text-gray-900">{selectedUser.name}</h4>
                <p className="text-xs text-prospera-gray font-bold">{selectedUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-gray-50 dark:bg-prospera-darkest/60 rounded-2xl border dark:border-white/5 border-gray-100"><p className="text-[8px] font-black text-prospera-gray uppercase mb-1">Lifetime Validated</p><p className="text-2xl font-black text-prospera-accent">{preferences.currency} {getUserStats(selectedUser.id).total.toLocaleString()}</p></div>
                 <div className="p-6 bg-gray-50 dark:bg-prospera-darkest/60 rounded-2xl border dark:border-white/5 border-gray-100"><p className="text-[8px] font-black text-prospera-gray uppercase mb-1">Audit Protocol Rank</p><p className="text-2xl font-black dark:text-white">#{selectedUser.rank}</p></div>
              </div>
              <button onClick={() => handleAuthorizeReset(selectedUser.id)} className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-prospera-gray hover:bg-white/10">Authorize Security Reset</button>
            </div>
            <div className="p-6 border-t dark:border-white/5 border-gray-100"><button onClick={() => setSelectedUser(null)} className="w-full py-4 bg-prospera-darkest text-white font-black rounded-2xl text-[10px] uppercase tracking-widest">Dismiss</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
