
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ship } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard for personal use
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Ship className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-900">Marine Survey</h1>
        </div>
        <p className="text-lg text-blue-600 mb-8">
          Personal marine survey management system
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Ship className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Button>
          <p className="text-sm text-gray-500">
            Redirecting automatically...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
