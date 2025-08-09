import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Key } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CryptoService } from '../services/CryptoService';

export function MasterPasswordSetup() {
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createMasterPassword, user } = useAuth();

  const passwordStrength = masterPassword ? CryptoService.calculatePasswordStrength(masterPassword) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (masterPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength || passwordStrength.score < 60) {
      setError('Please choose a stronger master password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const success = await createMasterPassword(masterPassword);
    
    if (!success) {
      setError('Failed to create master password. Please try again.');
    }
    
    setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full border border-green-500/30 mb-4">
              <Key className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Master Password</h1>
            <p className="text-gray-400">This password will encrypt all your credentials</p>
            <p className="text-sm text-blue-400 mt-2">Welcome, {user?.email}</p>
          </div>

          {/* Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="masterPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Master Password
              </label>
              <div className="relative">
                <input
                  id="masterPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                  placeholder="Create a strong master password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {passwordStrength && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Password Strength</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStrengthColor(passwordStrength.score)}`}>
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 80 ? 'bg-green-500' :
                        passwordStrength.score >= 60 ? 'bg-yellow-500' :
                        passwordStrength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="text-xs text-gray-400 space-y-1">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <li key={index}>• {feedback}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Master Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                  placeholder="Confirm your master password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && masterPassword !== confirmPassword && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
              {confirmPassword && masterPassword === confirmPassword && (
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Passwords match
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!masterPassword || !confirmPassword || masterPassword !== confirmPassword || isLoading || (passwordStrength && passwordStrength.score < 60)}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              {isLoading ? 'Creating Master Password...' : 'Create Master Password'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">Important Security Notice</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Your master password encrypts all your credentials</li>
              <li>• We cannot recover your master password if you forget it</li>
              <li>• Choose a password you'll remember but others can't guess</li>
              <li>• Consider using a passphrase with multiple words</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}