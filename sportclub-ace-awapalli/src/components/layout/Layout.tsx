import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// export const CustomNavbar = () => {
//   return (
//     <nav className="flex items-center gap-3">
//       {/* ...existing links... */}
//       <Link to="/news" className="px-3 py-2 rounded hover:bg-muted text-sm">
//         News
//       </Link>
//     </nav>
//   );
// };
