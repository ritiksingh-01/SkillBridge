import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  function handleBack(){
    navigate('/');
  }
  function handleSignUpPage(){
    navigate('/signUp');
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'mentor') {
          navigate('/mentor-dashboard');
        } else {
          navigate('/mentee-dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left section with illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-900 opacity-10">
          {/* Abstract pattern overlay */}
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="absolute top-10 left-10 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-800 font-bold text-xl">SB</span>
            </div>
            <div className="text-white text-xl font-bold">
              Skill<span className="font-light">Bridge</span>
            </div>
          </div>
        </div>

        {/* Center content - Fixed alignment */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-lg px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to SkillBridge</h1>
          <p className="text-white/90 text-lg mb-8">Connect with professionals, build your skills, and advance your career.</p>
          
          {/* Job categories - Improved grid layout */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
              <div className="h-12 w-12 mx-auto flex items-center justify-center bg-white/20 rounded-xl mb-3">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Virtual Learning</h3>
              <p className="text-white/80 text-sm mt-1">Learn from experts anywhere</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
              <div className="h-12 w-12 mx-auto flex items-center justify-center bg-white/20 rounded-xl mb-3">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Community Access</h3>
              <p className="text-white/80 text-sm mt-1">Connect with a global network</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
              <div className="h-12 w-12 mx-auto flex items-center justify-center bg-white/20 rounded-xl mb-3">
                <User size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Career Mentorship</h3>
              <p className="text-white/80 text-sm mt-1">1-on-1 guidance & support</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
              <div className="h-12 w-12 mx-auto flex items-center justify-center bg-white/20 rounded-xl mb-3">
                <div className="text-white font-bold text-xl">JM</div>
              </div>
              <h3 className="font-semibold text-white text-lg">Job Matching</h3>
              <p className="text-white/80 text-sm mt-1">Find your perfect opportunity</p>
            </div>
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/90 italic mb-3">"SkillBridge transformed my career path with quality mentorship that helped me land my dream job in just 3 months."</p>
              <p className="text-white font-medium">Alex Johnson</p>
              <p className="text-white/70 text-sm">Software Engineer at Google</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex items-center p-6 lg:hidden">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <div className="text-blue-600 text-lg font-bold">
              Skill<span className="font-light">Bridge</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-12">
          <div className="w-full max-w-md">
            <button onClick={handleBack} className="hidden lg:flex items-center text-gray-500 hover:text-gray-700 mb-10 cursor-pointer">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to home</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
            <p className="text-gray-500 mb-8">Please enter your details to sign in</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {/* Social logins - Updated with proper icons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Google */}
              <button className="flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path 
                    d="M19.999 10.2217C19.999 9.61842 19.9448 9.01788 19.8399 8.43089H10.2002V12.2648H15.7128C15.5098 13.5291 14.7762 14.6282 13.6863 15.3349V17.9535H16.9159C18.82 16.1812 19.999 13.4299 19.999 10.2217Z" 
                    fill="#4285F4" 
                  />
                  <path 
                    d="M10.2002 20.0003C12.9592 20.0003 15.2721 19.1151 16.9159 17.9535L13.6863 15.3349C12.7605 15.9501 11.5731 16.3262 10.2002 16.3262C7.5427 16.3262 5.2889 14.5386 4.54698 12.1026H1.20459V14.8048C2.86299 17.8903 6.21601 20.0003 10.2002 20.0003Z" 
                    fill="#34A853" 
                  />
                  <path 
                    d="M4.54698 12.1026C4.36372 11.4899 4.26636 10.8391 4.26636 10.1741C4.26636 9.50922 4.36372 8.85845 4.54698 8.24574V5.54348H1.20459C0.437457 6.93049 0 8.51532 0 10.1741C0 11.833 0.437457 13.4178 1.20459 14.8048L4.54698 12.1026Z" 
                    fill="#FBBC05" 
                  />
                  <path 
                    d="M10.2002 4.02275C11.699 4.02275 13.0305 4.5298 14.0812 5.53154L16.9646 2.64795C15.2715 1.0079 12.9592 0 10.2002 0C6.21601 0 2.86299 2.11004 1.20459 5.19552L4.54698 7.89779C5.2889 5.46175 7.5427 3.67413 10.2002 3.67413V4.02275Z" 
                    fill="#EA4335" 
                  />
                </svg>
              </button>
              
              {/* LinkedIn */}
              <button className="flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path 
                    d="M16 0C17.1 0 18 0.9 18 2V16C18 17.1 17.1 18 16 18H2C0.9 18 0 17.1 0 16V2C0 0.9 0.9 0 2 0H16ZM15.5 15.5V10.2C15.5 7.86667 14.9667 6.06667 12.1 6.06667C10.7333 6.06667 9.8 6.86667 9.43333 7.63333H9.4V6.26667H6.73333V15.5H9.5V10.7C9.5 9.5 9.73333 8.33333 11.2 8.33333C12.6667 8.33333 12.6667 9.7 12.6667 10.7667V15.5H15.5ZM3.76667 15.5H6.53333V6.26667H3.76667V15.5ZM5.16667 2C4.16667 2 3.33333 2.83333 3.33333 3.83333C3.33333 4.83333 4.16667 5.66667 5.16667 5.66667C6.16667 5.66667 7 4.83333 7 3.83333C7 2.83333 6.16667 2 5.16667 2Z" 
                    fill="#0A66C2"
                  />
                </svg>
              </button>
              
              {/* GitHub */}
              <button className="flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M10 0C4.475 0 0 4.59 0 10.254C0 14.782 2.865 18.624 6.84 19.98C7.34 20.07 7.525 19.763 7.525 19.495C7.525 19.253 7.516 18.546 7.516 17.684C4.73 18.276 4.15 16.457 4.15 16.457C3.695 15.261 3.035 14.954 3.035 14.954C2.125 14.321 3.105 14.321 3.105 14.321C4.125 14.387 4.655 15.37 4.655 15.37C5.55 16.937 7.005 16.504 7.56 16.236C7.65 15.572 7.91 15.112 8.195 14.854C5.97 14.597 3.635 13.717 3.635 9.766C3.635 8.629 4.015 7.712 4.67 6.993C4.565 6.735 4.215 5.677 4.77 4.266C4.77 4.266 5.615 3.988 7.52 5.316C8.32 5.091 9.17 4.976 10.02 4.976C10.87 4.976 11.72 5.091 12.52 5.316C14.42 3.988 15.265 4.266 15.265 4.266C15.82 5.677 15.47 6.735 15.365 6.993C16.02 7.712 16.4 8.629 16.4 9.766C16.4 13.717 14.065 14.587 11.84 14.844C12.2 15.172 12.51 15.798 12.51 16.768C12.51 18.142 12.5 19.161 12.5 19.495C12.5 19.763 12.68 20.081 13.19 19.98C17.135 18.624 20 14.782 20 10.254C20 4.59 15.52 0 10 0Z" 
                    fill="#333333"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <p className="mx-4 text-sm text-gray-500">or continue with</p>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 font-medium hover:text-blue-700" onClick={handleSignUpPage}>
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;