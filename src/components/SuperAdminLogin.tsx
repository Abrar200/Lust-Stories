import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        toast({ title: 'Login successful', description: 'Welcome, Super Admin' });
        navigate('/super-admin');
      } else {
        toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-pink-500/30">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/logo.png" 
              alt="Lust Story" 
              className="w-80 mb-6"
              style={{ filter: 'drop-shadow(0 0 30px rgba(255, 20, 147, 0.8))' }}
            />



            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-pink-400 mb-2" style={{ textShadow: '0 0 20px rgba(255, 20, 147, 0.8)' }}>Super Admin</h1>
            <p className="text-pink-300">Platform Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <Label htmlFor="email" className="text-pink-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-pink-500/50 text-pink-100 placeholder:text-pink-400/50 focus:border-pink-400"
                placeholder="admin@luststory.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-pink-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-pink-500/50 text-pink-100 placeholder:text-pink-400/50 pr-10 focus:border-pink-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/50"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

