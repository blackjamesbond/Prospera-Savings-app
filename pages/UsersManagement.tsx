
import React, { useState } from 'react';
import { 
  Users, 
  Trash2, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Mail, 
  Award, 
  Search, 
  X, 
  TrendingUp, 
  History, 
  Calendar, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';
import { User, TransactionStatus } from '../types.ts';

const UsersManagement: React.FC = () => {
  const { users, transactions, updateUser, deleteUser, preferences, updatePreferences, showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.role !== 'ADMIN' && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUserTransactions = (userId: string) => {
    return transactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateUserStats = (userId: string) => {
    const userTxs = getUserTransactions(userId).filter(t => t.status === TransactionStatus.APPROVED);
    const total = userTxs.reduce((acc, t) => acc + t.amount, 0);
    const count = userTxs.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg, latest: userTxs[0]?.date };
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleAuthorizeReset = (userId: string) => {
    // In a real app, we'd update specifically the user's metadata. 
    // Here we manage the global app lockdown state for the demo.
    updatePreferences({ resetAuthorized: true });
    showToast('PIN Reset Authorized for User.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <Users className="text-prospera-accent" />
            Member Directory
          </h1>
          <p className="text-prospera-gray text-sm">Monitor group participation and security standing.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/10 rounded-2xl focus:outline-none focus:border-prospera-accent transition-all text-sm shadow-sm dark:text-white text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => {
          const stats = calculateUserStats(user.id);
          const avatarUrl = user.profileImage || AVATAR_SILHOUETTES[user.gender || 'male'];
          
          // Simulation: John Doe is the one being locked out for demo
          const isUserBlocked = user.id === '1' && preferences.isBlocked;
          const isResetAuth = user.id === '1' && preferences.resetAuthorized;
          
          return (
            <div key={user.id} className={`group relative bg-white dark:bg-prospera-dark border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] overflow-hidden ${isUserBlocked ? 'border-red-500/50' : 'dark:border-white/5 border-gray-100'}`}>
              
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-prospera-accent/5 rounded-full blur-2xl group-hover:bg-prospera-accent/15 transition-all" />
              
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="relative">
                  <img src={avatarUrl} alt="" className="w-16 h-16 rounded-2xl border-2 border-prospera-accent/20 p-1 bg-white dark:bg-prospera-darkest/5 object-cover" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-prospera-dark ${isUserBlocked ? 'bg-red-500 animate-pulse' : stats.count > 0 ? 'bg-prospera-accent' : 'bg-prospera-gray'}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black truncate dark:text-white text-gray-900">{user.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-prospera-accent/10 text-prospera-accent text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Rank #{user.rank}
                    </span>
                    {isUserBlocked && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> LOCKED OUT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-prospera-darkest/50 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-prospera-gray uppercase font-bold mb-1">Total</p>
                  <p className="text-sm font-black text-prospera-accent">{preferences.currency} {user.totalContributed.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-prospera-darkest/50 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-prospera-gray uppercase font-bold mb-1">Deposits</p>
                  <p className="text-sm font-black dark:text-white text-gray-900">{stats.count} Times</p>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                {isUserBlocked ? (
                  <button 
                    onClick={() => handleAuthorizeReset(user.id)}
                    disabled={isResetAuth}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isResetAuth ? 'bg-prospera-accent/10 text-prospera-accent' : 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-105'}`}
                  >
                    {isResetAuth ? <KeyRound className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    {isResetAuth ? 'AUTH GRANTED' : 'GRANT PIN RESET'}
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => updateUser(user.id, { rank: Math.max(1, user.rank - 1) })}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-prospera-accent/10 text-prospera-accent rounded-xl hover:bg-prospera-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      PROMOTE
                    </button>
                    <button 
                      onClick={() => setUserToDelete(user)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <button 
                onClick={() => setSelectedUser(user)}
                className="w-full py-4 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-prospera-gray hover:border-prospera-accent hover:text-prospera-accent transition-all flex items-center justify-center gap-2"
              >
                VIEW PROFILE DOSSIER <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* User Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-8 bg-gray-900/60 dark:bg-prospera-darkest/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-prospera-accent/10 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-prospera-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white text-gray-900">{selectedUser.name}</h3>
                  <p className="text-[10px] text-prospera-gray uppercase tracking-widest font-black">Member Intelligence Profile</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-prospera-gray">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-8 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center text-center">
                    <img src={selectedUser.profileImage || AVATAR_SILHOUETTES[selectedUser.gender || 'male']} alt="" className="w-32 h-32 rounded-3xl border-4 border-prospera-accent/20 mb-6 object-cover bg-white shadow-2xl" />
                    <h4 className="text-xl font-black mb-1 dark:text-white text-gray-900">{selectedUser.name}</h4>
                    <p className="text-sm text-prospera-gray mb-6">{selectedUser.email}</p>
                    <span className="px-4 py-1.5 bg-prospera-accent text-prospera-darkest rounded-full text-[10px] font-black uppercase tracking-widest">RANK #{selectedUser.rank}</span>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-prospera-gray flex items-center gap-2">
                      <History className="w-4 h-4" /> Personal Ledger History
                    </h5>
                    <div className="space-y-3">
                      {getUserTransactions(selectedUser.id).slice(0, 5).map((tx) => (
                        <div key={tx.id} className="p-4 bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-prospera-accent/10 text-prospera-accent">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black dark:text-white text-gray-900">{tx.description}</p>
                              <p className="text-[10px] text-prospera-gray uppercase font-bold">{tx.date}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-prospera-accent">{tx.currency} {tx.amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <button onClick={() => setSelectedUser(null)} className="w-full py-4 bg-prospera-darkest text-white font-black rounded-2xl text-[10px] uppercase tracking-widest">
                Dismiss Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-prospera-dark border border-gray-200 dark:border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black mb-2 dark:text-white text-gray-900">Safety Intercept</h3>
            <p className="text-prospera-gray text-sm mb-8">Permanently remove {userToDelete.name} from the directory?</p>
            <div className="flex gap-4">
              <button onClick={() => setUserToDelete(null)} className="flex-1 py-4 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-prospera-gray">Abondon</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20">Confirm Removal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
