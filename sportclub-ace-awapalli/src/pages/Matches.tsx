import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MatchCard } from '@/components/shared/MatchCard';
import { mockMatches } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Match } from '@/types';

const sportFilters = ['All', 'Football', 'Cricket', 'Volleyball', 'Badminton', 'Basketball'];

const Matches = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [matches, setMatches] = useState<Match[]>([]);
  const sb = supabase as unknown as SupabaseClient;

  useEffect(() => {
    fetchMatches();
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
          entryFee: r.entry_fee,   // added entry fee mapping
          image: r.image,
        } as Match));
        setMatches(mapped);
      } else setMatches(mockMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      toast({ title: 'Fetch Error', description: 'Could not load matches. Showing local data.', variant: 'destructive' });
      setMatches(mockMatches);
    }
  }

  const filteredMatches = activeFilter === 'All' ? matches : matches.filter(m => m.sport === activeFilter);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Upcoming <span className="text-gradient">Matches</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse our upcoming tournaments and register your team to compete for glory
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-lg bg-background/90">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {sportFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="min-w-[100px]"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No matches found for {activeFilter}. Check back later!
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Matches;