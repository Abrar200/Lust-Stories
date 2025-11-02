import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoCallProps {
  callerName: string;
  callerImage: string;
  isVideo: boolean;
  onEndCall: () => void;
}

export default function VideoCall({ callerName, callerImage, isVideo, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideo);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isVideo && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        }).catch(console.error);
    }
  }, [isVideo]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setIsScreenSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        {isVideo ? (
          <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-900 to-rose-900 flex items-center justify-center">
            <img src={callerImage} alt={callerName} className="w-40 h-40 rounded-full" />
          </div>
        )}
        
        {isVideo && (
          <video ref={localVideoRef} className="absolute bottom-20 right-4 w-32 h-40 rounded-lg object-cover border-2 border-white" autoPlay playsInline muted />
        )}
        
        <div className="absolute top-4 left-4 text-white">
          <p className="font-semibold">{callerName}</p>
          <p className="text-sm opacity-80">{formatDuration(callDuration)}</p>
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-sm p-6 flex justify-center gap-4">
        <Button onClick={() => setIsMuted(!isMuted)} size="lg" variant={isMuted ? "destructive" : "secondary"} className="rounded-full w-14 h-14">
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        
        {isVideo && (
          <Button onClick={() => setIsVideoOn(!isVideoOn)} size="lg" variant={isVideoOn ? "secondary" : "destructive"} className="rounded-full w-14 h-14">
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
        )}
        
        <Button onClick={toggleScreenShare} size="lg" variant={isScreenSharing ? "default" : "secondary"} className="rounded-full w-14 h-14">
          {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </Button>
        
        <Button onClick={onEndCall} size="lg" className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600">
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
