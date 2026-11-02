import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, Eye, UserCheck, XCircle } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import PriorityBadge from '../../Components/PriorityBadge';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [assignees, setAssignees] = useState({});
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [ticketResponse, agentResponse] = await Promise.all([
        api.get('/tickets', { params: { limit: 100, search: search.trim() || undefined } }),
        api.get('/admin/agents', { params: { limit: 100 } }),
      ]);
      const nextTickets = ticketResponse.data.data?.tickets || [];
      setTickets(nextTickets);
      setAgents(agentResponse.data.data?.users || []);
      setAssignees(Object.fromEntries(nextTickets.map(ticket => [ticket._id, ticket.assignedTo?._id || ''])));
    } catch (err) { setError(getErrorMessage(err, 'Unable to load tickets and agents.')); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, []);

  const assign = async (ticketId) => {
    const assignedTo = assignees[ticketId] || null;
    setBusy(ticketId); setError('');
    try {
      await api.post(`/tickets/${ticketId}/assign`, { assignedTo });
      await load();
    } catch (err) { setError(getErrorMessage(err, 'Assignment failed.')); }
    finally { setBusy(''); }
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-slate-900">All Tickets</h1><p className="mt-1 text-sm text-slate-500">Review tickets and assign them to active support agents.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><RefreshCw size={16}/> Refresh</button></div>
    <form onSubmit={e=>{e.preventDefault();load();}} className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ticket number or subject" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm"/></form>
    {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">{loading?<div className="p-12"><Loader text="Loading tickets..."/></div>:tickets.length===0?<p className="p-12 text-center text-sm text-slate-500">No tickets found.</p>:<table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Ticket','Customer','Priority','Status','Assign agent','Open'].map(h=><th key={h} className="px-4 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{tickets.map(ticket=><tr key={ticket._id} className="align-top hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-800">{ticket.subject}</p><p className="text-xs text-slate-500">{ticket.ticketNumber} · {ticket.category}</p></td><td className="px-4 py-4 text-slate-600">{ticket.requester?.name||ticket.requester?.email||'—'}</td><td className="px-4 py-4"><PriorityBadge priority={ticket.priority}/></td><td className="px-4 py-4"><StatusBadge status={ticket.status}/></td><td className="px-4 py-4"><div className="flex items-center gap-2"><select aria-label={`Assign ${ticket.ticketNumber}`} value={assignees[ticket._id]||''} onChange={e=>setAssignees(v=>({...v,[ticket._id]:e.target.value}))} className="min-w-44 rounded-lg border border-slate-300 px-2 py-2 text-xs"><option value="">Unassigned</option>{agents.map(agent=><option key={agent._id} value={agent._id} disabled={!agent.isActive}>{agent.name} · {agent.email}{agent.isActive?'':' (inactive)'}</option>)}</select><button disabled={busy===ticket._id} onClick={()=>assign(ticket._id)} title="Save assignment" className="rounded-lg bg-blue-600 p-2 text-white disabled:opacity-50"><UserCheck size={15}/></button></div><p className="mt-1 text-xs text-slate-400">Current: {ticket.assignedTo?.name||'Unassigned'}</p></td><td className="px-4 py-4"><Link to={`/admin/tickets/${ticket._id}`} className="inline-flex items-center gap-1 font-medium text-blue-600"><Eye size={16}/> Details</Link></td></tr>)}</tbody></table>}</div>
    {agents.length===0&&!loading&&<p className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"><XCircle size={16}/> No active support agents are available. Create/activate an agent account before assigning tickets.</p>}
  </div>;
}
