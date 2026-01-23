import React from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = 'Unable to connect to the server. Please check your internet connection and try again.'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <WifiOff className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Connection Issue</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default NetworkError;