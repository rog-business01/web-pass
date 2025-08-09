import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vault } from './pages/Vault';
import { Generator } from './pages/Generator';
import { Security } from './pages/Security';
import { Documentation } from './pages/Documentation';
import { Login } from './pages/Login';
import { MasterPasswordSetup } from './pages/MasterPasswordSetup';
import { MasterPasswordUnlock } from './pages/MasterPasswordUnlock';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, isLoading, hasMasterPassword, masterPasswordUnlocked } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!hasMasterPassword) {
    return <MasterPasswordSetup />;
  }

  if (!masterPasswordUnlocked) {
    return <MasterPasswordUnlock />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/security" element={<Security />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;