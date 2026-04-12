'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[jujugre] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-lg">
              <CardHeader className="border-b border-[#e8e3db]">
                <CardTitle className="flex items-center gap-2 text-[#a88080]">
                  <AlertCircle className="w-5 h-5" />
                  Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-[#3d2f3f]">
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>
                <div className="text-xs text-[#a89d94] font-mono bg-[#f5f1e8] p-2 rounded border border-[#e8e3db] overflow-auto max-h-32">
                  {this.state.error?.message || 'Unknown error'}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white"
                  >
                    Refresh Page
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="flex-1 border-[#e8e3db] text-[#3d2f3f] hover:bg-[#ede8df]"
                  >
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
