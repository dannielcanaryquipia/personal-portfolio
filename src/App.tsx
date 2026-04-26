import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { ProtectedAdminRoute } from '@/components/common/ProtectedAdminRoute/ProtectedAdminRoute';
import { PageLoader } from '@/components/common/PageLoader/PageLoader';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const Projects = lazy(() => import('@/pages/Projects'));
const Certificates = lazy(() => import('@/pages/Certificates'));
const Contact = lazy(() => import('@/pages/Contact'));
const Login = lazy(() => import('@/pages/admin/Login'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('@/pages/admin/Projects'));
const AdminCertificates = lazy(() => import('@/pages/admin/Certificates'));
const Status = lazy(() => import('@/pages/admin/Status'));
const Messages = lazy(() => import('@/pages/admin/Messages'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const AdminFeatures = lazy(() => import('@/pages/admin/Features'));
const Unauthorized = lazy(() => import('@/pages/admin/Unauthorized'));

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
            <Route path="/certificates" element={<MainLayout><Certificates /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/projects" element={<ProtectedAdminRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/certificates" element={<ProtectedAdminRoute><AdminLayout><AdminCertificates /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/status" element={<ProtectedAdminRoute><AdminLayout><Status /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/messages" element={<ProtectedAdminRoute><AdminLayout><Messages /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/features" element={<ProtectedAdminRoute><AdminLayout><AdminFeatures /></AdminLayout></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminLayout><Settings /></AdminLayout></ProtectedAdminRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
