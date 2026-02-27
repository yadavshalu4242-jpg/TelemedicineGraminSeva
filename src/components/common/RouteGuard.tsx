import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

// Public routes that can be accessed without logging in
const PUBLIC_ROUTES = ['/login', '/register', '/403', '/404', '/'];

// Role-based route restrictions
const ROLE_ROUTES = {
  admin: ['/admin'],
  doctor: ['/doctor'],
  patient: ['/patient'],
};

function matchPublicRoute(path: string, patterns: string[]) {
  return patterns.some((pattern) => {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regex.test(path);
    }
    return path === pattern || path.startsWith(pattern);
  });
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const isPublic = matchPublicRoute(location.pathname, PUBLIC_ROUTES);

    // Redirect to login if not authenticated and trying to access protected route
    if (!user && !isPublic) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
      return;
    }

    // Check role-based access
    if (user && profile) {
      const path = location.pathname;

      // Admin can access everything
      if (profile.role === 'admin') {
        return;
      }

      // Check if trying to access admin routes without admin role
      if (path.startsWith('/admin')) {
        navigate('/403', { replace: true });
        return;
      }

      // Check if trying to access doctor routes without doctor role
      if (path.startsWith('/doctor') && profile.role !== 'doctor') {
        navigate('/403', { replace: true });
        return;
      }

      // Check if trying to access patient routes without patient role
      if (path.startsWith('/patient') && profile.role !== 'patient') {
        navigate('/403', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}