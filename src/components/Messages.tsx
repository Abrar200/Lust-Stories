import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Image, Paperclip, Smile, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import CallScreen from './CallScreen';
import VideoCall from './VideoCall';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';


interface Message {
  id: string;
  sender: 'me' | 'them';
  text?: string;
  image?: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sophia Rose', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', lastMessage: 'See you tonight!', time: '2m', unread: 2, online: true },
  { id: '2', name: 'Marcus Steel', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', lastMessage: 'Thanks for booking', time: '1h', unread: 0, online: false },
  { id: '3', name: 'Isabella Luna', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', lastMessage: 'What time works?', time: '3h', unread: 1, online: true },
  { id: '4', name: 'Aria Blake', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988546499_7117c0c3.webp', lastMessage: 'Perfect!', time: '5h', unread: 0, online: true },
  { id: '5', name: 'Dante Cross', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988553741_5c8503b9.webp', lastMessage: 'Looking forward to it', time: '1d', unread: 0, online: false },
  { id: '6', name: 'Luna Star', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761988548362_0691d92d.webp', lastMessage: 'Call me when free', time: '2d', unread: 3, online: true },
];

export const Messages: React.FC = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedChat, setSelectedChat] = useState<Conversation>(INITIAL_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'them', text: 'Hi! Thanks for reaching out', time: '10:30 AM', read: true },
    { id: '2', sender: 'me', text: 'Would love to book you for tonight', time: '10:32 AM', read: true },
    { id: '3', sender: 'them', text: 'Absolutely! What time?', time: '10:35 AM', read: true },
    { id: '4', sender: 'me', text: '8 PM work for you?', time: '10:36 AM', read: true },
    { id: '5', sender: 'them', text: 'See you tonight!', time: '10:38 AM', read: false },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'active'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !imagePreview) return;
    if (isSending) return;

    setIsSending(true);

    try {
      // Run AI moderation check on message
      const { data: { user } } = await supabase.auth.getUser();
      if (user && message.trim()) {
        const { data: moderationData } = await supabase.functions.invoke('moderate-content', {
          body: {
            content: message,
            contentType: 'message',
            userId: user.id,
            referenceId: selectedChat.id
          }
        });

        // Block message if high confidence inappropriate content
        if (moderationData?.shouldBlock) {
          toast({
            title: 'Message Blocked',
            description: 'Your message contains inappropriate content and was not sent.',
            variant: 'destructive'
          });
          setIsSending(false);
          return;
        }

        // Warn if flagged but allow sending
        if (moderationData?.flagged) {
          toast({
            title: 'Message Flagged',
            description: 'Your message has been flagged for review by moderators.',
            variant: 'default'
          });
        }
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'me',
        text: message,
        image: imagePreview || undefined,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        read: false,
      };

      setMessages([...messages, newMessage]);
      setMessage('');
      setImagePreview(null);

      // Update conversation last message
      setConversations(conversations.map(conv => 
        conv.id === selectedChat.id 
          ? { ...conv, lastMessage: message || 'Photo', time: 'now' }
          : conv
      ));

      // Simulate typing indicator and response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const responses = [
            'Sounds great!',
            'Perfect timing',
            'I\'ll be ready',
            'Can\'t wait!',
            'See you then',
          ];
          const response: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'them',
            text: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            read: false,
          };
          setMessages(prev => [...prev, response]);
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const initiateCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setCallState('calling');
    // Simulate call being answered after 3 seconds
    setTimeout(() => {
      setCallState('active');
    }, 3000);
  };

  const handleAcceptCall = () => {
    setCallState('active');
  };

  const handleDeclineCall = () => {
    setCallState('idle');
  };

  const handleEndCall = () => {
    setCallState('idle');
  };

  // Render call screens
  if (callState === 'calling' || callState === 'ringing') {
    return (
      <CallScreen
        callerName={selectedChat.name}
        callerImage={selectedChat.avatar}
        isIncoming={callState === 'ringing'}
        isVideo={callType === 'video'}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    );
  }

  if (callState === 'active') {
    return (
      <VideoCall
        callerName={selectedChat.name}
        callerImage={selectedChat.avatar}
        isVideo={callType === 'video'}
        onEndCall={handleEndCall}
      />
    );
  }

  return (

    <div className="h-[calc(100vh-73px)] bg-black flex">
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => {
              setSelectedChat(conv);
              setConversations(conversations.map(c => 
                c.id === conv.id ? { ...c, unread: 0 } : c
              ));
            }} className={`p-4 flex gap-3 cursor-pointer hover:bg-zinc-900 ${selectedChat.id === conv.id ? 'bg-zinc-900' : ''}`}>
              <div className="relative">
                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-semibold text-white truncate">{conv.name}</p>
                  <span className="text-xs text-zinc-500">{conv.time}</span>
                </div>
                <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-xs">{conv.unread}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-white">{selectedChat.name}</p>
              <p className="text-xs text-zinc-500">{isTyping ? 'typing...' : selectedChat.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => initiateCall('voice')} size="sm" variant="ghost" className="text-zinc-400 hover:text-white"><Phone className="w-4 h-4" /></Button>
            <Button onClick={() => initiateCall('video')} size="sm" variant="ghost" className="text-zinc-400 hover:text-white"><Video className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white"><MoreVertical className="w-4 h-4" /></Button>
          </div>

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs ${msg.sender === 'me' ? 'bg-pink-500' : 'bg-zinc-800'} rounded-2xl overflow-hidden`}>
                {msg.image && <img src={msg.image} alt="Shared" className="w-full" />}
                {msg.text && <div className="px-4 py-2">
                  <p className="text-white">{msg.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70 text-white">{msg.time}</p>
                    {msg.sender === 'me' && <span className="text-xs opacity-70 text-white">{msg.read ? 'Read' : 'Sent'}</span>}
                  </div>
                </div>}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-zinc-800">
          {imagePreview && (
            <div className="mb-2 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
              <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-zinc-700 rounded-full p-1">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
              <Image className="w-5 h-5" />
            </Button>
            <Input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder="Type a message..." 
              className="bg-zinc-800 border-zinc-700 text-white flex-1" 
            />
            <Button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
