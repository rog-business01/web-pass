import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { SecurityStatus } from '../components/SecurityStatus';
import { RecentActivity } from '../components/RecentActivity';
import { useAuth } from '../hooks/useAuth';
import { CryptoService } from '../services/CryptoService';

// Define the Credential type, mirroring Vault.tsx
interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardStats {
  totalCredentials: number;
  securityScore: number;
  weakPasswords: number;
  twoFaEnabled: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCredentials: 0,
    securityScore: 0,
    weakPasswords: 0,
    twoFaEnabled: 0,
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = () => {
    const masterKey = sessionStorage.getItem('masterKey');
    if (!masterKey) return;

    const encryptedData = localStorage.getItem(`credentials_${user?.uid}`);
    if (encryptedData) {
      try {
        const decryptedData = CryptoService.decrypt(encryptedData, masterKey);
        const credentials: Credential[] = JSON.parse(decryptedData);
        calculateStats(credentials);
      } catch (error) {
        console.error('Failed to decrypt credentials for dashboard:', error);
      }
    }
  };

  const calculateStats = (credentials: Credential[]) => {
    const totalCredentials = credentials.length;

    let weakPasswords = 0;
    let securityScoreSum = 0;

    credentials.forEach(cred => {
      const strength = CryptoService.calculatePasswordStrength(cred.password);
      if (strength.score < 50) {
        weakPasswords++;
      }
      securityScoreSum += strength.score;
    });

    const averageSecurityScore = totalCredentials > 0 ? Math.round(securityScoreSum / totalCredentials) : 100;

    // 2FA calculation is a placeholder as we don't store that info yet.
    // We'll simulate it based on the number of credentials.
    const twoFaEnabled = Math.floor(totalCredentials * 0.75);

    setStats({
      totalCredentials,
      securityScore: averageSecurityScore,
      weakPasswords,
      twoFaEnabled,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-prose mb-2">Security Dashboard</h1>
        <p className="text-muted">Monitor your credential security and system status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Credentials"
          value={stats.totalCredentials.toString()}
          change="All stored locally"
          icon={Lock}
          color="brand"
        />
        <StatsCard
          title="Avg. Security Score"
          value={`${stats.securityScore}/100`}
          change={stats.securityScore > 80 ? 'Strong' : 'Needs improvement'}
          icon={Shield}
          color="green"
        />
        <StatsCard
          title="Weak Passwords"
          value={stats.weakPasswords.toString()}
          change={stats.weakPasswords > 0 ? 'Review these' : 'None found'}
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="2FA Enabled"
          value={`${stats.twoFaEnabled}/${stats.totalCredentials}`}
          change="(Placeholder)"
          icon={CheckCircle}
          color="brand"
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
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-prose mb-4 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-brand" />
          Zero-Knowledge Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full border border-brand/20 flex items-center justify-center mx-auto mb-3">
              <Key className="h-8 w-8 text-brand" />
            </div>
            <h4 className="font-semibold text-prose mb-2">Client-Side Encryption</h4>
            <p className="text-sm text-muted">All encryption happens in your browser using PBKDF2 + AES-256</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full border border-brand/20 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8 text-brand" />
            </div>
            <h4 className="font-semibold text-prose mb-2">Zero Server Knowledge</h4>
            <p className="text-sm text-muted">We never see your master password or decrypted data</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full border border-brand/20 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-8 w-8 text-brand" />
            </div>
            <h4 className="font-semibold text-prose mb-2">Secure Storage</h4>
            <p className="text-sm text-muted">Encrypted data stored locally with optional secure sync</p>
          </div>
        </div>
      </div>
    </div>
  );
}