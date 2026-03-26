import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresRegistration?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiresRegistration = true 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is registered
    const registered = localStorage.getItem('infiniteRegistered') === 'true';
    setIsRegistered(registered);

    // If registration is required and user is not registered, redirect to entry portal
    if (requiresRegistration && !registered) {
      setLocation('/entry');
    }
  }, [requiresRegistration, setLocation]);

  // Show nothing while checking registration status
  if (isRegistered === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If registration is required but user is not registered, don't render
  if (requiresRegistration && !isRegistered) {
    return null;
  }

  return <>{children}</>;
}
