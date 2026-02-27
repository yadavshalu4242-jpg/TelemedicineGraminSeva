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
import { toast } from 'sonner';
import { Activity, Heart, Stethoscope, User, UserCog } from 'lucide-react';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const { t } = useLanguage();

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    password: '', 
    fullName: '',
    role: 'patient' as UserRole 
  });
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInWithUsername(loginData.username, loginData.password);

      if (error) {
        toast.error(t('auth.loginError'));
        console.error('Login error:', error);
      } else {
        toast.success(t('auth.loginSuccess'));
        // Navigate based on role will be handled by RouteGuard
        navigate(from === '/' || from === '/login' ? '/patient' : from, { replace: true });
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
      const { error } = await signUpWithUsername(
        registerData.username, 
        registerData.password, 
        registerData.fullName
      );

      if (error) {
        toast.error(t('auth.registerError'));
        console.error('Register error:', error);
      } else {
        toast.success(t('auth.registerSuccess'));
        // After registration, navigate to appropriate dashboard
        const targetPath = registerData.role === 'patient' ? '/patient' : '/doctor';
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      toast.error(t('auth.registerError'));
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>{t('auth.login')}</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
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
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? t('common.loading') : t('auth.loginButton')}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>{t('auth.register')}</CardTitle>
                  <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
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
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {registerData.role === 'doctor' 
                          ? 'Note: Doctor accounts require admin approval' 
                          : 'You can book consultations and access health services'}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? t('common.loading') : t('auth.registerButton')}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">AI Diagnosis</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Voice Consultation</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {t('app.name')}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
