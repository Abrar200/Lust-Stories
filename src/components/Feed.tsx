import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Users, Sparkles, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StoryViewer } from './StoryViewer';
import { SuggestedProfile } from './SuggestedProfile';
import { CommentModal } from './CommentModal';
import { useNavigate } from 'react-router-dom';

const STORIES = [
  { id: '1', userId: 'u1', username: 'Chloe', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', media: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp', timestamp: '2h' },
  { id: '2', userId: 'u2', username: 'Chloe', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', media: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915672216_a8011d6a.webp', timestamp: '4h' },
  { id: '3', userId: 'u3', username: 'Chloe', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', media: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915663643_a459917b.webp', timestamp: '6h' },
  { id: '4', userId: 'u4', username: 'Chloe', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915637554_e119a69b.webp', media: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915674118_67178a6f.webp', timestamp: '8h' },
];

const POSTS = [
  { id: '1', userId: 'u1', author: 'chloelovesyou', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', text: 'Send me moneyyyyyyyyy!', media: [], likes: 234, comments: 12, timestamp: '9h' },
  { id: '2', userId: 'u2', author: 'chloelovesyou', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', text: 'Send me moneyyyyyyyyy!', media: ['https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915672216_a8011d6a.webp'], likes: 189, comments: 8, timestamp: '9h' },
];

const SUGGESTED = [
  { id: 's1', userId: 's1', name: 'Sophia Rose', location: 'Melbourne, Victoria', rating: 4.9, images: ['https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988382789_ea59818f.webp', 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988384524_5bdb6cff.webp', 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988386337_e8de80a6.webp'], price: '$500', bio: 'Luxury companion for upscale events and private dates' },
  { id: 's2', userId: 's2', name: 'Isabella Night', location: 'Sydney, New South Wales', rating: 5.0, images: ['https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988388130_86854d85.webp', 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988390356_0ff45be7.webp', 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988392231_deab7ab1.webp'], price: '$750', bio: 'VIP entertainment and unforgettable experiences' },
];

export const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [viewingStory, setViewingStory] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'following' | 'suggested'>('following');
  const [commentModal, setCommentModal] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleFollow = (id: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const addComment = (postId: string, text: string) => {
    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { id: Date.now().toString(), author: 'You', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', text, likes: 0, timestamp: 'Just now' }]
    }));
  };

  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-2xl mx-auto pt-6">
        <div className="flex gap-2 mb-6 px-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <button onClick={() => setActiveTab('following')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === 'following' ? 'bg-pink-100 text-pink-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`}>
            <Users className="w-4 h-4" />Following
          </button>
          <button onClick={() => setActiveTab('suggested')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === 'suggested' ? 'bg-pink-100 text-pink-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`}>
            <Sparkles className="w-4 h-4" />Suggested
          </button>
        </div>

        {activeTab === 'following' && (
          <>
            <div className="flex gap-3 px-4 pb-6 overflow-x-auto scrollbar-hide">
              {STORIES.map((story, idx) => (
                <div key={story.id} className="flex-shrink-0 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div onClick={() => setViewingStory(idx)} className="w-16 h-16 rounded-xl p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                    <div className="w-full h-full rounded-xl border-2 border-white overflow-hidden">
                      <img src={story.avatar} alt={story.username} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    </div>
                  </div>
                  <p onClick={() => viewProfile(story.userId)} className="text-xs text-center mt-1.5 text-zinc-600 cursor-pointer hover:text-pink-600 transition-colors duration-200">{story.username}</p>
                </div>
              ))}
            </div>


            <div className="space-y-4 px-4 pb-6">
              {POSTS.map((post, idx) => (
                <Card key={post.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-xl transition-all" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="p-4 flex items-center gap-3">
                    <img onClick={() => viewProfile(post.userId)} src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-110" />
                    <div>
                      <p onClick={() => viewProfile(post.userId)} className="font-semibold text-zinc-900 text-sm cursor-pointer hover:text-pink-600 transition-colors duration-200">{post.author}</p>
                      <p className="text-xs text-zinc-500">{post.timestamp}</p>
                    </div>
                  </div>
                  {post.media.length > 0 && <img src={post.media[0]} alt="Post" className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105" />}
                  <div className="p-4 space-y-3">
                    <div className="flex gap-4">
                      <Heart className={`cursor-pointer transition-all duration-300 transform hover:scale-125 active:scale-90 ${likedPosts.has(post.id) ? 'fill-pink-500 text-pink-500' : 'text-zinc-700 hover:text-pink-400'}`} onClick={() => toggleLike(post.id)} />
                      <MessageCircle className="cursor-pointer text-zinc-700 hover:text-pink-500 transition-all duration-300 transform hover:scale-125 active:scale-90" onClick={() => setCommentModal(post.id)} />
                      <Share2 className="cursor-pointer text-zinc-700 hover:text-pink-500 transition-all duration-300 transform hover:scale-125 active:scale-90" />
                      <Bookmark className={`cursor-pointer ml-auto transition-all duration-300 transform hover:scale-125 active:scale-90 ${savedPosts.has(post.id) ? 'fill-pink-500 text-pink-500' : 'text-zinc-700 hover:text-pink-400'}`} onClick={() => toggleSave(post.id)} />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900">{post.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</p>
                    <p className="text-sm text-zinc-900"><span onClick={() => viewProfile(post.userId)} className="font-semibold cursor-pointer hover:text-pink-600 transition-colors duration-200">{post.author}</span> {post.text}</p>
                  </div>
                </Card>
              ))}
            </div>

          </>
        )}

        {activeTab === 'suggested' && (
          <div className="space-y-4 px-4 pb-6">
            {SUGGESTED.map(profile => (
              <SuggestedProfile key={profile.id} {...profile} onFollow={handleFollow} isFollowing={following.has(profile.id)} onViewProfile={() => viewProfile(profile.userId)} />
            ))}
          </div>
        )}
      </div>

      {viewingStory !== null && <StoryViewer stories={STORIES} currentIndex={viewingStory} onClose={() => setViewingStory(null)} />}
      {commentModal && <CommentModal isOpen={!!commentModal} onClose={() => setCommentModal(null)} postAuthor="chloelovesyou" postAvatar="https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp" comments={postComments[commentModal] || []} onAddComment={(text) => addComment(commentModal, text)} />}
    </div>
  );
};
