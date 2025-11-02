import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const location = useLocation();
  const sessionExpired = location.state?.sessionExpired;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col items-center justify-center">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761915379369_9c668a5a.png" 
            alt="Lust Story" 
            className="w-full max-w-lg object-contain"
          />
        </div>


        <div className="bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-auto">
          {sessionExpired && (
            <Alert className="mb-6 bg-yellow-900/50 border-yellow-600 animate-in fade-in slide-in-from-top-2 duration-500">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                Your session has expired due to inactivity. Please log in again to continue.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-white text-2xl font-bold">{isLogin ? 'LOG IN' : 'SIGN UP'}</h2>
            <button 
              onClick={() => setIsLogin(true)}
              className="text-pink-400 text-sm hover:text-pink-300"
            >
              FORGOT PASSWORD
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-pink-500" />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white pl-10 py-6"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-pink-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white pl-10 pr-10 py-6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-pink-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-pink-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white pl-10 py-6"
                />
              </div>
            )}

            <Button 
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 text-lg"
            >
              SUBMIT
            </Button>
          </form>

          <p className="text-center text-zinc-400 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-pink-400"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
