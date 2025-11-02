import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageCircle, ThumbsUp, Eye } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { Navigation } from '@/components/Navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  views: number;
  timestamp: string;
  liked: boolean;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      author: 'Sarah M.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      title: 'Tips for new workers starting out',
      content: 'What are your best tips for someone just starting in this industry?',
      category: 'Advice',
      likes: 24,
      replies: 12,
      views: 156,
      timestamp: '2 hours ago',
      liked: false
    },
    {
      id: '2',
      author: 'Mike R.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      title: 'Safety protocols discussion',
      content: 'Let\'s discuss best practices for staying safe while working.',
      category: 'Safety',
      likes: 45,
      replies: 28,
      views: 342,
      timestamp: '5 hours ago',
      liked: false
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      likes: 0,
      replies: 0,
      views: 0,
      timestamp: 'Just now',
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('General');
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <div className="ml-52">
        <TopBar />
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-zinc-900">Community Forum</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-600 hover:bg-pink-700">New Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                  >
                    <option>General</option>
                    <option>Advice</option>
                    <option>Safety</option>
                    <option>Discussion</option>
                  </select>
                  <Button onClick={handleCreatePost} className="w-full bg-pink-600 hover:bg-pink-700">
                    Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-900">{post.title}</h3>
                        <p className="text-sm text-zinc-500">{post.author} • {post.timestamp}</p>
                      </div>
                      <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">{post.category}</span>
                    </div>
                    <p className="text-zinc-600 mb-4">{post.content}</p>
                    <div className="flex gap-6 text-sm text-zinc-500">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${post.liked ? 'text-pink-600' : ''}`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.replies}</span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
