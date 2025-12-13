import React, { useState } from 'react';
import { UserRole } from '../types';
import { HeartHandshake, Utensils, ArrowRight, Lock, Mail, User, Chrome, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, Smartphone } from 'lucide-react';

interface LoginPageProps {
  onLogin: (name: string, role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('donor');
  const [otp, setOtp] = useState('');
  
  // Security State
  const [serverOtp, setServerOtp] = useState<string>(''); // Stores the generated code

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Strict Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[\d\s-]{10,}$/;

  const generateAndSendOTP = (target: string, method: 'email' | 'phone') => {
    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(code);
    
    // LOGIC: This mimics the backend sending process
    console.log(`[SECURE SYSTEM] OTP Generated for ${target}: ${code}`);
    
    // SIMULATION ALERT: 
    // Since we don't have a real mail/SMS server, we alert the code to the user.
    setTimeout(() => {
      const typeLabel = method === 'email' ? 'EMAIL' : 'SMS';
      alert(`VITAL SECURITY SIMULATION\n\n[FAKE ${typeLabel} RECEIVED]\n\nYour Verification Code is: ${code}\n\nPlease enter this code to proceed.`);
    }, 1200);
  };

  const handleInitiateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validation
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    
    if (authMode === 'signup' && !name.trim()) {
      setError('Organization or User Name is required.');
      return;
    }

    if (loginMethod === 'email') {
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
    } else {
      if (!phoneRegex.test(phone)) {
        setError('Please enter a valid mobile number (min 10 digits).');
        return;
      }
    }

    if (password.length < 8) {
      setError('Security Alert: Password must be at least 8 characters.');
      return;
    }

    // 2. Simulate Server Request & OTP Generation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
      const target = loginMethod === 'email' ? email : phone;
      generateAndSendOTP(target, loginMethod);
    }, 1500); 
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 3. OTP Validation
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Invalid format. Please enter the 6-digit numeric code.');
      return;
    }

    // CHECK AGAINST GENERATED CODE
    if (otp !== serverOtp) {
      setError(`Security Error: The code provided does not match the one sent to your ${loginMethod}.`);
      return;
    }

    setIsLoading(true);
    
    // Simulate verification latency
    setTimeout(() => {
      setIsLoading(false);
      // Success
      let derivedName = name;
      if (!derivedName) {
         derivedName = loginMethod === 'email' ? email.split('@')[0] : `User ${phone.slice(-4)}`;
      }
      onLogin(derivedName, role);
    }, 2000);
  };

  const handleResend = () => {
    setOtp('');
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const target = loginMethod === 'email' ? email : phone;
      generateAndSendOTP(target, loginMethod);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate OAuth redirection
    setTimeout(() => {
      setIsLoading(false);
      onLogin("Google User", role);
    }, 2000);
  };

  const resetFlow = () => {
    setStep('credentials');
    setOtp('');
    setError('');
    setServerOtp('');
  };

  return (
    <div className="min-h-screen bg-white text-brand-black flex flex-col md:flex-row">
      
      {/* Left Panel - Brand Aesthetic */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-volt rounded-full blur-[100px] animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">VITAL</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Sustainable Nutrition Network</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter leading-none">
              FEED<br/>THE<br/><span className="text-brand-volt">CYCLE.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm font-light">
            Access the secure decentralized food distribution ledger.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-gray-500">
          <ShieldCheck size={14} className="text-brand-volt" />
          <span>AES-256 ENCRYPTED SESSION</span>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white animate-fade-in relative">
        <div className="max-w-md mx-auto w-full">
          
          {/* Mobile Header */}
          <div className="md:hidden mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tighter">VITAL</h1>
          </div>

          {step === 'credentials' ? (
            <>
              {/* Auth Toggle */}
              <div className="flex mb-10 border-b border-gray-100">
                <button
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className={`pb-4 px-4 text-sm font-bold tracking-wide transition-colors relative ${
                    authMode === 'signin' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  SIGN IN
                  {authMode === 'signin' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-volt"></div>}
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className={`pb-4 px-4 text-sm font-bold tracking-wide transition-colors relative ${
                    authMode === 'signup' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  CREATE ACCOUNT
                  {authMode === 'signup' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-volt"></div>}
                </button>
              </div>

              <form onSubmit={handleInitiateLogin} className="space-y-6">
                
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {authMode === 'signup' ? 'Account Type' : 'Access Portal'}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('donor')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                        role === 'donor'
                          ? 'bg-black text-white border-black shadow-lg shadow-gray-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <HeartHandshake size={24} className={role === 'donor' ? 'text-brand-volt' : ''} />
                      <span className="text-xs font-bold tracking-wide">DONOR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('receiver')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                        role === 'receiver'
                          ? 'bg-black text-white border-black shadow-lg shadow-gray-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Utensils size={24} className={role === 'receiver' ? 'text-brand-volt' : ''} />
                      <span className="text-xs font-bold tracking-wide">RECEIVER</span>
                    </button>
                  </div>
                </div>

                {/* Method Toggle */}
                <div className="flex gap-4 mb-2">
                   <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 transition-colors ${loginMethod === 'email' ? 'border-brand-volt text-black' : 'border-transparent text-gray-400'}`}
                   >
                     Use Email
                   </button>
                   <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 transition-colors ${loginMethod === 'phone' ? 'border-brand-volt text-black' : 'border-transparent text-gray-400'}`}
                   >
                     Use Mobile
                   </button>
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                  {authMode === 'signup' && (
                    <div className="relative group">
                      <User className="absolute left-0 top-3.5 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name / Organization"
                        className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:border-black transition-colors rounded-none"
                      />
                    </div>
                  )}

                  {loginMethod === 'email' ? (
                    <div className="relative group animate-fade-in">
                      <Mail className="absolute left-0 top-3.5 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:border-black transition-colors rounded-none"
                      />
                    </div>
                  ) : (
                     <div className="relative group animate-fade-in">
                      <Smartphone className="absolute left-0 top-3.5 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile Number (e.g. +1 555 000 0000)"
                        className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:border-black transition-colors rounded-none"
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <Lock className="absolute left-0 top-3.5 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:border-black transition-colors rounded-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-3.5 text-gray-300 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 text-sm animate-fade-in">
                    <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-volt text-black py-4 rounded-xl font-bold tracking-tight hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-volt/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {authMode === 'signin' ? 'VERIFY IDENTITY' : 'INITIALIZE ACCOUNT'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-300 uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>

                {/* Social Auth */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold tracking-tight hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5 text-gray-400" /> : <Chrome size={20} />}
                  <span>Google Secure Login</span>
                </button>
                
              </form>
            </>
          ) : (
            // VERIFICATION STEP
            <div className="animate-fade-in-up">
               <button 
                onClick={resetFlow}
                className="text-xs font-bold tracking-widest text-gray-400 hover:text-black mb-8 flex items-center transition-colors uppercase"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Credentials
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                   {loginMethod === 'email' ? <Mail size={24} /> : <Smartphone size={24} />}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter mb-2">VERIFY {loginMethod === 'email' ? 'EMAIL' : 'MOBILE'}</h2>
                <p className="text-gray-500 font-medium">
                  We've sent a 6-digit secure code to <span className="text-black font-bold">{loginMethod === 'email' ? email : phone}</span>.
                  <br/>
                  <span className="text-xs text-gray-400">Please check your {loginMethod === 'email' ? 'inbox' : 'SMS messages'}.</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-4 text-3xl font-mono font-bold tracking-[0.5em] text-center focus:outline-none focus:border-brand-volt transition-colors rounded-xl"
                  />
                  <p className="text-center mt-4 text-xs text-gray-400">
                    Did not receive the code? <button type="button" onClick={handleResend} className="text-black font-bold underline hover:text-brand-600">Resend Code</button>
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 text-sm animate-fade-in">
                    <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-tight hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      CONFIRM & LOGIN <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer Text */}
          <div className="absolute bottom-6 left-0 w-full text-center px-8">
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">
              Secured by VITAL Identity Protocol v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;