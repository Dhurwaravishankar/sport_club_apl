import { Link } from 'react-router-dom';
import { Trophy, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-foreground leading-none">Sport Club</h3>
                <p className="text-xs text-primary font-semibold tracking-widest">AWAPALLI</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fostering athletic excellence and community spirit since 2010. Join us in celebrating the power of sports.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Matches', 'Achievements', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Sport Club Awapalli, Main Road , Awapalli , District - Bijapur, State - CG
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground text-sm">+91 7647947048, +917828929988</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground text-sm">info@sportclubawapalli.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-6">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 Sport Club Awapalli. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
};
