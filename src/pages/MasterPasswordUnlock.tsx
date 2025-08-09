import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function MasterPasswordUnlock() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { unlockMasterPassword, logout, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) return;
    
    setIsLoading(true);
    setError('');
    
    const success = await unlockMasterPassword(masterPassword);
    
    if (!success) {
      setError('Invalid master password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-full border border-brand/20 mb-4">
              <Lock className="h-8 w-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-prose mb-2">Unlock Your Vault</h1>
            <p className="text-muted">Enter your master password to access your credentials</p>
            <p className="text-sm text-brand mt-2">Signed in as {user?.email}</p>
          </div>

          {/* Unlock Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="masterPassword" className="block text-sm font-medium text-muted mb-2">
                Master Password
              </label>
              <div className="relative">
                <input
                  id="masterPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-prose placeholder-muted focus:outline-none focus:border-brand/50 focus:bg-surface transition-all duration-200"
                  placeholder="Enter your master password"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-prose transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!masterPassword || isLoading}
              className="w-full py-3 px-4 bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              {isLoading ? 'Unlocking...' : 'Unlock Vault'}
            </button>
          </form>

          {/* Actions */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={logout}
              className="flex items-center text-sm text-muted hover:text-prose transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out and use different account
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted">
              Your master password is used to decrypt your credentials locally.
              <br />
              It is never transmitted to our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}