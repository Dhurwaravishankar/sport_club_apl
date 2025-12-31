import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockQrCodeUrl } from '@/lib/mockData';
import { Match, Player } from '@/types';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

const Registration = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    contact: '',
  });

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '' }
  ]);

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  // Load latest QR code (set by AdminQR) from localStorage so users see updated QR
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatch() {
      if (!matchId) return;
      const sb = supabase as unknown as SupabaseClient;
      try {
        const { data, error } = await sb.from('matches').select('*').eq('id', matchId).single();
        if (error) throw error;
        if (data) {
          const mapped: Match = {
            id: data.id,
            name: data.name,
            sport: data.sport,
            date: data.date,
            time: data.time,
            location: data.location,
            prize: data.prize,
            paidFree: data.paid_free ?? data.paidFree,
            registrationStatus: data.registration_status ?? data.registrationStatus,
            image: data.image,
            entryFee: data.entry_fee ?? data.entryFee,
            qrCodeUrl: data.qr_code_url ?? data.qrCodeUrl,
          };
          setMatch(mapped);
        }
      } catch (err) {
        console.error('Error loading match:', err);
        toast({ title: 'Load Error', description: 'Could not load match. Showing fallback.', variant: 'destructive' });
      }
    }
    loadMatch();
  }, [matchId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('qrCodeUrl');
      if (stored) setQrCodeUrl(stored);
    } catch (e) {
      // ignore localStorage errors (e.g., SSR or disabled)
      console.error('Could not read qrCodeUrl from localStorage', e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlayerChange = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const addPlayer = () => {
    setPlayers([...players, { id: Date.now().toString(), name: '' }]);
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.teamName || !formData.captainName || !formData.contact) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const filledPlayers = players.filter(p => p.name.trim());
    if (filledPlayers.length === 0) {
      toast({
        title: 'Missing Players',
        description: 'Please add at least one player.',
        variant: 'destructive'
      });
      return;
    }

    if (match?.paidFree === 'paid' && !screenshot) {
      toast({
        title: 'Payment Screenshot Required',
        description: 'Please upload your payment screenshot.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Insert registration into Supabase
    try {
      const sb = supabase as unknown as SupabaseClient;
      const regId = typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Date.now().toString();
      const payload: any = {
        id: regId,
        match_id: matchId,
        match_name: match?.name,
        team_name: formData.teamName,
        captain_name: formData.captainName,
        contact: formData.contact,
        sport: match?.sport,
        players: JSON.stringify(filledPlayers),
        screenshot_url: screenshotPreview || null,
        payment_status: match?.paidFree === 'paid' ? 'pending' : 'approved',
        status: match?.paidFree === 'paid' ? 'pending' : 'approved',
      };

      const { data, error } = await sb.from('registrations').insert([payload]).select();
      if (error) throw error;

      setIsSubmitting(false);
      setSubmitted(true);

      toast({
        title: 'Registration Successful!',
        description: match?.paidFree === 'paid' 
          ? 'Your registration is pending payment approval.' 
          : 'Your team has been registered successfully.',
      });
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Error creating registration:', err);
      toast({ title: 'Registration Error', description: err?.message || 'Could not submit registration.', variant: 'destructive' });
    }
  };

  if (!match) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">Match Not Found</h2>
            <p className="text-muted-foreground mb-6">The match you're looking for doesn't exist.</p>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (match.registrationStatus === 'closed') {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">Registration Closed</h2>
            <p className="text-muted-foreground mb-6">Registration for this match has been closed.</p>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
            <h2 className="font-heading text-3xl text-foreground mb-4">Registration Complete!</h2>
            {match.paidFree === 'paid' ? (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
                <p className="text-warning font-semibold">Payment Pending Approval</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Your registration will be confirmed once the admin approves your payment. Entry Fee: {match.entryFee || 'N/A'}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-6">
                Your team has been successfully registered for {match.name}. Entry Fee: {match.entryFee || 'Free'}
              </p>
            )}
            <Button variant="hero" onClick={() => navigate('/matches')}>
              Back to Matches
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/matches')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>

            {/* Match Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-card rounded-xl p-6 border border-border mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">
                    {match.sport}
                  </Badge>
                  <h1 className="font-heading text-3xl text-foreground">{match.name}</h1>
                </div>
                <Badge className={match.paidFree === 'paid' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}>
                  {match.paidFree === 'paid' ? 'Paid Entry' : 'Free Entry'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {new Date(match.date).toLocaleDateString('en-IN', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {match.time}
              </p>
              <p className="text-muted-foreground">{match.location}</p>
              <p className="text-primary font-semibold mt-2">Prize: {match.prize}</p>
            </motion.div>

            {/* Registration Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Team Details */}
              <div className="bg-gradient-card rounded-xl p-6 border border-border">
                <h2 className="font-heading text-xl text-foreground mb-6">Team Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      placeholder="Enter your team name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="captainName">Captain Name *</Label>
                    <Input
                      id="captainName"
                      name="captainName"
                      value={formData.captainName}
                      onChange={handleInputChange}
                      placeholder="Enter captain's full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      name="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Enter contact number"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="bg-gradient-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl text-foreground">Players</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addPlayer}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Player
                  </Button>
                </div>

                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex gap-3">
                      <Input
                        value={player.name}
                        onChange={(e) => handlePlayerChange(player.id, e.target.value)}
                        placeholder={`Player ${index + 1} name`}
                        className="flex-1"
                      />
                      {players.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(player.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section - Only for paid matches */}
              {match.paidFree === 'paid' && (
                <div className="bg-gradient-card rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground">Entry Fee: <strong>{match.entryFee || '—'}</strong></p>

                  {/* show admin-provided image in place of QR */}
                  {match.image ? (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Payment Image (scan / pay):</p>
                      <img src={match.image} alt="Payment image" className="mx-auto w-48 h-48 object-contain rounded-md" />
                    </div>
                  ) : (
                    /* optional fallback if you used qr_code_url previously */
                    null
                  )}

                  {/* Screenshot upload UI remains unchanged */}
                  <div className="mt-4">
                    <label htmlFor="screenshot" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Screenshot preview" className="h-full object-contain rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground text-sm">Click to upload screenshot</p>
                        </div>
                      )}
                      <input id="screenshot" type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Register Team'}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Registration;