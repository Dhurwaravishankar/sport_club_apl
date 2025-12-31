import { Match } from '@/types';
import { Calendar, Clock, MapPin, Trophy, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: Match;
  index?: number;
}

export const MatchCard = ({ match, index = 0 }: MatchCardProps) => {
  const isOpen = match.registrationStatus === 'open';
  const isPaid = match.paidFree === 'paid';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-card group"
    >
      {/* Sport Badge */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/30 font-semibold"
          >
            {match.sport}
          </Badge>
          <div className="flex gap-2">
            <Badge
              variant={isPaid ? 'default' : 'secondary'}
              className={isPaid ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}
            >
              {isPaid ? 'Paid' : 'Free'}
            </Badge>
            <Badge
              variant={isOpen ? 'default' : 'destructive'}
              className={isOpen ? 'bg-success text-success-foreground' : ''}
            >
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>

        <h3 className="font-heading text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
          {match.name}
        </h3>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(match.date).toLocaleDateString('en-IN', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-primary" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Prize: {match.prize}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-6 pb-6">
        <Link to={isOpen ? `/register/${match.id}` : '#'}>
          <Button
            variant={isOpen ? 'hero' : 'secondary'}
            className="w-full"
            disabled={!isOpen}
          >
            {isOpen ? 'Register Team' : 'Registration Closed'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
