import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminRequests, approveRequest, rejectRequest } from '../services/api';
import Announcements from '../components/features/Announcements';
import RequestHistory from '../components/features/RequestHistory';
import DocumentUpload from '../components/features/DocumentUpload';
import RequestComments from '../components/features/RequestComments';

const THEME = {
  bg: 'bg-[#020617]',
  accent: 'bg-indigo-500',
  accentGradient: 'from-indigo-500 to-violet-600',
  surface: 'bg-slate-900/40',
  glass: 'backdrop-blur-3xl bg-white/[0.02] border border-white/[0.05]',
  glassHover: 'hover:bg-white/[0.05] hover:border-white/[0.1]',
  text: {
    primary: 'text-slate-100',
    secondary: 'text-slate-400',
    accent: 'text-indigo-400'
  }
};

const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 };

const GlassCard = ({ children, className = "", onClick, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ...SPRING_TRANSITION, delay }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-[32px] ${THEME.glass} ${onClick ? 'cursor-pointer ' + THEME.glassHover : ''} shadow-2xl shadow-black/50 ${className}`}
  >
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-30 blur-3xl pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
);

const MetricPill = ({ label, value, trend, icon }) => (
  <GlassCard className="flex flex-col justify-center p-6 min-h-[160px] group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-white/5 text-white/80 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          {trend}
        </span>
      )}
    </div>
    <div className="text-4xl font-display font-bold text-white mb-1 tracking-tight group-hover:scale-105 transition-transform origin-left">
      {value}
    </div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{label}</div>
  </GlassCard>
);

const ActionButton = ({ onClick, variant = 'primary', children, icon, isLoading }) => {
  const baseClass = "relative h-12 px-6 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  const variants = {
    primary: `bg-gradient-to-r ${THEME.accentGradient} text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110`,
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500",
    ghost: "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
  };

  return (
    <button onClick={onClick} disabled={isLoading} className={`${baseClass} ${variants[variant]}`}>
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default function AdminDashboard({ adminId, adminRole, onSignOut }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewMode, setViewMode] = useState('queue'); 
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadData();
  }, [adminRole]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminRequests(adminRole);
      if (res.success) setRequests(res.requests);
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  const processAction = async (action, id) => {
    setActionLoading(true);
    const toastId = toast.loading('Processing transaction...');
    try {
      let res;
      if (action === 'approve') {
        res = await approveRequest(id, adminId);
      } else {
        if (!rejectReason) throw new Error("Reason required");
        res = await rejectRequest(id, adminId, rejectReason);
      }

      if (res.success) {
        toast.success(action === 'approve' ? 'Transaction Approved' : 'Request Rejected', { id: toastId });
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelectedRequest(null);
        setRejectReason('');
      } else {
        throw new Error(res.error || 'Operation failed');
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const renderQueueItem = (req, idx) => (
    <motion.div
      layoutId={req.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={() => setSelectedRequest(req)}
      className="group relative p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl ${THEME.accent} flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
            {req.profiles.first_name?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
              {req.profiles.full_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                {req.profiles.student_number}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Payment Type</div>
            <div className="text-sm font-medium text-white">{req.document_types.name}</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${THEME.bg} text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden`}>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto p-6 lg:p-10 h-screen flex flex-col">
        
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <span className="font-display font-bold text-2xl text-white tracking-tighter">SD</span>
            </div>
            <div>
              <h1 className="text-4xl font-display font-medium text-white tracking-tight">
                Cashier<span className="text-white/30">Console</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span className="text-sm font-medium text-slate-300">{requests.length} Active Requests</span>
            </div>
            <button onClick={onSignOut} className="h-12 w-12 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 flex items-center justify-center transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          
          <div className="lg:col-span-8 flex flex-col gap-8 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              <MetricPill 
                label="Total Revenue" 
                value="₱24,500" 
                trend="+12%" 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <MetricPill 
                label="Pending Payments" 
                value={requests.length} 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <MetricPill 
                label="Processed Today" 
                value="142" 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>

            <GlassCard className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-6 p-6 border-b border-white/5">
                <button 
                  onClick={() => setViewMode('queue')}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${viewMode === 'queue' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Transaction Queue
                </button>
                <button 
                  onClick={() => setViewMode('history')}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${viewMode === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  History Log
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {viewMode === 'queue' ? (
                    requests.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-500">
                         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </div>
                         <p>All payments processed</p>
                      </motion.div>
                    ) : (
                      requests.map((req, i) => renderQueueItem(req, i))
                    )
                  ) : (
                    <RequestHistory isAdmin={true} />
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
            <GlassCard className="flex-1 flex flex-col relative">
               {!selectedRequest ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/5 to-transparent border border-white/5 flex items-center justify-center mb-6 animate-float">
                       <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-display font-medium text-white mb-2">Transaction Details</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Select a pending request from the queue to view documents, process payments, and approve clearance.</p>
                 </div>
               ) : (
                 <motion.div 
                   key={selectedRequest.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col h-full"
                 >
                    <div className="p-8 border-b border-white/5 bg-gradient-to-b from-indigo-500/10 to-transparent">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h2 className="text-2xl font-display font-bold text-white">{selectedRequest.profiles.full_name}</h2>
                             <p className="text-indigo-300 font-medium">{selectedRequest.profiles.student_number}</p>
                          </div>
                          <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                             <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Document</p>
                             <p className="text-sm font-medium text-white">{selectedRequest.document_types.name}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Amount Due</p>
                             <p className="text-sm font-bold text-emerald-400">₱150.00</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                       <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Proof of Payment
                          </h4>
                          <DocumentUpload requestId={selectedRequest.id} userId={adminId} isAdmin={true} />
                       </div>
                       
                       <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Communication
                          </h4>
                          <RequestComments requestId={selectedRequest.id} userId={adminId} />
                       </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl">
                       <div className="space-y-4">
                          <ActionButton 
                             variant="primary" 
                             onClick={() => processAction('approve', selectedRequest.id)} 
                             isLoading={actionLoading}
                             icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          >
                             Confirm Payment & Approve
                          </ActionButton>

                          <div className="flex gap-2">
                             <div className="flex-1 relative">
                                <input 
                                   type="text" 
                                   placeholder="Rejection Reason..." 
                                   className="w-full h-12 px-4 rounded-full bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                   value={rejectReason}
                                   onChange={(e) => setRejectReason(e.target.value)}
                                />
                             </div>
                             <ActionButton 
                                variant="danger" 
                                onClick={() => processAction('reject', selectedRequest.id)}
                                isLoading={actionLoading}
                             >
                                Reject
                             </ActionButton>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </GlassCard>

            <GlassCard className="h-[250px] p-6 flex flex-col">
               <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  <h3 className="font-bold text-sm text-white uppercase tracking-widest">Live Updates</h3>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <Announcements userRole={adminRole} />
               </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}