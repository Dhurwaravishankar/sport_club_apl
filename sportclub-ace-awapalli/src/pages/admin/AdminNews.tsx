import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { sb } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

type NewsItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  is_important: boolean;
};

const AdminNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', category: 'Sports News', is_important: false });
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await sb.from('news').select('*').order('date', { ascending: false });
    if (error) {
      console.error(error);
      toast({ title: 'Load error', description: error.message || 'Could not load news', variant: 'destructive' });
    } else {
      setNews((data ?? []) as NewsItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => setForm({ title: '', description: '', date: '', category: 'Sports News', is_important: false });

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date) {
      toast({ title: 'Missing', description: 'Title, description and date required', variant: 'destructive' });
      return;
    }
    try {
      if (editing) {
        const updates = {
          title: form.title,
          description: form.description,
          date: form.date,
          category: form.category,
          is_important: form.is_important,
        };
        const { error } = await sb.from('news').update(updates).eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Updated' });
      } else {
        const id = uuidv4();
        const payload = { id, ...form };
        const { error } = await sb.from('news').insert([payload]);
        if (error) throw error;
        toast({ title: 'Created' });
      }
      resetForm();
      setEditing(null);
      fetchNews();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Save error', description: err.message || 'Could not save', variant: 'destructive' });
    }
  };

  const handleEdit = (n: NewsItem) => {
    setEditing(n);
    setForm({ title: n.title, description: n.description, date: n.date, category: n.category, is_important: !!n.is_important });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news item?')) return;
    const { error } = await sb.from('news').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete error', description: error.message || 'Could not delete', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted' });
      fetchNews();
    }
  };

  // simple admin check via env email (replace with real role-check)
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getUser();
      setUserEmail(data?.user?.email ?? '');
    })();
  }, []);

  const isAdmin = userEmail === adminEmail && adminEmail !== '';

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading">News Management</h1>
          {!isAdmin && <p className="text-sm text-muted-foreground">You do not have admin rights for news.</p>}
        </div>

        {isAdmin && (
          <div className="bg-card p-4 rounded-md border border-border mb-6">
            <div className="grid grid-cols-1 gap-3">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: (e.target as HTMLInputElement).value })} />
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: (e.target as HTMLTextAreaElement).value })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: (e.target as HTMLInputElement).value })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: (e.target as HTMLInputElement).value })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input id="imp" type="checkbox" checked={form.is_important} onChange={(e) => setForm({ ...form, is_important: (e.target as HTMLInputElement).checked })} />
                <label htmlFor="imp" className="text-sm">Mark as Important</label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>{editing ? 'Update' : 'Add News'}</Button>
                <Button variant="ghost" onClick={() => { resetForm(); setEditing(null); }}>Clear</Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? <p>Loading...</p> : news.map((n) => (
            <div key={n.id} className="bg-card rounded-md p-4 border border-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{n.title}</h3>
                  {n.is_important && <span className="text-sm text-destructive">Important</span>}
                </div>
                <p className="text-sm text-muted-foreground">{n.category} • {new Date(n.date).toLocaleString()}</p>
                <p className="mt-2">{n.description}</p>
              </div>
              {isAdmin && (
                <div className="flex flex-col items-end gap-2">
                  <Button variant="ghost" onClick={() => handleEdit(n)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(n.id)}>Delete</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNews;