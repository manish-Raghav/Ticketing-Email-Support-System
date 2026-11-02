import { useEffect, useRef, useState } from 'react';
import { UserCircle, LogOut, ChevronDown } from 'lucide-react';

export default function ProfileDropdown({ user, onLogout }) {
  const [isOpen,setIsOpen]=useState(false);const ref=useRef(null);
  useEffect(()=>{const close=e=>{if(ref.current&&!ref.current.contains(e.target))setIsOpen(false);};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close);},[]);
  const role={customer:'Customer',support_agent:'Support Agent',admin:'Administrator'}[user?.role]||user?.role||'User';
  return <div className="relative" ref={ref}><button type="button" onClick={()=>setIsOpen(v=>!v)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100" aria-expanded={isOpen}><UserCircle size={34} className="text-slate-500"/><span className="hidden text-left sm:block"><span className="block max-w-32 truncate text-sm font-semibold text-slate-800">{user?.name||'User'}</span><span className="block text-xs text-slate-500">{role}</span></span><ChevronDown size={15} className="hidden text-slate-500 sm:block"/></button>{isOpen&&<div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><p className="truncate text-sm font-semibold text-slate-800">{user?.name||'User'}</p><p className="truncate text-xs text-slate-500">{user?.email||''}</p><p className="mt-1 text-xs text-blue-600">{role}</p><button onClick={()=>{setIsOpen(false);onLogout?.();}} className="mt-3 flex w-full items-center gap-2 border-t border-slate-100 pt-3 text-left text-sm font-medium text-red-600"><LogOut size={16}/> Sign out</button></div>}</div>;
}
