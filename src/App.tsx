
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import SearchPage from "./pages/SearchPage";
import MessagesPage from "./pages/MessagesPage";
import BookingsPage from "./pages/BookingsPage";
import FollowingPage from "./pages/FollowingPage";
import EventsPage from "./pages/EventsPage";
import ServicesPage from "./pages/ServicesPage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import CustomerLogin from "./components/CustomerLogin";
import DaddyLogin from "./components/DaddyLogin";
import WorkerLogin from "./components/WorkerLogin";
import SuperAdminLogin from "./components/SuperAdminLogin";




const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/login/customer" element={<CustomerLogin />} />
            <Route path="/login/daddy" element={<DaddyLogin />} />
            <Route path="/login/worker" element={<WorkerLogin />} />
            <Route path="/login/super-admin" element={<SuperAdminLogin />} />



            <Route path="/feed" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />

            <Route path="/worker-dashboard" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
