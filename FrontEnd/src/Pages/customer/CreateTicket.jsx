import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Loader from '../../Components/Loader';
import api, { getErrorMessage } from '../../services/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', description: '', category: '', priority: 'medium' });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const change = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));

  useEffect(() => {
    let active = true;
    api.get('/categories')
      .then(({ data }) => { if (active) setCategories(data.data?.categories || []); })
      .catch((err) => { if (active) setError(getErrorMessage(err, 'Unable to load ticket categories.')); })
      .finally(() => { if (active) setLoadingCategories(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/tickets', {
        subject: form.subject.trim(), description: form.description.trim(),
        category: form.category, priority: form.priority,
      });
      const ticket = data.data?.ticket;
      navigate(ticket?._id ? `/customer/tickets/${ticket._id}` : '/customer/tickets', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create ticket.'));
    } finally { setLoading(false); }
  };

  return <div className="mx-auto max-w-3xl space-y-6">
    <Link to="/customer/tickets" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"><ArrowLeft size={17}/> Back to My Tickets</Link>
    <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3 text-blue-700"><Ticket size={24}/></div><div><h1 className="text-2xl font-bold text-slate-900">Create a support ticket</h1><p className="text-sm text-slate-500">Tell us what happened and our team will help.</p></div></div>
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Input label="Subject" name="subject" value={form.subject} onChange={change} placeholder="Briefly describe your issue" required />
      <div><label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">Category</label>{loadingCategories?<Loader text="Loading categories..."/>:<select id="category" name="category" value={form.category} onChange={change} required disabled={!categories.length} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"><option value="">Choose category</option>{categories.map((category)=><option key={category._id || category.name} value={category.name}>{category.name}</option>)}</select>}{!loadingCategories&&!categories.length&&<p className="mt-1 text-xs text-amber-700">No active categories are available. Please contact the administrator.</p>}</div>
      <div><label htmlFor="priority" className="mb-2 block text-sm font-medium text-slate-700">Priority</label><select id="priority" name="priority" value={form.priority} onChange={change} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500">{['low','medium','high','urgent'].map((priority)=><option key={priority} value={priority}>{priority[0].toUpperCase()+priority.slice(1)}</option>)}</select></div>
      <div><label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">Description</label><textarea id="description" name="description" value={form.description} onChange={change} required minLength={10} maxLength={10000} rows={7} placeholder="Explain the issue in detail..." className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"/><p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/10000</p></div>
      <div className="flex justify-end"><Button type="submit" disabled={loading || loadingCategories || !categories.length}>{loading ? 'Submitting...' : 'Submit Ticket'}</Button></div>
    </form>
  </div>;
}
