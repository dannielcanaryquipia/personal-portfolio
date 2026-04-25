import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { Home } from '@/pages/Home';
import { Projects } from '@/pages/Projects';
import { Certificates } from '@/pages/Certificates';
import { Contact } from '@/pages/Contact';
import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { AdminProjects } from '@/pages/admin/Projects';
import { AdminCertificates } from '@/pages/admin/Certificates';
import { Status } from '@/pages/admin/Status';
import { Messages } from '@/pages/admin/Messages';
import { Settings } from '@/pages/admin/Settings';
import { AdminFeatures } from '@/pages/admin/Features';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
          <Route path="/certificates" element={<MainLayout><Certificates /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/admin/certificates" element={<AdminLayout><AdminCertificates /></AdminLayout>} />
          <Route path="/admin/status" element={<AdminLayout><Status /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><Messages /></AdminLayout>} />
          <Route path="/admin/features" element={<AdminLayout><AdminFeatures /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
