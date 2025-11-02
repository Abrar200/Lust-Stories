import { Phone, PhoneOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallScreenProps {
  callerName: string;
  callerImage: string;
  isIncoming: boolean;
  isVideo: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CallScreen({
  callerName,
  callerImage,
  isIncoming,
  isVideo,
  onAccept,
  onDecline
}: CallScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-900 via-rose-800 to-pink-900 z-50 flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <img
            src={callerImage}
            alt={callerName}
            className="w-32 h-32 rounded-full mx-auto border-4 border-white/30 shadow-2xl"
          />
          <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{callerName}</h2>
          <p className="text-white/80 text-lg">
            {isIncoming ? `Incoming ${isVideo ? 'video' : 'voice'} call...` : 'Calling...'}
          </p>
        </div>

        <div className="flex gap-6 justify-center pt-8">
          <Button
            onClick={onDecline}
            size="lg"
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          
          {isIncoming && (
            <Button
              onClick={onAccept}
              size="lg"
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
            >
              {isVideo ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
