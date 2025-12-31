import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockMatches } from '@/lib/mockData';
import { Match } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Calendar, Clock, MapPin, Trophy, 
  DollarSign, Users, Save, Upload
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdminMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Football',
    date: '',
    time: '',
    location: '',
    prize: '',
    paidFree: 'free' as 'paid' | 'free',
    registrationStatus: 'open' as 'open' | 'closed',
    entryFee: '',
    image: '',
  });
  // (per-match QR removed)
  // Image upload state (replaces QR upload)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // typed supabase client to avoid `any`
  const sb = supabase as unknown as SupabaseClient;
  const QR_BUCKET = (import.meta.env.VITE_SUPABASE_QR_BUCKET as string) || 'qr-codes';
  const IMAGE_BUCKET = (import.meta.env.VITE_SUPABASE_IMAGE_BUCKET as string) || (import.meta.env.VITE_SUPABASE_QR_BUCKET as string) || 'qr-codes';

  // Fetch matches from Supabase on mount
  useEffect(() => {
    fetchMatches();

    // Realtime subscription to keep admin UI in sync
    const channel = sb
      .channel('public:matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          try {
            const ev = payload.eventType;
            const pNew = (payload.new ?? undefined) as unknown as Match | undefined;
            const pOld = (payload.old ?? undefined) as unknown as Match | undefined;

            if (ev === 'INSERT' && pNew) {
              setMatches((prev) => {
                const exists = prev.some((m) => m.id === pNew.id);
                if (exists) return prev;
                return [...prev, pNew].sort((a, b) => a.date.localeCompare(b.date));
              });
            } else if (ev === 'UPDATE' && pNew) {
              setMatches((prev) => prev.map((m) => (m.id === pNew.id ? pNew : m)));
            } else if (ev === 'DELETE' && pOld) {
              setMatches((prev) => prev.filter((m) => m.id !== pOld.id));
            }
          } catch (err) {
            console.error('Realtime payload handling error:', err);
          }
        }
      )
      .subscribe();

    return () => {
      // cleanup subscription
      channel.unsubscribe();
    };
  }, []);

  async function fetchMatches() {
    try {
      const { data, error } = await sb.from('matches').select('*').order('date', { ascending: true });
      if (error) throw error;

      if (data && Array.isArray(data)) {
        // map DB snake_case -> frontend camelCase
        const mapped = (data as any[]).map((r) => ({
          id: r.id,
          name: r.name,
          sport: r.sport,
          date: r.date,
          time: r.time,
          location: r.location,
          prize: r.prize,
          paidFree: r.paid_free ?? r.paidFree,
          registrationStatus: r.registration_status ?? r.registrationStatus,
          image: r.image,
          entryFee: r.entry_fee,
        } as Match));
        setMatches(mapped);
      } else {
        // fallback to mock data
        setMatches(mockMatches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      toast({
        title: 'Fetch Error',
        description: 'Could not load matches from server. Showing local data.',
        variant: 'destructive',
      });
      setMatches(mockMatches);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sport: 'Football',
      date: '',
      time: '',
      location: '',
      prize: '',
      paidFree: 'free',
      registrationStatus: 'open',
      entryFee: '',
      image: '',
    });
    setEditingMatch(null);
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  const handleOpenDialog = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        name: match.name,
        sport: match.sport,
        date: match.date,
        time: match.time,
        location: match.location,
        prize: match.prize,
        paidFree: match.paidFree,
        registrationStatus: match.registrationStatus,
        entryFee: match.entryFee || '',
        image: match.image || '',
      });
      // show existing image as preview
      setImagePreview(match.image || null);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file (PNG/JPG).', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: 'File Too Large', description: 'Please select an image smaller than 5MB.', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const uploadImageToStorage = async (idForPath?: string) => {
    if (!imageFile) {
      console.warn('uploadImageToStorage called but imageFile is null');
      return null;
    }
    setIsUploadingImage(true);
    try {
      const bucket = IMAGE_BUCKET;
      const ext = (imageFile.name.split('.').pop() || 'png').replace(/[^\w.-]/g, '');
      const pathId = idForPath ?? (formData as any).id ?? (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()));
      const fileName = `${pathId}.${ext}`;
      const path = fileName; // stored at root of bucket; change if you prefer 'matches/<id>.<ext>'

      const { error: uploadErr } = await sb.storage.from(bucket).upload(path, imageFile, { upsert: true });
      if (uploadErr) {
        if ((uploadErr as any).status === 404) throw new Error(`Storage bucket '${bucket}' not found.`);
        if ((uploadErr as any).status === 401 || (uploadErr as any).status === 403) throw new Error('Upload unauthorized. Check env keys and bucket permissions.');
        console.error('upload error:', uploadErr);
        throw uploadErr;
      }

      const { data: urlData, error: urlErr } = sb.storage.from(bucket).getPublicUrl(path);
      if (urlErr) {
        console.error('getPublicUrl error:', urlErr);
        throw urlErr;
      }
      const publicUrl = (urlData as any)?.publicUrl ?? (urlData as any)?.publicURL ?? null;
      setUploadedImageUrl(publicUrl);
      return publicUrl;
    } catch (err: any) {
      console.error('Image upload error:', err);
      toast({ title: 'Upload Error', description: err?.message || 'Could not upload image.', variant: 'destructive' });
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.time || !formData.location || !formData.prize) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // upload image if selected and not uploaded yet
      let finalImageUrl = uploadedImageUrl ?? formData.image ?? null;
      if (imageFile && !finalImageUrl) {
        finalImageUrl = await uploadImageToStorage(editingMatch?.id);
      }

      if (editingMatch) {
        // Update existing match in Supabase
        const updates: any = {
          name: formData.name,
          sport: formData.sport,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          prize: formData.prize,
          paid_free: formData.paidFree,
          registration_status: formData.registrationStatus,
          entry_fee: formData.entryFee,
        };
        if (finalImageUrl) updates.image = finalImageUrl;

        const { data, error } = await sb.from('matches').update(updates).eq('id', editingMatch.id).select();
        if (error) {
          console.error('Supabase update error:', error);
          toast({ title: 'Update Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
          return;
        }

        console.log('Update response:', { data, error });
        // update local state so UI reflects changes immediately
        if (data && Array.isArray(data)) {
          setMatches(prev => prev.map(m => (m.id === data[0].id ? { ...(data[0] as any), // ensure camelCase mapping if needed
            paidFree: (data[0] as any).paid_free ?? (data[0] as any).paidFree,
            registrationStatus: (data[0] as any).registration_status ?? (data[0] as any).registrationStatus,
            entryFee: (data[0] as any).entry_fee ?? (data[0] as any).entryFee,
          } : m)));
        }

        toast({ title: 'Match Updated', description: 'The match has been updated successfully.' });
      } else {
        // Create new match in Supabase
        const newId = typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Date.now().toString();
        // upload before insert (so path can use id)
        let newImageUrl = finalImageUrl;
        if (imageFile && !newImageUrl) newImageUrl = await uploadImageToStorage(newId);

        const payload: any = {
          id: newId,
          name: formData.name,
          sport: formData.sport,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          prize: formData.prize,
          paid_free: formData.paidFree,
          registration_status: formData.registrationStatus,
          entry_fee: formData.entryFee,
        };
        if (newImageUrl) payload.image = newImageUrl;

        const { data, error } = await sb.from('matches').insert([payload]).select();
        if (error) {
          console.error('Supabase insert error:', error);
          toast({ title: 'Create Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
          return;
        }

        console.log('Insert response:', { data, error });
        // immediately append inserted match to local state (map DB fields -> frontend)
        if (data && Array.isArray(data)) {
          const inserted = (data as any[]).map(r => ({
            id: r.id,
            name: r.name,
            sport: r.sport,
            date: r.date,
            time: r.time,
            location: r.location,
            prize: r.prize,
            paidFree: r.paid_free ?? r.paidFree,
            registrationStatus: r.registration_status ?? r.registrationStatus,
            entryFee: r.entry_fee,
            image: r.image,
          } as Match));
          setMatches(prev => [...prev, ...inserted].sort((a,b) => a.date.localeCompare(b.date)));
        }

        toast({ title: 'Match Created', description: 'The new match has been created successfully.' });
      }

      await fetchMatches();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving match:', err);
      const message = err?.message || JSON.stringify(err);
      toast({
        title: 'Save Error',
        description: message || 'Could not save the match. Try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    try {
      const { data, error } = await sb.from('matches').delete().eq('id', id).select();
      if (error) {
        console.error('Supabase delete error:', error);
        toast({ title: 'Delete Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
        return;
      }

      toast({ title: 'Match Deleted', description: 'The match has been deleted successfully.' });
      await fetchMatches();
    } catch (err: any) {
      console.error('Error deleting match:', err);
      toast({
        title: 'Delete Error',
        description: err?.message || 'Could not delete the match. Try again later.',
        variant: 'destructive',
      });
    }
  };

  const toggleRegistration = async (id: string) => {
    const target = matches.find(m => m.id === id);
    if (!target) return;

    try {
      const newStatus = target.registrationStatus === 'open' ? 'closed' : 'open';
      const { data, error } = await sb.from('matches').update({ registration_status: newStatus }).eq('id', id).select();
      if (error) {
        console.error('Supabase update error:', error);
        toast({ title: 'Update Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
        return;
      }

      setMatches(matches.map(m => m.id === id ? { ...m, registrationStatus: newStatus } : m));
    } catch (err: any) {
      console.error('Error toggling registration:', err);
      toast({
        title: 'Update Error',
        description: 'Could not update registration status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl text-foreground mb-2">Match Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage tournament matches.</p>
          </div>
          <Button variant="hero" onClick={() => handleOpenDialog()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Match
          </Button>
        </div>

        {/* Matches Table */}
        <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold text-foreground">Image</th>
                  <th className="text-left p-4 font-semibold text-foreground">Match</th>
                  <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Date & Time</th>
                  <th className="text-left p-4 font-semibold text-foreground hidden lg:table-cell">Location</th>
                  <th className="text-left p-4 font-semibold text-foreground">Type</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-right p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {matches.map((match, index) => (
                    <motion.tr
                      key={match.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/20"
                    >
                      <td className="p-4">
                        {match.image ? (
                          <img src={match.image} alt={`${match.name} image`} className="w-16 h-12 object-cover rounded-md" />
                        ) : (
                          <div className="w-16 h-12 bg-muted/30 rounded-md" />
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-foreground">{match.name}</p>
                          <p className="text-sm text-muted-foreground">{match.sport} • {match.prize}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-foreground">{new Date(match.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-sm text-muted-foreground">{match.time}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground">
                        {match.location}
                      </td>
                      <td className="p-4">
                        <Badge className={match.paidFree === 'paid' ? 'bg-warning/10 text-warning border-warning/30' : 'bg-success/10 text-success border-success/30'}>
                          {match.paidFree}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={match.registrationStatus === 'open'}
                            onCheckedChange={() => toggleRegistration(match.id)}
                          />
                          <span className={`text-sm ${match.registrationStatus === 'open' ? 'text-success' : 'text-muted-foreground'}`}>
                            {match.registrationStatus === 'open' ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(match)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(match.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                {editingMatch ? 'Edit Match' : 'Create New Match'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Match Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter match name"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sport">Sport *</Label>
                  <Select
                    value={formData.sport}
                    onValueChange={(value) => setFormData({ ...formData, sport: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prize">Prize *</Label>
                  <Input
                    id="prize"
                    name="prize"
                    value={formData.prize}
                    onChange={handleInputChange}
                    placeholder="₹50,000"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="10:00 AM"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter venue location"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entry Type</Label>
                  <Select
                    value={formData.paidFree}
                    onValueChange={(value: 'paid' | 'free') => setFormData({ ...formData, paidFree: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Entry</SelectItem>
                      <SelectItem value="paid">Paid Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Registration</Label>
                  <Select
                    value={formData.registrationStatus}
                    onValueChange={(value: 'open' | 'closed') => setFormData({ ...formData, registrationStatus: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="entryFee">Entry Fee</Label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  placeholder="Enter entry fee"
                  className="mt-2"
                />
              </div>

              {/* Per-match QR removed */}

              <div>
                <Label>Match Image (optional)</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Image preview" className="h-full object-contain rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Click to select image</p>
                    </div>
                  )}
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {imageFile && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        const url = await uploadImageToStorage(editingMatch?.id);
                        if (url) {
                          setUploadedImageUrl(url);
                          setImagePreview(url);
                          setImageFile(null);
                          setFormData((f) => ({ ...f, image: url }));
                          toast({ title: 'Image Uploaded', description: 'Image uploaded and attached to the match.' });
                        }
                      }}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => { setImageFile(null); setImagePreview(null); setUploadedImageUrl(null); }}>
                      Remove
                    </Button>
                  </div>
                )}
                {uploadedImageUrl && (
                  <p className="text-sm text-muted-foreground mt-2">Uploaded URL: <a className="text-primary" href={uploadedImageUrl} target="_blank" rel="noreferrer">View</a></p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingMatch ? 'Update Match' : 'Create Match'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMatches;