import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function SecurityStatus() {
  const securityItems = [
    {
      title: 'Password Strength Analysis',
      status: 'good',
      message: '22 strong passwords, 2 weak passwords detected',
      action: 'Update weak passwords',
      icon: Shield,
    },
    {
      title: 'Two-Factor Authentication',
      status: 'warning',
      message: '6 accounts without 2FA protection',
      action: 'Enable 2FA for remaining accounts',
      icon: AlertTriangle,
    },
    {
      title: 'Data Backup Status',
      status: 'good',
      message: 'Last backup: 2 hours ago',
      action: 'Backup is current',
      icon: CheckCircle,
    },
    {
      title: 'Password Age Monitoring',
      status: 'info',
      message: '4 passwords over 90 days old',
      action: 'Consider rotating old passwords',
      icon: Clock,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'warning':
        return 'text-orange-400 bg-orange-600/20 border-orange-500/30';
      case 'info':
        return 'text-brand bg-brand/10 border-brand/20';
      default:
        return 'text-muted bg-muted/10 border-muted/20';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-prose mb-6">Security Status</h3>
      <div className="space-y-4">
        {securityItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border">
            <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-prose">{item.title}</h4>
              <p className="text-sm text-muted mt-1">{item.message}</p>
              <p className="text-sm text-brand mt-2">{item.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}