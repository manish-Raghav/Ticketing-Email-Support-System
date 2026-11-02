import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, Eye } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import PriorityBadge from '../../Components/PriorityBadge';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function AssignedTickets(){
 const [tickets,setTickets]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[search,setSearch]=useState('');
 const load=async()=>{setLoading(true);setError('');try{const {data}=await api.get('/tickets',{params:{limit:100,search}});setTickets(data.data?.tickets||[]);}catch(e){setError(getErrorMessage(e,'Unable to load assigned tickets.'));}finally{setLoading(false);}};
 useEffect(()=>{load();},[]);
 return <div className="space-y-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-slate-900">Assigned Tickets</h1><p className="mt-1 text-sm text-slate-500">Tickets assigned to your support account.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><RefreshCw size={16}/> Refresh</button></div>
 <div className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Search tickets..." className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm"/></div>
 {error&&<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
 <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">{loading?<div className="p-12"><Loader text="Loading assigned tickets..."/></div>:tickets.length===0?<p className="p-12 text-center text-sm text-slate-500">No tickets are assigned to you.</p>:<table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Ticket','Customer','Priority','Status','Created',''].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{tickets.map(t=><tr key={t._id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{t.subject}</p><p className="text-xs text-slate-500">{t.ticketNumber}</p></td><td className="px-5 py-4 text-slate-600">{t.requester?.name||t.requester?.email||'—'}</td><td className="px-5 py-4"><PriorityBadge priority={t.priority}/></td><td className="px-5 py-4"><StatusBadge status={t.status}/></td><td className="px-5 py-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td><td className="px-5 py-4"><Link className="inline-flex items-center gap-1 font-medium text-blue-600" to={`/agent/tickets/${t._id}`}><Eye size={16}/> Open</Link></td></tr>)}</tbody></table>}</div></div>;
}
