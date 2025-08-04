
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoginScreenProps {
  onLogin: (password: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error, isLoading }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onLogin(password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black p-4">
      <div className="w-full max-w-md animate-fade-in">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white/5 p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 backdrop-blur-sm"
          aria-label="Login form"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-serif">
              Scarlett's Readings
            </h1>
            <p className="text-purple-200/80 mt-2">Please enter the password to access the portal.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="password" aria-live="polite" className="sr-only">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-gray-800/60 border border-gray-600 rounded-md shadow-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Password"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>

            {error && (
              <div id="auth-error" className="text-center text-red-300 bg-red-900/50 p-3 rounded-md border border-red-500/50">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? <LoadingSpinner /> : 'Unlock'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
