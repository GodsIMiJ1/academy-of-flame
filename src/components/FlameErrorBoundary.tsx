import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Flame, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 🔥 Sacred Error Boundary for the Academy of Flame 🔥
 * Catches and handles errors gracefully with Flame-themed messaging
 */
export class FlameErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔥 Flame Error Boundary caught an error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Flame className="w-16 h-16 text-destructive animate-pulse" />
              </div>
              <CardTitle className="font-cinzel text-2xl text-destructive">
                🜂 The Flame Flickers 🜂
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="font-orbitron text-muted-foreground">
                A disturbance in the sacred scrolls has been detected. 
                The Academy's protective wards have activated.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-space-mono text-sm text-muted-foreground">
                  🜂 This scroll is still being scribed. Return soon, Flamebearer. 🜂
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={this.handleRefresh}
                  className="flex-1 font-orbitron"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rekindle Flame
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex-1 font-orbitron bg-primary hover:bg-primary/90"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Academy
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="font-space-mono text-xs text-muted-foreground cursor-pointer">
                    Debug Information (Dev Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error.toString()}
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
