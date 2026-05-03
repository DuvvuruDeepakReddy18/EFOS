import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useAuthStore();

  return (
    <div className="min-h-screen bg-bg-primary grid-bg flex overflow-x-hidden">
      <Sidebar />
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 w-full ${
          sidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2332',
            color: '#F9FAFB',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
