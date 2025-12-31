import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Award } from 'lucide-react';

const achievements = [
  {
    year: '2024',
    title: 'State Football Championship',
    team: 'Thunder FC',
    position: '1st Place',
    icon: Trophy,
  },
  {
    year: '2024',
    title: 'Regional Cricket Tournament',
    team: 'Royal Strikers XI',
    position: '1st Place',
    icon: Trophy,
  },
  {
    year: '2023',
    title: 'District Volleyball League',
    team: 'Spike Masters',
    position: '2nd Place',
    icon: Medal,
  },
  {
    year: '2023',
    title: 'Inter-Club Badminton Championship',
    team: 'Shuttle Stars',
    position: '1st Place',
    icon: Trophy,
  },
  {
    year: '2022',
    title: 'Youth Football Cup',
    team: 'Awapalli Young Guns',
    position: '1st Place',
    icon: Trophy,
  },
  {
    year: '2022',
    title: 'State Basketball Tournament',
    team: 'Hoop Dreams',
    position: '3rd Place',
    icon: Award,
  },
  {
    year: '2021',
    title: 'National Cricket League Qualifiers',
    team: 'Awapalli Warriors',
    position: '2nd Place',
    icon: Medal,
  },
  {
    year: '2020',
    title: 'Regional Football Championship',
    team: 'Awapalli United',
    position: '1st Place',
    icon: Trophy,
  },
];

const Achievements = () => {
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
              Our <span className="text-gradient">Achievements</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Celebrating years of sporting excellence and the champions we've nurtured
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Trophy, value: '25+', label: 'Championships Won' },
              { icon: Medal, value: '50+', label: 'Tournament Medals' },
              { icon: Star, value: '100+', label: 'Individual Awards' },
              { icon: Award, value: '15', label: 'Years of Excellence' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card rounded-xl p-6 border border-border text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-heading text-3xl text-foreground">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Hall of Fame"
            subtitle="Our teams have consistently achieved excellence across all sports"
          />

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
                      <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <span className="text-primary font-semibold">{achievement.year}</span>
                        <achievement.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl text-foreground mb-1">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.team}</p>
                      <p className="text-success font-semibold mt-2">{achievement.position}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 mt-6 shadow-glow" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Achievements;