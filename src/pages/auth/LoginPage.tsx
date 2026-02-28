import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Floating3D from '@/components/common/Floating3D';
import { toast } from 'sonner';
import { Activity, Stethoscope, User, UserCog, Users } from 'lucide-react';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithUsername, signUpWithUsername, signOut } = useAuth();
  const { t } = useLanguage();

  // explicitly type the form data so role can be tracked and changed
  type LoginData = { username: string; password: string; role?: UserRole };
  type RegisterData = { username: string; password: string; fullName: string; role: UserRole };

  const [loginData, setLoginData] = useState<LoginData>({ username: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    password: '',
    fullName: '',
    // default role is patient but user can switch to doctor or admin via select
    role: 'patient',
  });
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, role, approved } = await signInWithUsername(loginData.username, loginData.password);

      if (error) {
        toast.error(t('auth.loginError'));
        console.error('Login error:', error);
      } else if (role === 'doctor' && approved === false) {
        // immediately sign the user out if their account isn't approved
        toast.error(t('auth.pendingApproval'));
        await signOut();
        // navigate back to login to avoid showing dashboard briefly
        navigate('/login', { replace: true });
      } else {
        toast.success(t('auth.loginSuccess'));
        // Navigate based on role
        const targetPath = role === 'admin' ? '/admin' : `/${role || 'patient'}`;
        navigate(from === '/' || from === '/login' ? targetPath : from, { replace: true });
      }
    } catch (error) {
      toast.error(t('auth.loginError'));
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, role } = await signUpWithUsername(
        registerData.username,
        registerData.password,
        registerData.fullName,
        registerData.role
      );

      if (error) {
        toast.error(t('auth.registerError'));
        console.error('Register error:', error);
      } else {
        if (registerData.role === 'doctor') {
          // doctor needs admin approval before login
          toast.success(t('auth.awaitingApproval'));
          setTimeout(() => navigate('/login', { replace: true }), 1500);
        } else {
          // auto-login every non-doctor user immediately
          toast.success('Registration successful!');
          const loginResult = await signInWithUsername(registerData.username, registerData.password);
          if (loginResult.error) {
            toast.error('Registration successful! Please log in manually.');
            setTimeout(() => navigate('/login', { replace: true }), 1500);
          } else {
            toast.success('Logged in successfully!');
            const targetPath = (loginResult.role || role) === 'admin' ? '/admin' : `/${loginResult.role || role || 'patient'}`;
            navigate(targetPath, { replace: true });
          }
        }
      }
    } catch (error) {
      toast.error(t('auth.registerError'));
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-main">
      <Floating3D />

      {/* Background Hero Image with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-illustration.svg"
          alt="background"
          className="w-full h-full object-cover opacity-[0.03]"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-animated-pattern" />
      </div>

      {/* Header with glass effect */}
      <header className="border-b bg-card/60 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-mark.svg" alt="Gramin Seva" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Auth Forms in Glass Card */}
          <div className="order-2 md:order-1">
            <div className="glass-card p-6 md:p-8 relative overflow-hidden">
              {/* Subtle shine effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                  <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="mt-4">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl font-bold gradient-text">{t('auth.login')}</CardTitle>
                      <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                      <CardContent className="space-y-4 px-0">
                        <div className="space-y-2">
                          <Label htmlFor="login-username">{t('auth.username')}</Label>
                          <Input
                            id="login-username"
                            type="text"
                            placeholder="Enter username"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">{t('auth.password')}</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            required
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="px-0">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? t('common.loading') : t('auth.loginButton')}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="mt-4">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl font-bold gradient-text">{t('auth.register')}</CardTitle>
                      <CardDescription>
                        Create a new account to get started. Choose <strong>Patient</strong>, <strong>Doctor</strong>, or <strong>Admin</strong> role based on your needs.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                      <CardContent className="space-y-4 px-0">
                        <div className="space-y-2">
                          <Label htmlFor="register-fullname">{t('auth.fullName')}</Label>
                          <Input
                            id="register-fullname"
                            type="text"
                            placeholder="Enter full name"
                            value={registerData.fullName}
                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-username">{t('auth.username')}</Label>
                          <Input
                            id="register-username"
                            type="text"
                            placeholder="Choose username (letters, numbers, underscore only)"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            pattern="[a-zA-Z0-9_]+"
                            required
                          />
                          <p className="text-xs text-muted-foreground">Only letters, numbers, and underscore allowed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">{t('auth.password')}</Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Choose password (min 6 characters)"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            minLength={6}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-role">I am a</Label>
                          <Select
                            value={registerData.role}
                            onValueChange={(value: UserRole) => setRegisterData({ ...registerData, role: value })}
                          >
                            <SelectTrigger id="register-role">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="patient">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Patient - Seeking medical care</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="doctor">
                                <div className="flex items-center gap-2">
                                  <UserCog className="h-4 w-4" />
                                  <span>Doctor - Healthcare provider</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>Admin - Platform administrator</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {registerData.role === 'doctor' && 'Note: Doctor accounts require admin approval.'}
                            {registerData.role === 'admin' && (
                              <>
                                Admin accounts are restricted — your request will be reviewed. Contact support for fast approval.
                              </>
                            )}
                            {registerData.role === 'patient' && 'You can book consultations and access health services.'}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="px-0">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? t('common.loading') : t('auth.registerButton')}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Features */}
              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-2 shadow-sm">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">AI Diagnosis</p>
                </div>
                <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-2 shadow-sm">
                    <Activity className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Voice Call</p>
                </div>
                <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-2 shadow-sm">
                    <img src="/images/logo-mark.svg" alt="logo" className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Decorative Image (Hidden on mobile) */}
          <div className="hidden md:block relative order-1 md:order-2">
            <div className="relative">
              <img
                src="/images/hero-illustration.svg"
                alt="Healthcare illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 float-medium">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Online 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/60 backdrop-blur-md py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {t('app.name')}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
