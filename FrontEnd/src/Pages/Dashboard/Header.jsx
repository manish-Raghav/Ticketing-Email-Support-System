import { Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function Header({title='Dashboard',user,onMenuClick,onLogout}){
 return <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6"><div className="flex items-center gap-3"><button type="button" onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={22}/></button><div><h1 className="text-lg font-bold text-slate-900 md:text-xl">{title}</h1><p className="hidden text-xs text-slate-500 sm:block">Welcome back, {user?.name||'User'}</p></div></div><ProfileDropdown user={user} onLogout={onLogout}/></header>;
}
