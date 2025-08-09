import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
  green: 'bg-green-600/20 border-green-500/30 text-green-400',
  orange: 'bg-orange-600/20 border-orange-500/30 text-orange-400',
  purple: 'bg-purple-600/20 border-purple-500/30 text-purple-400',
};

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </div>
  );
}