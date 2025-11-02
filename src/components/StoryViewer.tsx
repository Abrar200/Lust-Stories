import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  media: string;
  timestamp: string;
}

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, currentIndex, onClose }) => {
  const [current, setCurrent] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (current < stories.length - 1) {
            setCurrent(current + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [current, stories.length, onClose]);

  const story = stories[current];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 p-4 flex gap-1">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all"
              style={{ width: idx === current ? `${progress}%` : idx < current ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      <button onClick={onClose} className="absolute top-6 right-6 text-white z-10">
        <X size={32} />
      </button>

      <div className="absolute top-16 left-4 flex items-center gap-3 z-10">
        <img 
          src={story.avatar} 
          alt={story.username} 
          className="w-10 h-10 rounded-full border-2 border-pink-500 cursor-pointer hover:border-pink-400 transition-all" 
          onClick={() => {
            onClose();
            navigate(`/profile/${story.userId}`);
          }}
        />
        <span 
          className="text-white font-semibold cursor-pointer hover:text-pink-300 transition-colors" 
          onClick={() => {
            onClose();
            navigate(`/profile/${story.userId}`);
          }}
        >
          {story.username}
        </span>
        <span className="text-gray-300 text-sm">{story.timestamp}</span>

      </div>


      <button
        onClick={() => {
          onClose();
          navigate(`/profile/${story.userId}`);
        }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg z-10"
      >
        <Calendar size={20} />
        Book Now
      </button>

      <img src={story.media} alt="Story" className="max-h-screen max-w-full object-contain" />
    </div>

  );
};
