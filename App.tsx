
import React, { useState, useCallback, useEffect } from 'react';
import type { ReadingRequest, ReadingResponse } from './types';
import { READING_TYPES } from './constants';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateReading } from './services/geminiService';
import LoginScreen from './components/LoginScreen';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Form and Reading State
  const [formData, setFormData] = useState<ReadingRequest>({
    name: '',
    age: null,
    gender: 'Prefer not to say',
    prompt: '',
    readingType: 'GENERAL TAROT OR PSYCHIC READING',
    isPremium: false,
  });
  const [readingResponse, setReadingResponse] = useState<ReadingResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check session storage on initial load
  useEffect(() => {
    if (sessionStorage.getItem('scarlett-auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (password: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        sessionStorage.setItem('scarlett-auth', 'true');
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        setAuthError(data.message || 'Incorrect password.');
        sessionStorage.removeItem('scarlett-auth');
      }
    } catch (err) {
      setAuthError('Failed to connect to the server. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'age' ? (value === '' ? null : parseInt(value, 10)) : value 
        }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReadingResponse(null);

    try {
      const data = await generateReading(formData);
      setReadingResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={authError} isLoading={isAuthenticating} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wider font-serif">
            Scarlett's AI Psychic Readings
          </h1>
          <p className="mt-4 text-lg text-purple-200/80">
            Unlock insights from the universe. Enter your details to receive a reading from Scarlett.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 p-6 rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-purple-300">Request Your Reading</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-gray-800/50 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"/>
                </div>
                 <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                  <input type="number" id="age" name="age" value={formData.age === null ? '' : formData.age} onChange={handleInputChange} min="1" className="w-full bg-gray-800/50 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"/>
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-800/50 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                  <option>Prefer not to say</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                </select>
              </div>

              <div>
                <label htmlFor="readingType" className="block text-sm font-medium text-gray-300 mb-1">Type of Reading</label>
                <select id="readingType" name="readingType" value={formData.readingType} onChange={handleInputChange} className="w-full bg-gray-800/50 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                  {READING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                 <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Your Question or Focus (Optional)</label>
                 <textarea id="prompt" name="prompt" value={formData.prompt} onChange={handleInputChange} rows={4} className="w-full bg-gray-800/50 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder="e.g., 'What should I know about my career path?'"></textarea>
              </div>

              <div className="flex items-center">
                 <input id="isPremium" name="isPremium" type="checkbox" checked={formData.isPremium} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-gray-800"/>
                 <label htmlFor="isPremium" className="ml-3 block text-sm font-medium text-gray-300">
                   Make this a Premium Reading (more detailed)
                 </label>
              </div>
              
              <div className="pt-2">
                <button type="submit" disabled={isLoading || !formData.name} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                  {isLoading ? <LoadingSpinner /> : 'Receive Your Reading'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl shadow-2xl shadow-pink-500/10 border border-pink-500/20 backdrop-blur-sm min-h-[300px] flex flex-col justify-center items-center">
            {isLoading && <LoadingSpinner large={true} />}
            {!isLoading && <ResultDisplay response={readingResponse} error={error} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
