import { Search } from 'lucide-react';

interface SearchingOverlayProps {
  isVisible: boolean;
}

export function SearchingOverlay({ isVisible }: SearchingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-6">
            <Search className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Searching...
        </p>
      </div>
    </div>
  );
}
