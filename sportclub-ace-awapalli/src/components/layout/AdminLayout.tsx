import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, LayoutDashboard, CalendarDays, Users, QrCode, 
  LogOut, Menu, X, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sb } from '@/lib/supabase';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Matches', path: '/admin/matches', icon: CalendarDays },
  { name: 'Registrations', path: '/admin/registrations', icon: Users },
  { name: 'QR Code', path: '/admin/qr', icon: QrCode },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await sb.auth.getUser();
        setUserEmail(data?.user?.email ?? '');
      } catch {
        setUserEmail('');
      }
    })();
  }, []);

  const isAdmin = adminEmail !== '' && userEmail === adminEmail;

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl text-foreground leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Sport Club Awapalli</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
            {isAdmin && (
              <li>
                <Link
                  to="/admin/news"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <span className="font-medium">News</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 transform transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="p-4 flex justify-end">
          <button onClick={() => setSidebarOpen(false)} className="text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-6 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl text-foreground leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Sport Club Awapalli</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
            {isAdmin && (
              <li>
                <Link
                  to="/admin/news"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <span className="font-medium">News</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-border p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg">Admin Panel</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
