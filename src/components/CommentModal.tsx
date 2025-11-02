import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  postAvatar: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postAuthor,
  postAvatar,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const toggleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) newSet.delete(commentId);
      else newSet.add(commentId);
      return newSet;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">{comment.author}</span> {comment.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-500">{comment.timestamp}</span>
                  <button className="text-xs text-zinc-500 font-semibold">Reply</button>
                </div>
              </div>
              <Heart 
                className={`w-4 h-4 cursor-pointer ${likedComments.has(comment.id) ? 'fill-pink-500 text-pink-500' : 'text-zinc-400'}`}
                onClick={() => toggleLike(comment.id)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit} size="icon" className="bg-pink-500 hover:bg-pink-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
