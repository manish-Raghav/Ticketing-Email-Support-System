import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, CircleDot, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import StatusBadge from '../../Components/StatusBadge';
import PriorityBadge from '../../Components/PriorityBadge';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function RoleDashboard({role}){
 const [summary,setSummary]=useState(null),[tickets,setTickets]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{(async()=>{try{const [s,t]=await Promise.all([api.get('/dashboard/summary'),api.get('/tickets',{params:{limit:5,sortBy:'createdAt',order:'desc'}})]);setSummary(s.data.data);setTickets(t.data.data?.tickets||[]);}catch(e){setError(getErrorMessage(e,'Unable to load dashboard data.'));}finally{setLoading(false);}})();},[]);
 if(loading)return <div className="py-20"><Loader text="Loading dashboard..."/></div>;
 const by=summary?.byStatus||{};const total=summary?.totalTickets||0;
 const cards=[{title:'Total Tickets',value:total,description:'Tickets in your workspace',icon:Ticket,color:'blue'},{title:'Open Tickets',value:by.open||0,description:'Awaiting attention',icon:CircleDot,color:'orange'},{title:'In Progress',value:by.in_progress||0,description:'Currently being handled',icon:Clock3,color:'purple'},{title:'Resolved',value:by.resolved||0,description:'Successfully resolved',icon:CheckCircle2,color:'green'}];
 const title=role==='admin'?'Administration Overview':role==='support_agent'?'Agent Workspace':'Your Support Overview';
 const listPath=role==='admin'?'/admin/tickets':role==='support_agent'?'/agent/tickets':'/customer/tickets';
 return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-800 p-6 text-white sm:flex-row sm:items-center"><div><p className="text-sm text-blue-200">{title}</p><h1 className="mt-2 text-2xl font-bold">Welcome back, {JSON.parse(localStorage.getItem('user')||'{}').name||'there'}!</h1><p className="mt-2 text-sm text-blue-100">A live view of ticket activity and current workload.</p></div><Link to={role==='customer'?'/customer/tickets/create':listPath} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50">{role==='customer'?'Create a ticket':'View tickets'}</Link></div>
 {error&&<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(c=><StatCard key={c.title} {...c}/>)}</div>
 <div className="grid gap-5 lg:grid-cols-3"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-semibold text-slate-900">Recent tickets</h2><p className="mt-1 text-xs text-slate-500">Latest ticket updates</p></div><Link to={listPath} className="text-sm font-semibold text-blue-600">View all</Link></div>{tickets.length===0?<p className="p-8 text-center text-sm text-slate-500">No tickets yet.</p>:<div className="divide-y divide-slate-100">{tickets.map(t=><Link key={t._id} to={`${listPath}/${t._id}`} className="flex flex-col justify-between gap-3 p-4 hover:bg-slate-50 sm:flex-row sm:items-center"><div><p className="font-medium text-slate-800">{t.subject}</p><p className="mt-1 text-xs text-slate-500">{t.ticketNumber} · {t.category}</p></div><div className="flex items-center gap-2"><PriorityBadge priority={t.priority}/><StatusBadge status={t.status}/></div></Link>)}</div>}</section>
 <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2"><AlertTriangle className="text-orange-500" size={18}/><h2 className="font-semibold text-slate-900">Needs attention</h2></div><p className="mt-2 text-3xl font-bold text-slate-900">{summary?.highPriorityTickets||0}</p><p className="mt-1 text-sm text-slate-500">High and urgent priority tickets</p><div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-orange-500" style={{width:`${total?Math.min(100,((summary?.highPriorityTickets||0)/total)*100):0}%`}}/></div></section></div></div>;
}
