import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Matches from "./pages/Matches";
import Registration from "./pages/Registration";
import Achievements from "./pages/Achievements";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminNews from "./pages/admin/AdminNews"
import AdminQR from "./pages/admin/AdminQR";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            
            <Route path="/" element={<Home />} />
             <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/register/:matchId" element={<Registration />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
            <Route path="/admin/registrations" element={<AdminRegistrations />} />
            <Route path="/admin/qr" element={<AdminQR />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;