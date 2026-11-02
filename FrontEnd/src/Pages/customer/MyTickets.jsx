import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, RefreshCw, Eye } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import PriorityBadge from '../../Components/PriorityBadge';
import Pagination from '../../Components/Pagination';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function MyTickets() {
  const [tickets,setTickets] = useState([]); const [total,setTotal] = useState(0); const [loading,setLoading] = useState(true); const [error,setError] = useState('');
  const [search,setSearch] = useState(''); const [status,setStatus] = useState('all'); const [priority,setPriority] = useState('all'); const [page,setPage] = useState(1);
  const pageSize = 10;
  const load = async () => { setLoading(true); setError(''); try { const {data}=await api.get('/tickets',{params:{page,limit:pageSize,...(search.trim()?{search:search.trim()}:{}),...(status!=='all'?{status}:{}),...(priority!=='all'?{priority}:{})}}); setTickets(data.data?.tickets || []); setTotal(data.data?.pagination?.totalTickets ?? (data.data?.tickets || []).length); } catch(e){setError(getErrorMessage(e,'Unable to load tickets.'));} finally{setLoading(false);} };
  useEffect(()=>{load();},[page,status,priority]);
  const filtered = useMemo(()=>tickets.filter(t=>!search || `${t.ticketNumber} ${t.subject}`.toLowerCase().includes(search.toLowerCase())),[tickets,search]);
  const date = value => value ? new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-slate-900">My Tickets</h1><p className="mt-1 text-sm text-slate-500">Track and manage your support requests.</p></div><Link to="/customer/tickets/create"><Button><Plus size={17}/> Create Ticket</Button></Link></div>
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4"><div className="relative md:col-span-2"><Search className="absolute left-3 top-3 text-slate-400" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Search ticket number or subject" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm"/></div><select value={status} onChange={e=>{setPage(1);setStatus(e.target.value)}} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"><option value="all">All statuses</option>{['open','pending','in_progress','reopened','resolved','closed'].map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select><div className="flex gap-2"><select value={priority} onChange={e=>{setPage(1);setPriority(e.target.value)}} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"><option value="all">All priorities</option>{['low','medium','high','urgent'].map(p=><option key={p}>{p}</option>)}</select><button onClick={load} className="rounded-xl border border-slate-300 px-3 text-slate-600 hover:bg-slate-50" aria-label="Refresh"><RefreshCw size={17}/></button></div></div>
    {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">{loading?<div className="p-12"><Loader text="Loading tickets..."/></div>:filtered.length===0?<div className="p-12 text-center"><p className="font-semibold text-slate-800">No tickets found</p><p className="mt-1 text-sm text-slate-500">Create a ticket or adjust your filters.</p></div>:<div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Ticket</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(t=><tr key={t._id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{t.subject}</p><p className="mt-1 text-xs text-slate-500">{t.ticketNumber}</p></td><td className="px-5 py-4 text-slate-600">{t.category}</td><td className="px-5 py-4"><PriorityBadge priority={t.priority}/></td><td className="px-5 py-4"><StatusBadge status={t.status}/></td><td className="px-5 py-4 text-slate-500">{date(t.createdAt)}</td><td className="px-5 py-4"><Link to={`/customer/tickets/${t._id}`} className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"><Eye size={16}/> View</Link></td></tr>)}</tbody></table></div>}</div>
    <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={setPage}/>
  </div>;
}
