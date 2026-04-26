import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute/ProtectedRoute';
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
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/certificates" element={<ProtectedRoute><AdminLayout><AdminCertificates /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/status" element={<ProtectedRoute><AdminLayout><Status /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><Messages /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/features" element={<ProtectedRoute><AdminLayout><AdminFeatures /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
