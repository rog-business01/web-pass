import React from 'react';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';

export function Security() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
        <p className="text-gray-400">Monitor and manage your security settings and audit logs</p>
      </div>

      {/* Security Score */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">Security Score</h3>
            <p className="text-gray-400">Based on password strength, 2FA coverage, and security practices</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400">92</div>
            <div className="text-sm text-gray-400">out of 100</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style={{ width: '92%' }} />
        </div>
      </div>

      {/* Security Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SecurityCategory
          title="Password Security"
          score={88}
          status="good"
          icon={Lock}
          items={[
            { text: '22 strong passwords', status: 'good' },
            { text: '2 weak passwords', status: 'warning' },
            { text: '0 reused passwords', status: 'good' },
          ]}
        />
        
        <SecurityCategory
          title="Two-Factor Auth"
          score={75}
          status="warning"
          icon={Shield}
          items={[
            { text: '18/24 accounts protected', status: 'warning' },
            { text: 'TOTP enabled', status: 'good' },
            { text: '6 accounts need 2FA', status: 'warning' },
          ]}
        />
        
        <SecurityCategory
          title="Data Protection"
          score={95}
          status="good"
          icon={Key}
          items={[
            { text: 'AES-256 encryption', status: 'good' },
            { text: 'Zero-knowledge architecture', status: 'good' },
            { text: 'Regular backups', status: 'good' },
          ]}
        />
      </div>

      {/* Security Recommendations */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-orange-400" />
          Security Recommendations
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-orange-600/10 border border-orange-500/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-white">Enable 2FA for remaining accounts</h4>
              <p className="text-sm text-gray-400 mt-1">6 accounts don't have two-factor authentication enabled</p>
              <button className="text-sm text-orange-400 hover:text-orange-300 mt-2">View accounts →</button>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
            <Info className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-white">Update weak passwords</h4>
              <p className="text-sm text-gray-400 mt-1">2 passwords are considered weak and should be updated</p>
              <button className="text-sm text-yellow-400 hover:text-yellow-300 mt-2">Generate strong passwords →</button>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-white">Regular password rotation</h4>
              <p className="text-sm text-gray-400 mt-1">Consider updating passwords that are over 90 days old</p>
              <button className="text-sm text-blue-400 hover:text-blue-300 mt-2">View old passwords →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Security Events</h3>
          
          <div className="space-y-4">
            {[
              { type: 'success', icon: CheckCircle, text: 'Security scan completed successfully', time: '2 hours ago' },
              { type: 'warning', icon: AlertTriangle, text: 'Weak password detected for LinkedIn', time: '1 day ago' },
              { type: 'info', icon: Shield, text: '2FA enabled for GitHub account', time: '2 days ago' },
              { type: 'success', icon: Lock, text: 'Password updated for email account', time: '3 days ago' },
            ].map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <event.icon className={`h-5 w-5 mt-0.5 ${
                  event.type === 'success' ? 'text-green-400' :
                  event.type === 'warning' ? 'text-orange-400' :
                  'text-blue-400'
                }`} />
                <div>
                  <p className="text-sm text-white">{event.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Security Actions</h3>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-white font-medium">Export Security Report</p>
                  <p className="text-sm text-gray-400">Download detailed security analysis</p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-white font-medium">Run Security Scan</p>
                  <p className="text-sm text-gray-400">Check for security vulnerabilities</p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <Key className="h-5 w-5 text-purple-400 mr-3" />
                <div>
                  <p className="text-white font-medium">Backup Encryption Keys</p>
                  <p className="text-sm text-gray-400">Secure backup of your encryption keys</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SecurityCategoryProps {
  title: string;
  score: number;
  status: 'good' | 'warning' | 'danger';
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{ text: string; status: 'good' | 'warning' | 'danger' }>;
}

function SecurityCategory({ title, score, status, icon: Icon, items }: SecurityCategoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400 border-green-500/30';
      case 'warning':
        return 'text-orange-400 border-orange-500/30';
      case 'danger':
        return 'text-red-400 border-red-500/30';
      default:
        return 'text-gray-400 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-black/20 backdrop-blur-xl border ${getStatusColor(status)} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`h-6 w-6 mr-2 ${getStatusColor(status).split(' ')[0]}`} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              item.status === 'good' ? 'bg-green-400' :
              item.status === 'warning' ? 'bg-orange-400' :
              'bg-red-400'
            }`} />
            <span className="text-gray-300">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}