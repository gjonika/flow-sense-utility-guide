
import React from 'react';
import { MainHeader } from '@/components/MainHeader';
import { usePageTitle } from '@/hooks/usePageTitle';

const AIAssistant = () => {
  // Fix the usePageTitle call to match the expected interface
  usePageTitle({ 
    title: "AI Assistant",
    description: "Get AI-powered assistance for your maritime surveys" 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your intelligent maritime survey companion
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Coming Soon
              </h2>
              <p className="text-blue-700">
                The AI Assistant feature is currently under development. Soon you'll be able to:
              </p>
              <ul className="text-left text-blue-700 mt-4 space-y-2">
                <li>• Get intelligent recommendations for survey compliance</li>
                <li>• Receive automated analysis of survey data</li>
                <li>• Ask questions about maritime regulations</li>
                <li>• Generate reports with AI-powered insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
