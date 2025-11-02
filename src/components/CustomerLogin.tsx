import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) navigate('/feed');
    setLoading(false);
  };

  const handleSignupStep = async () => {
    if (step === 1) {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (!error) setStep(2);
      setLoading(false);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (password === confirmPassword) setStep(4);
    } else if (step === 4) {
      if (acceptedTerms) setStep(5);
    } else if (step === 5) {
      if (selectedPlan) {
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({ email, token: verificationCode, type: 'email' });
        if (!error) {
          await supabase.auth.updateUser({ password });
          navigate('/feed');
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
        <img src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1762053490695_82bf90da.png" alt="Lust Story" className="max-w-md" />
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <h2 className="text-3xl font-bold text-teal-600">Customer Login</h2>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>Login</Button>
              <p className="text-center">Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-teal-600 font-semibold">Sign Up</button></p>
            </form>
          ) : (
            <div className="space-y-6">
              {step === 1 && (
                <>
                  <h2 className="text-3xl font-bold text-teal-600">Sign Up as Customer</h2>
                  <Input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button onClick={handleSignupStep} className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>Next</Button>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold">Enter Verification Code</h2>
                  <p className="text-sm text-gray-600">Code sent to {email}</p>
                  <Input maxLength={6} placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="text-center text-2xl tracking-widest" />
                  <Button onClick={handleSignupStep} className="w-full bg-teal-600 hover:bg-teal-700">Verify</Button>
                </>
              )}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold">Create Password</h2>
                  <Input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <Button onClick={handleSignupStep} className="w-full bg-teal-600 hover:bg-teal-700">Next</Button>
                </>
              )}
              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold text-center">Community Guidelines</h2>
                  <div className="bg-gray-50 p-6 rounded-lg text-center space-y-4">
                    <p>We do not tolerate any <strong>bullying, harassment or assault</strong> of any kind.</p>
                    <p>Should you be found to partake in any such activities, you will be <strong>immediately removed</strong> from our community.</p>
                    <p>If necessary, <strong>legal consequences</strong> will be carried out.</p>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                    <span className="text-sm">I have read and accept the terms and conditions</span>
                  </label>
                  <Button onClick={handleSignupStep} className="w-full bg-teal-600 hover:bg-teal-700" disabled={!acceptedTerms}>Next</Button>
                </>
              )}
              {step === 5 && (
                <>
                  <h2 className="text-2xl font-bold">Subscription</h2>
                  <div className="space-y-3">
                    <div onClick={() => setSelectedPlan('monthly')} className={`border-2 rounded-lg p-4 cursor-pointer ${selectedPlan === 'monthly' ? 'border-teal-600' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <span>Monthly - $29.99</span>
                        <Button size="sm" variant={selectedPlan === 'monthly' ? 'default' : 'outline'}>Select</Button>
                      </div>
                    </div>
                    <div onClick={() => setSelectedPlan('annual')} className={`border-2 rounded-lg p-4 cursor-pointer ${selectedPlan === 'annual' ? 'border-teal-600' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <span>Annual - $299.99</span>
                        <Button size="sm" variant={selectedPlan === 'annual' ? 'default' : 'outline'}>Select</Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSignupStep} className="w-full bg-teal-600 hover:bg-teal-700" disabled={!selectedPlan || loading}>Complete Signup</Button>
                </>
              )}
              <p className="text-center">Already have an account? <button type="button" onClick={() => { setIsLogin(true); setStep(1); }} className="text-teal-600 font-semibold">Login</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
