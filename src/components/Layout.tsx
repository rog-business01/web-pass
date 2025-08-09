import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Key, 
  Settings, 
  FileText, 
  LayoutDashboard,
  LogOut,
  Lock,
  LockKeyhole
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { logout, lockVault, user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Vault', href: '/vault', icon: Lock },
    { name: 'Generator', href: '/generator', icon: Key },
    { name: 'Security', href: '/security', icon: Shield },
    { name: 'Documentation', href: '/documentation', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-prose">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center px-6 py-6">
              <Shield className="h-8 w-8 text-brand" />
              <span className="ml-2 text-xl font-bold text-prose">SecureVault</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-brand/10 text-brand border border-brand/20'
                        : 'text-muted hover:bg-brand/5 hover:text-prose'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Logout */}
            <div className="p-4">
              <button
                onClick={lockVault}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted hover:bg-orange-600/20 hover:text-orange-400 rounded-lg transition-all duration-200 mb-2"
              >
                <LockKeyhole className="mr-3 h-5 w-5" />
                Lock Vault
              </button>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
              <div className="mt-3 px-4 py-2 bg-background rounded-lg">
                <p className="text-xs text-muted">Signed in as</p>
                <p className="text-sm text-prose truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="pl-64 flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}