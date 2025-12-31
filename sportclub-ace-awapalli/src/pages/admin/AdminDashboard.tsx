import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { mockStats, mockMatches, mockRegistrations } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [matches, setMatches] = useState<typeof mockMatches>(mockMatches);
  const [registrations, setRegistrations] = useState<typeof mockRegistrations>(mockRegistrations);
  const sb = supabase as unknown as SupabaseClient;

  useEffect(() => {
    fetchMatches();
    fetchRegistrations();
  }, []);

  async function fetchMatches() {
    try {
      const { data, error } = await sb.from('matches').select('*').order('date', { ascending: true });
      if (error) throw error;
      if (data && Array.isArray(data)) {
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
        }));
        setMatches(mapped);
      } else {
        setMatches(mockMatches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      toast({ title: 'Fetch Error', description: 'Could not load matches.', variant: 'destructive' });
      setMatches(mockMatches);
    }
  }

  async function fetchRegistrations() {
    try {
      const { data, error } = await sb.from('registrations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && Array.isArray(data)) {
        const mapped = (data as any[]).map((r) => ({
          id: r.id,
          matchId: r.match_id,
          matchName: r.match_name,
          teamName: r.team_name,
          captainName: r.captain_name,
          contact: r.contact,
          sport: r.sport,
          players: Array.isArray(r.players) ? r.players : JSON.parse(r.players || '[]'),
          screenshotUrl: r.screenshot_url,
          paymentStatus: r.payment_status,
          createdAt: r.created_at,
        }));
        setRegistrations(mapped);
      } else {
        setRegistrations(mockRegistrations);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      toast({ title: 'Fetch Error', description: 'Could not load registrations.', variant: 'destructive' });
      setRegistrations(mockRegistrations);
    }
  }

  const recentRegistrations = registrations.slice(0, 5);
  const upcomingMatches = matches.filter(m => m.registrationStatus === 'open').slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your club activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard icon={CalendarDays} value={matches.length || mockStats.totalMatches} label="Total Matches" index={0} />
          <StatsCard icon={Users} value={registrations.length || mockStats.totalRegistrations} label="Registrations" index={1} />
          <StatsCard icon={Clock} value={registrations.filter(r => r.paymentStatus === 'pending').length || mockStats.pendingPayments} label="Pending Payments" index={2} />
          <StatsCard icon={CheckCircle} value={registrations.filter(r => r.paymentStatus === 'approved').length || mockStats.approvedTeams} label="Approved Teams" index={3} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Registrations
              </h2>
            </div>
            <div className="divide-y divide-border">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{reg.teamName}</p>
                    <p className="text-sm text-muted-foreground">{reg.matchName}</p>
                  </div>
                  <Badge
                    className={
                      reg.paymentStatus === 'approved'
                        ? 'bg-success/10 text-success border-success/30'
                        : reg.paymentStatus === 'pending'
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-destructive/10 text-destructive border-destructive/30'
                    }
                  >
                    {reg.paymentStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Upcoming Matches
              </h2>
            </div>
            <div className="divide-y divide-border">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{match.name}</p>
                      <p className="text-sm text-muted-foreground">{match.sport} • {match.location}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      {match.paidFree}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary">
                    {new Date(match.date).toLocaleDateString('en-IN', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {match.time}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-card rounded-xl border border-border p-6"
        >
          <h2 className="font-heading text-xl text-foreground mb-6">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-heading text-primary">{matches.filter(m => m.registrationStatus === 'open').length}</p>
              <p className="text-sm text-muted-foreground">Open Registrations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading text-success">{registrations.filter(r => r.paymentStatus === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Approved Teams</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading text-warning">{registrations.filter(r => r.paymentStatus === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading text-foreground">{matches.filter(m => m.paidFree === 'paid').length}</p>
              <p className="text-sm text-muted-foreground">Paid Matches</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;