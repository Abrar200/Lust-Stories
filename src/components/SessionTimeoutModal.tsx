import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface SessionTimeoutModalProps {
  open: boolean;
  timeRemaining: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal = ({
  open,
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}: SessionTimeoutModalProps) => {
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <AlertDialogTitle className="text-xl">Session Timeout Warning</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-3">
            <p>Your session is about to expire due to inactivity.</p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-2xl font-bold text-yellow-900 text-center">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-yellow-700 text-center mt-1">
                Time remaining
              </p>
            </div>
            <p className="text-sm">
              Click "Stay Logged In" to continue your session, or you'll be automatically logged out.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onLogout} className="w-full sm:w-auto">
            Log Out Now
          </Button>
          <Button onClick={onStayLoggedIn} className="w-full sm:w-auto">
            Stay Logged In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
