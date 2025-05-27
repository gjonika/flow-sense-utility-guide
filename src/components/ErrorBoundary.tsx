
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Force a page reload as a last resort
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Application Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-700">
                <p className="mb-4">
                  Something went wrong in the Hull Check application. This is likely a temporary issue.
                </p>
                
                {this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <p className="font-medium text-red-800 mb-2">Error Details:</p>
                    <p className="text-red-700 text-sm font-mono break-all">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">What you can try:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Click "Restart Application" below</li>
                    <li>Clear your browser cache and reload the page</li>
                    <li>Check your internet connection</li>
                    <li>Try again in a few minutes</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={this.handleReset} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Restart Application
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/projects'}
                >
                  Go to Dashboard
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Technical Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
