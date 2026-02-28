import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Floating3D from '@/components/common/Floating3D';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  FolderOpen,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  Users,
  UserCog,
  Activity,
  Camera,
} from 'lucide-react';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: t('nav.dashboard'), path: `/${profile?.role}` },
      { icon: Calendar, label: t('nav.consultations'), path: `/${profile?.role}/consultations` },
      { icon: MessageSquare, label: t('nav.aiChat'), path: `/${profile?.role}/ai-chat` },
      { icon: Activity, label: 'Symptoms Checker', path: `/${profile?.role}/symptoms` },
      { icon: Camera, label: 'AR Diagnosis', path: `/${profile?.role}/ar-diagnosis` },
      { icon: FileText, label: t('nav.prescriptions'), path: `/${profile?.role}/prescriptions` },
      { icon: FolderOpen, label: t('nav.medicalRecords'), path: `/${profile?.role}/records` },
      { icon: User, label: t('nav.profile'), path: `/${profile?.role}/profile` },
    ];

    if (profile?.role === 'doctor') {
      baseItems.splice(1, 0, { icon: Users, label: t('nav.patients'), path: '/doctor/patients' });
    }

    if (profile?.role === 'admin') {
      baseItems.push(
        { icon: Users, label: t('nav.patients'), path: '/admin/patients' },
        { icon: UserCog, label: t('nav.doctors'), path: '/admin/doctors' },
        { icon: Settings, label: t('nav.settings'), path: '/admin/settings' }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b bg-gradient-to-b from-transparent to-muted/20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo-mark.svg" alt="Gramin Seva" className="h-10 w-10" />
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('app.name')}</h1>
            <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t bg-gradient-to-t from-transparent to-muted/20 space-y-2">
        <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border">
          <p className="text-sm font-medium text-foreground">{profile?.full_name || 'User'}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
        </div>
        <Button variant="outline" className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-main">
      <Floating3D />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-gradient-sidebar shrink-0">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-card/80 backdrop-blur-md p-4 flex items-center justify-between">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <img src="/images/logo-mark.svg" alt="Gramin Seva" className="h-8 w-8" />
            <h1 className="text-lg font-bold">{t('app.name')}</h1>
          </div>

          <LanguageSwitcher />
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex border-b bg-card/80 backdrop-blur-md p-4 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('dashboard.welcome')}, <span className="gradient-text">{profile?.full_name || 'User'}</span>!</h2>
            <p className="text-sm text-muted-foreground capitalize">{profile?.role} Dashboard</p>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="glass-card p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
