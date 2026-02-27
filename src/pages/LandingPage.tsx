import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Heart, MessageSquare, Video, Mic, QrCode, Wifi, Globe, Shield } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Healthcare for Rural India
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Connecting rural communities with quality healthcare through AI-powered telemedicine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user && profile ? (
              <Link to={`/${profile.role}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Healthcare Solutions</h3>
          <p className="text-lg text-muted-foreground">
            Everything you need for remote healthcare delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose GraminSeva?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
              <p className="text-muted-foreground">Your health data is encrypted and protected</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Works Offline</h4>
              <p className="text-muted-foreground">Access essential features without internet</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Local Languages</h4>
              <p className="text-muted-foreground">Available in English, Hindi, and Marathi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-3xl p-12 border">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of patients and healthcare providers using GraminSeva
          </p>
          {user && profile ? (
            <Link to={`/${profile.role}`}>
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg">Create Your Account</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">{t('app.name')}</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 {t('app.name')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
