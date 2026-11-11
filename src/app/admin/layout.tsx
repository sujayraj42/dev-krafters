import type { Metadata } from 'next';
import { AdminBodyMode } from './AdminBodyMode';

export const metadata: Metadata = {
  title: 'Admin Control Center | Dev Krafters',
  description: 'Dev Krafters Administrative Lead & Operations Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root-layout min-h-screen bg-surface text-primary">
      <AdminBodyMode />
      {children}
    </div>
  );
}
