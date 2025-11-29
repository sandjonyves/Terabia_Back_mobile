import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/auth/role-selection" />;
  }

  switch (user.role) {
    case 'buyer':
      return <Redirect href="/(buyer)/(tabs)" />;
    case 'seller':
      return <Redirect href="/(seller)/(tabs)" />;
    case 'delivery':
      return <Redirect href="/(delivery)/(tabs)" />;
    case 'admin':
      return <Redirect href="/(admin)/(tabs)" />;
    default:
      return <Redirect href="/auth/role-selection" />;
  }
}
