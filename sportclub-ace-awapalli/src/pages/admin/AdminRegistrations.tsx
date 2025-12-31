import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRegistrations } from '@/lib/mockData';
import { Registration } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Eye, X, Users, Phone, 
  Calendar, ImageIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const sb = supabase as unknown as SupabaseClient;

  // fetch registrations on mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    try {
      const { data, error } = await sb.from('registrations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && Array.isArray(data)) {
        const mapped = (data as any[]).map(r => ({
          id: r.id,
          matchId: r.match_id,
          matchName: r.match_name,
          teamName: r.team_name,
          captainName: r.captain_name,
          contact: r.contact,
          sport: r.sport,
          players: Array.isArray(r.players) ? r.players : (JSON.parse(r.players || '[]')),
          screenshotUrl: r.screenshot_url,
          paymentStatus: r.payment_status,
          createdAt: r.created_at,
        } as Registration));
        setRegistrations(mapped);
      } else {
        setRegistrations(mockRegistrations);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      toast({ title: 'Fetch Error', description: 'Could not load registrations. Showing local data.', variant: 'destructive' });
      setRegistrations(mockRegistrations);
    }
  }

  const filteredRegistrations = filterStatus === 'all'
    ? registrations
    : registrations.filter(r => r.paymentStatus === filterStatus);

  const handleApprove = async (id: string) => {
    try {
      const { data, error } = await sb.from('registrations').update({ payment_status: 'approved', status: 'approved' }).eq('id', id).select();
      if (error) {
        console.error('Approve error:', error);
        toast({ title: 'Approve Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
        return;
      }
      await fetchRegistrations();
      toast({ title: 'Registration Approved', description: 'The team registration has been approved.' });
      setSelectedReg(null);
    } catch (err) {
      console.error('Error approving registration:', err);
      toast({ title: 'Approve Error', description: 'Could not approve registration.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { data, error } = await sb.from('registrations').update({ payment_status: 'rejected', status: 'rejected' }).eq('id', id).select();
      if (error) {
        console.error('Reject error:', error);
        toast({ title: 'Reject Error', description: error.message || JSON.stringify(error), variant: 'destructive' });
        return;
      }
      await fetchRegistrations();
      toast({ title: 'Registration Rejected', description: 'The team registration has been rejected.', variant: 'destructive' });
      setSelectedReg(null);
    } catch (err) {
      console.error('Error rejecting registration:', err);
      toast({ title: 'Reject Error', description: 'Could not reject registration.', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl text-foreground mb-2">Registration Management</h1>
          <p className="text-muted-foreground">Review and manage team registrations.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilterStatus(status as typeof filterStatus)}
              className="capitalize"
            >
              {status}
              {status !== 'all' && (
                <span className="ml-2 bg-background/20 px-2 py-0.5 rounded text-xs">
                  {registrations.filter(r => r.paymentStatus === status).length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Registrations Table */}
        <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold text-foreground">Team</th>
                  <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Match</th>
                  <th className="text-left p-4 font-semibold text-foreground hidden lg:table-cell">Captain</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-right p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRegistrations.map((reg, index) => (
                    <motion.tr
                      key={reg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/20"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-foreground">{reg.teamName}</p>
                          <p className="text-sm text-muted-foreground">{reg.sport} • {reg.players.length} players</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">
                        {reg.matchName}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p className="text-foreground">{reg.captainName}</p>
                        <p className="text-sm text-muted-foreground">{reg.contact}</p>
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedReg(reg)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reg.paymentStatus === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-success hover:bg-success/10"
                                onClick={() => handleApprove(reg.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleReject(reg.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No registrations found.
            </div>
          )}
        </div>

        {/* View Details Dialog */}
        <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                Registration Details
              </DialogTitle>
            </DialogHeader>

            {selectedReg && (
              <div className="space-y-6 mt-4">
                {/* Team Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Team Name</p>
                      <p className="font-semibold text-foreground">{selectedReg.teamName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sport</p>
                      <p className="font-semibold text-foreground">{selectedReg.sport}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Captain</p>
                      <p className="font-semibold text-foreground">{selectedReg.captainName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-semibold text-foreground">{selectedReg.contact}</p>
                    </div>
                  </div>
                </div>

                {/* Match Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Match
                  </h3>
                  <p className="text-foreground">{selectedReg.matchName}</p>
                </div>

                {/* Players */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Players ({selectedReg.players.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReg.players.map((player) => (
                      <Badge key={player.id} variant="secondary">
                        {player.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Payment Screenshot */}
                {selectedReg.screenshotUrl && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Payment Screenshot
                    </h3>
                    <img
                      src={selectedReg.screenshotUrl}
                      alt="Payment screenshot"
                      className="w-full rounded-lg border border-border"
                    />
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge
                      className={
                        selectedReg.paymentStatus === 'approved'
                          ? 'bg-success/10 text-success border-success/30'
                          : selectedReg.paymentStatus === 'pending'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : 'bg-destructive/10 text-destructive border-destructive/30'
                      }
                    >
                      {selectedReg.paymentStatus}
                    </Badge>
                  </div>

                  {selectedReg.paymentStatus === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        onClick={() => {
                          handleApprove(selectedReg.id);
                          setSelectedReg(null);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedReg.id);
                          setSelectedReg(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRegistrations;