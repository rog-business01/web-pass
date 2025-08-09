import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Settings, CheckCircle } from 'lucide-react';
import { CryptoService } from '../services/CryptoService';

export function Generator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });
  const [strength, setStrength] = useState<{
    score: number;
    feedback: string[];
    crackTime: string;
  }>({ score: 0, feedback: [], crackTime: '' });

  useEffect(() => {
    generatePassword();
  }, [options]);

  useEffect(() => {
    if (password) {
      setStrength(CryptoService.calculatePasswordStrength(password));
    }
  }, [password]);

  const generatePassword = () => {
    try {
      const newPassword = CryptoService.generatePassword(options);
      setPassword(newPassword);
    } catch (error) {
      console.error('Password generation failed:', error);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-600/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-600/20';
    if (score >= 40) return 'text-orange-400 bg-orange-600/20';
    return 'text-red-400 bg-red-600/20';
  };

  const getStrengthText = (score: number) => {
    if (score >= 80) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Moderate';
    return 'Weak';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Password Generator</h1>
        <p className="text-gray-400">Generate cryptographically secure passwords with customizable options</p>
      </div>

      {/* Generated Password */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        <div className="text-center mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-4">
            <div className="font-mono text-2xl text-white break-all mb-4">
              {password || 'Click generate to create a password'}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={generatePassword}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate New
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Password Strength */}
        {password && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Password Strength</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStrengthColor(strength.score)}`}>
                {getStrengthText(strength.score)} ({strength.score}/100)
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.score >= 80 ? 'bg-green-500' :
                  strength.score >= 60 ? 'bg-yellow-500' :
                  strength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <div className="text-sm text-gray-400">
              <p>Estimated crack time: <span className="text-white">{strength.crackTime}</span></p>
              {strength.feedback.length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {strength.feedback.map((feedback, index) => (
                    <li key={index}>{feedback}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Options */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-400" />
            Generation Options
          </h3>
          
          <div className="space-y-6">
            {/* Length */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Length</label>
                <span className="text-sm text-blue-400">{options.length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={options.length}
                onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Uppercase Letters (A-Z)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Lowercase Letters (a-z)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Symbols (!@#$%^&*)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Exclude Similar Characters (0, O, l, I)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Security Information</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-400 mb-2">Cryptographic Security</h4>
              <p className="text-sm text-gray-300">
                Passwords are generated using cryptographically secure random number generation (CSPRNG) 
                via the Web Crypto API and TweetNaCl library.
              </p>
            </div>
            
            <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
              <h4 className="font-medium text-green-400 mb-2">Entropy Calculation</h4>
              <p className="text-sm text-gray-300">
                Password entropy is calculated based on character set size and length. 
                Higher entropy means exponentially more difficult to crack.
              </p>
            </div>
            
            <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-medium text-purple-400 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use at least 12 characters for good security</li>
                <li>• Include multiple character types</li>
                <li>• Avoid dictionary words and patterns</li>
                <li>• Use unique passwords for each account</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}