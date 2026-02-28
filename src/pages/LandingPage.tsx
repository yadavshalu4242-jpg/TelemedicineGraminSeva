
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Floating3D from '@/components/common/Floating3D';
import { MessageSquare, Video, Mic, QrCode, Wifi, Globe, Shield } from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Health Assistant',
      description: 'Get instant health advice powered by advanced AI technology',
    },
    {
      icon: Video,
      title: 'Video Consultations',
      description: 'Connect with doctors through high-quality video calls',
    },
    {
      icon: Mic,
      title: 'Voice Consultations',
      description: 'Speak naturally with voice-to-text and text-to-speech support',
    },
    {
      icon: QrCode,
      title: 'Digital Prescriptions',
      description: 'Secure QR code-based prescriptions for easy access',
    },
    {
      icon: Wifi,
      title: 'Offline Support',
      description: 'Access symptom checker even without internet connection',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Available in English, Hindi, and Marathi',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Floating3D />
      
      {/* Header with glass effect */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-mark.svg" alt="Gramin Seva" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user && profile ? (
              <Link to={`/${profile.role}`}>
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 hero-gradient -z-10" />
        <div className="absolute inset-0 bg-animated-pattern -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Healthcare for Rural India
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Connecting rural communities with quality healthcare through AI-powered telemedicine
            </p>
            
            {/* Glass Card - CTA Section */}
            <div className="glass-card p-8 mb-8 relative overflow-hidden">
              {/* Subtle shine */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="flex flex-col sm:flex-row gap-4">
                {user && profile ? (
                  <Link to={`/${profile.role}`} className="flex-1">
                    <Button size="lg" className="w-full btn-3d">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button size="lg" className="w-full btn-3d">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Hero Image with floating badge */}
          <div className="relative hidden md:block">
            <div className="relative">
              <img
                src="/images/hero-illustration.svg"
                alt="Healthcare illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
              {/* Floating stats badge */}
              <div className="absolute -bottom-4 -left-6 glass-card px-5 py-4 float-medium">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">10K+</p>
                    <p className="text-xs text-muted-foreground">Patients Helped</p>
                  </div>
                </div>
              </div>
              {/* Floating rating badge */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-3 float-fast">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Comprehensive Healthcare Solutions</h3>
          <p className="text-lg text-muted-foreground">
            Everything you need for remote healthcare delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="card-hover-lift glass-card border-0">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 my-16">
        <div className="glass-card p-12 rounded-3xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">Why Choose GraminSeva?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl hover:bg-muted/30 transition-colors card-hover-lift">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
                <p className="text-muted-foreground">Your health data is encrypted and protected</p>
              </div>
              <div className="text-center p-6 rounded-2xl hover:bg-muted/30 transition-colors card-hover-lift">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Wifi className="h-10 w-10 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Works Offline</h4>
                <p className="text-muted-foreground">Access essential features without internet</p>
              </div>
              <div className="text-center p-6 rounded-2xl hover:bg-muted/30 transition-colors card-hover-lift">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Globe className="h-10 w-10 text-accent" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Local Languages</h4>
                <p className="text-muted-foreground">Available in English, Hindi, and Marathi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl" />
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4 relative">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8 relative">
            Join thousands of patients and healthcare providers using GraminSeva
          </p>
          {user && profile ? (
            <Link to={`/${profile.role}`} className="relative">
              <Button size="lg" className="btn-3d">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login" className="relative">
              <Button size="lg" className="btn-3d">Create Your Account</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/60 backdrop-blur-md py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/images/logo-mark.svg" alt="Gramin Seva" className="h-8 w-8" />
              <span className="font-semibold">{t('app.name')}</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 {t('app.name')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
