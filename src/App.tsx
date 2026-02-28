import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import Floating3D from '@/components/common/Floating3D';

import routes from './routes';

const generateTitleGradient = (title: string) => {
  const seed = Array.from(title).reduce((s, ch) => s + ch.charCodeAt(0), 0) % 20;
  const lightnessAdj = 40 + (seed % 10);
  const blue = `hsl(210 80% ${Math.max(30, lightnessAdj - 8)}%)`;
  const green = `hsl(150 60% ${Math.min(70, lightnessAdj + 6)}%)`;
  return `linear-gradient(135deg, ${blue} 0%, ${green} 60%), 
    radial-gradient(circle at 80% 20%, rgba(77, 184, 168, 0.08), transparent 50%), 
    radial-gradient(circle at 20% 80%, rgba(27, 95, 153, 0.06), transparent 50%)`;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const gradient = useMemo(() => {
    const title = location.pathname.split('/').filter(Boolean)[0] || 'home';
    return generateTitleGradient(title);
  }, [location.pathname]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: gradient,
        backgroundAttachment: 'fixed',
      }}
    >
      <RouteGuard>
        <IntersectObserver />
        <Floating3D />
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
        </div>
        <Toaster />
      </RouteGuard>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
