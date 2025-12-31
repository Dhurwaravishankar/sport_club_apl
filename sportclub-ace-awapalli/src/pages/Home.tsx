import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { MatchCard } from '@/components/shared/MatchCard';
import { mockMatches } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Award, ArrowRight, Zap, Target, Medal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Match } from '@/types';
import BackgroundSlideshow from '@/components/shared/BackgroundSlideshow';

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const sb = supabase as unknown as SupabaseClient;

  useEffect(() => {
    let mounted = true;
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
          } as Match));
          if (mounted) setMatches(mapped);
          return;
        }
        if (mounted) setMatches(mockMatches);
      } catch (err) {
        console.error('Error fetching matches for Home:', err);
        toast({ title: 'Fetch Error', description: 'Could not load matches. Showing local data.', variant: 'destructive' });
        if (mounted) setMatches(mockMatches);
      }
    }
    fetchMatches();
    return () => { mounted = false; };
  }, []);

  const upcomingMatches = matches.filter(m => m.registrationStatus === 'open').slice(0, 3);

  const slides = [
    '/images/slide1.jpg',
    '/images/slide2.jpg',
    '/images/slide3.jpg',
    '/images/slide4.jpg',
    '/images/slide5.jpg',
    '/images/slide6.jpg',
    '/images/slide7.jpg',
    
    // add more: '/images/your-image.jpg'
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background slideshow (behind overlays and content) */}
        <BackgroundSlideshow images={slides} duration={6000} transitionMs={1000} />
         
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-background/70" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                  Season 2025 Registrations Open
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-none mb-6"
            >
              Sport Club
              <span className="block text-gradient">Awapalli</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Where champions are made. Join the most competitive sports tournaments 
              and unleash your athletic potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/matches">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  View Matches
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard icon={Trophy} value="50+" label="Tournaments" index={0} />
            <StatsCard icon={Users} value="500+" label="Athletes" index={1} />
            <StatsCard icon={Calendar} value="15" label="Years Active" index={2} />
            <StatsCard icon={Award} value="200+" label="Champions" index={3} />
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Upcoming Matches"
            subtitle="Register now for our exciting upcoming tournaments and compete for glory"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/matches">
              <Button variant="outline" size="lg">
                View All Matches
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Choose Us"
            subtitle="Experience world-class sports facilities and competitive tournaments"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Professional Venues',
                description: 'State-of-the-art sports facilities equipped with modern amenities for optimal performance.'
              },
              {
                icon: Medal,
                title: 'Competitive Prizes',
                description: 'Win exciting cash prizes and trophies. Our tournaments offer the best rewards in the region.'
              },
              {
                icon: Users,
                title: 'Community Spirit',
                description: 'Join a thriving community of athletes, coaches, and sports enthusiasts.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card rounded-xl p-8 border border-border hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Ready to Compete?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Don't miss your chance to be part of the action. Register your team today 
              and showcase your skills on the biggest stage.
            </p>
            <Link to="/matches">
              <Button variant="hero" size="lg">
                Register Your Team Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;