import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Matches', path: '/matches' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'News', path: '/news' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo: keep icon on left for all sizes, show text only on sm+ */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-primary-foreground" />
            </div>
            {/* Desktop text only (hidden on mobile) */}
            <div className="hidden sm:block">
              <h1 className="font-heading text-2xl text-foreground leading-none">Sport Club</h1>
              <p className="text-xs text-primary font-semibold tracking-widest">AWAPALLI</p>
            </div>
          </Link>

          {/* Centered text on Mobile (no icon) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:hidden pointer-events-none">
            <div className="text-center">
              <h1 className="font-heading text-base text-foreground leading-none">Sport Club</h1>
              <p className="text-[10px] text-primary font-semibold tracking-widest">AWAPALLI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/matches">
              <Button variant="hero" size="default">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/matches" onClick={() => setIsOpen(false)}>
                <Button variant="hero" size="lg" className="w-full mt-4">
                  Register Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
