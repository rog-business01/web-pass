import React from 'react';
import { Key, Shield, Download, AlertTriangle } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      type: 'password_generated',
      message: 'Generated strong password for GitHub',
      time: '2 hours ago',
      icon: Key,
      color: 'text-green-400',
    },
    {
      type: 'backup_completed',
      message: 'Encrypted backup completed',
      time: '4 hours ago',
      icon: Download,
      color: 'text-blue-400',
    },
    {
      type: 'weak_password_detected',
      message: 'Weak password detected for LinkedIn',
      time: '1 day ago',
      icon: AlertTriangle,
      color: 'text-orange-400',
    },
    {
      type: 'security_scan',
      message: 'Security scan completed',
      time: '2 days ago',
      icon: Shield,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-prose mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-background ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-prose">{activity.message}</p>
              <p className="text-xs text-muted mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}