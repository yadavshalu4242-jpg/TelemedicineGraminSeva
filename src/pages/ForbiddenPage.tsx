import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <ShieldAlert className="h-24 w-24 mx-auto text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-4">403 - Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
