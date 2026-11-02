import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Search, ShieldCheck, ShieldOff } from 'lucide-react';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function UserManagementTable({ agentsOnly = false }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const endpoint = agentsOnly ? '/admin/agents' : '/admin/users';

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(endpoint, { params: { search: search.trim() || undefined, limit: 100 } });
      setUsers(data.data?.users || []);
    } catch (err) { setError(getErrorMessage(err, 'Unable to load users.')); }
    finally { setLoading(false); }
  }, [endpoint, search]);

  useEffect(() => { load(); }, []);

  const toggleActive = async (user) => {
    setBusy(user._id); setError('');
    try {
      await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
      await load();
    } catch (err) { setError(getErrorMessage(err, 'Unable to update account status.')); }
    finally { setBusy(''); }
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-slate-900">{agentsOnly ? 'Manage Support Agents' : 'Manage Users'}</h1><p className="mt-1 text-sm text-slate-500">View registered accounts and activate or deactivate access.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><RefreshCw size={16}/> Refresh</button></div>
    <form onSubmit={e=>{e.preventDefault();load();}} className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm"/></form>
    {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">{loading?<div className="p-12"><Loader text="Loading accounts..."/></div>:users.length===0?<p className="p-12 text-center text-sm text-slate-500">No matching accounts found.</p>:<table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Name','Email','Phone','Role','Email verified','Status','Action'].map(label=><th key={label} className="px-4 py-4">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{users.map(user=><tr key={user._id} className="hover:bg-slate-50"><td className="px-4 py-4 font-medium text-slate-800">{user.name}</td><td className="px-4 py-4 text-slate-600">{user.email}</td><td className="px-4 py-4 text-slate-600">{user.phone||'—'}</td><td className="px-4 py-4 capitalize text-slate-600">{user.role.replaceAll('_',' ')}</td><td className="px-4 py-4">{user.isEmailVerified?<span className="text-emerald-700">Verified</span>:<span className="text-amber-700">Pending</span>}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{user.isActive?'Active':'Inactive'}</span></td><td className="px-4 py-4"><button disabled={busy===user._id} onClick={()=>toggleActive(user)} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${user.isActive?'border border-red-200 text-red-700 hover:bg-red-50':'bg-emerald-600 text-white hover:bg-emerald-700'}`}>{user.isActive?<><ShieldOff size={14}/> Deactivate</>:<><ShieldCheck size={14}/> Activate</>}</button></td></tr>)}</tbody></table>}</div>
  </div>;
}
