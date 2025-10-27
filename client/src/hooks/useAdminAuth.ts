import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check', {
        credentials: 'include',
      });
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      
      if (!data.isAuthenticated) {
        setLocation('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setLocation('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { isAuthenticated, isLoading, logout };
}

