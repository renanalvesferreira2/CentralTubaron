import { useState } from 'react';
import { AppLayout } from './layouts/AppLayout.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { AiPage } from './pages/AiPage.jsx';
import { BillingPage } from './pages/BillingPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SupportPage } from './pages/SupportPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const pages = {
  dashboard: DashboardPage,
  billing: BillingPage,
  support: SupportPage,
  ai: AiPage,
  admin: AdminPage
};

export function App() {
  const { signedIn } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!signedIn) return <LoginPage />;

  const Page = pages[page] || DashboardPage;

  return (
    <AppLayout page={page} setPage={setPage}>
      <Page />
    </AppLayout>
  );
}
