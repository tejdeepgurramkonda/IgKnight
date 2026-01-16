import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, UserPlus, User, Mail, Lock, Globe, AlertCircle, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'India', 'China', 'Japan',
  'Brazil', 'Mexico', 'Russia', 'Other'
];

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.country) {
      setError('Please select your country');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signUp(formData);
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Sign up failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1f29] items-center justify-center px-12 xl:px-20 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                <Crown className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">IgKnight</h1>
            </div>

            {/* Heading Section */}
            <div className="space-y-5">
              <h2 className="text-5xl font-bold text-white leading-[1.1]">
                Begin Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Chess Journey
                </span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed max-w-md">
                Create your account and join a global community. From beginner to grandmaster.
              </p>
            </div>

            {/* Features Section */}
            <div className="space-y-5">
              {[
                "Free to play, no credit card required",
                "Personalized learning path for all levels",
                "Compete in tournaments and events"
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-lg">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[100px] mix-blend-screen"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] space-y-6"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/20">
                <Crown className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold text-white">IgKnight</h1>
            </div>
          </div>

          <div>
             <div className="space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Create account
              </h2>
              <p className="text-gray-400 text-base">
                Get started with your free account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mb-5"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full h-12 pl-12 pr-4 bg-[#1a1f29]/50 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-[#1a1f29]/50 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full h-12 pl-12 pr-12 bg-[#1a1f29]/50 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters</p>
              </div>

              {/* Country Field */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 ml-1">
                  Country
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <Globe className="w-5 h-5 text-gray-500" />
                  </div>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-12 pr-10 bg-[#1a1f29]/50 border border-gray-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer placeholder-gray-500"
                  >
                    <option value="" className="bg-[#1a1f29] text-gray-500">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="bg-[#1a1f29] text-white">
                        {country}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-base">Create Account</span>
                    <UserPlus className="w-4 h-4 opacity-80" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0f1419] text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => window.location.href = 'http://localhost:8081/oauth2/authorization/google'}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm border border-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign up with Google</span>
            </motion.button>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
