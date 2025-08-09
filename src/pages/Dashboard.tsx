import React from 'react';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { SecurityStatus } from '../components/SecurityStatus';
import { RecentActivity } from '../components/RecentActivity';

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-gray-400">Monitor your credential security and system status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Credentials"
          value="24"
          change="+3 this month"
          icon={Lock}
          color="blue"
        />
        <StatsCard
          title="Security Score"
          value="92/100"
          change="+5 this week"
          icon={Shield}
          color="green"
        />
        <StatsCard
          title="Weak Passwords"
          value="2"
          change="-1 this month"
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="2FA Enabled"
          value="18/24"
          change="75% coverage"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Status */}
        <div className="lg:col-span-2">
          <SecurityStatus />
        </div>
        
        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* System Architecture Overview */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-blue-400" />
          Zero-Knowledge Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full border border-green-500/30 flex items-center justify-center mx-auto mb-3">
              <Key className="h-8 w-8 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Client-Side Encryption</h4>
            <p className="text-sm text-gray-400">All encryption happens in your browser using PBKDF2 + AES-256</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Zero Server Knowledge</h4>
            <p className="text-sm text-gray-400">We never see your master password or decrypted data</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Secure Storage</h4>
            <p className="text-sm text-gray-400">Encrypted data stored locally with optional secure sync</p>
          </div>
        </div>
      </div>
    </div>
  );
}