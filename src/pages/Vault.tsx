import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { CryptoService } from '../services/CryptoService';
import { useAuth } from '../hooks/useAuth';

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

export function Vault() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    const masterKey = sessionStorage.getItem('masterKey');
    if (!masterKey) return;

    const encryptedData = localStorage.getItem(`credentials_${user?.uid || 'demo'}`);
    if (encryptedData) {
      try {
        const decryptedData = CryptoService.decrypt(encryptedData, masterKey);
        setCredentials(JSON.parse(decryptedData));
      } catch (error) {
        console.error('Failed to decrypt credentials:', error);
      }
    }
  };

  const saveCredentials = (updatedCredentials: Credential[]) => {
    const masterKey = sessionStorage.getItem('masterKey');
    if (!masterKey) return;

    const encryptedData = CryptoService.encrypt(JSON.stringify(updatedCredentials), masterKey);
    localStorage.setItem(`credentials_${user?.uid || 'demo'}`, encryptedData);
    setCredentials(updatedCredentials);
  };

  const addCredential = (credential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCredential: Credential = {
      ...credential,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveCredentials([...credentials, newCredential]);
  };

  const updateCredential = (updatedCredential: Credential) => {
    const updated = credentials.map(cred =>
      cred.id === updatedCredential.id
        ? { ...updatedCredential, updatedAt: new Date() }
        : cred
    );
    saveCredentials(updated);
  };

  const deleteCredential = (id: string) => {
    const filtered = credentials.filter(cred => cred.id !== id);
    saveCredentials(filtered);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredCredentials = credentials.filter(cred =>
    cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cred.url && cred.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Password Vault</h1>
          <p className="text-gray-400">Securely manage your credentials with zero-knowledge encryption</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Credential
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search credentials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Credentials List */}
      <div className="grid gap-4">
        {filteredCredentials.map(credential => (
          <div key={credential.id} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-white mr-3">{credential.title}</h3>
                  {credential.url && (
                    <a
                      href={credential.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Username:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{credential.username}</span>
                      <button
                        onClick={() => copyToClipboard(credential.username)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Password:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono">
                        {showPasswords[credential.id] ? credential.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(credential.id)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords[credential.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(credential.password)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {credential.notes && (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-300">{credential.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingCredential(credential)}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteCredential(credential.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCredential) && (
        <CredentialModal
          credential={editingCredential}
          onSave={(credential) => {
            if (editingCredential) {
              updateCredential({ ...credential, id: editingCredential.id } as Credential);
            } else {
              addCredential(credential);
            }
            setShowAddModal(false);
            setEditingCredential(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingCredential(null);
          }}
        />
      )}
    </div>
  );
}

interface CredentialModalProps {
  credential?: Credential | null;
  onSave: (credential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

function CredentialModal({ credential, onSave, onClose }: CredentialModalProps) {
  const [formData, setFormData] = useState({
    title: credential?.title || '',
    username: credential?.username || '',
    password: credential?.password || '',
    url: credential?.url || '',
    notes: credential?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generatePassword = () => {
    const password = CryptoService.generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: true,
    });
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">
          {credential ? 'Edit Credential' : 'Add Credential'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username/Email</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL (optional)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}