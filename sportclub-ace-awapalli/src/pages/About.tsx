import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Award, Target, Heart, Star, Zap } from 'lucide-react';

const About = () => {
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
              About <span className="text-gradient">Our Club</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Building champions and fostering community spirit through the power of sports since 2010.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
                Our Story
              </h2>
              <div className="h-1 w-24 bg-gradient-primary rounded-full mb-8" />
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Sport Club Awapalli was founded in 2010 with a simple mission: to provide a platform 
                for local athletes to compete, grow, and excel in their chosen sports. What started 
                as a small community initiative has now grown into one of the region's most 
                respected sports organizations.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Over the years, we have organized hundreds of tournaments across multiple sports, 
                from football and cricket to volleyball and badminton. Our commitment to excellence, 
                fair play, and community development has made us a cornerstone of athletic culture 
                in Awapalli.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <StatsCard icon={Trophy} value="50+" label="Tournaments" index={0} />
              <StatsCard icon={Users} value="500+" label="Athletes" index={1} />
              <StatsCard icon={Calendar} value="15" label="Years Active" index={2} />
              <StatsCard icon={Award} value="200+" label="Champions" index={3} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Values"
            subtitle="The principles that guide everything we do"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Star,
                title: 'Excellence',
                description: 'We strive for the highest standards in everything we do.'
              },
              {
                icon: Heart,
                title: 'Integrity',
                description: 'Fair play and honesty are at the core of our competitions.'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'We believe in the power of sports to bring people together.'
              },
              {
                icon: Zap,
                title: 'Passion',
                description: 'Our love for sports drives us to create exceptional experiences.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-card rounded-2xl p-8 md:p-12 border border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-heading text-3xl text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To promote athletic excellence and healthy competition while fostering a sense of 
                community and sportsmanship. We aim to provide accessible, well-organized sporting 
                events that inspire participants to push their limits and achieve their personal best. 
                Through our tournaments and programs, we strive to develop not just skilled athletes, 
                but responsible citizens who embody the values of discipline, teamwork, and respect.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Leadership Team"
            subtitle="Meet the dedicated individuals who make it all happen"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Rajesh Kumar', role: 'President', initial: 'RK' },
              { name: 'Priya Sharma', role: 'Secretary', initial: 'PS' },
              { name: 'Vikram Singh', role: 'Sports Director', initial: 'VS' }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card rounded-xl p-6 border border-border text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow ">
                  <span className="font-heading text-2xl text-primary-foreground">{member.initial}</span>
                </div>
                <h3 className="font-heading text-xl text-foreground mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;