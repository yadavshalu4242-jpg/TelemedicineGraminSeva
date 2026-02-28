import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function DoctorPendingPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Approval Pending</h1>
        <p className="text-muted-foreground">
          Your doctor account is awaiting approval from an administrator. You will be able to
          access the dashboard once your profile has been verified.
        </p>
        <Button variant="outline" onClick={handleLogout} className="mt-4">
          Logout
        </Button>
      </div>
    </MainLayout>
  );
}
