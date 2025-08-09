import React from 'react';
import { FileText, Shield, Key, Lock, Code, Server, Database, Globe } from 'lucide-react';

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-prose">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-prose mb-2">Technical Documentation</h1>
        <p className="text-muted">Complete technical specifications and implementation details</p>
      </div>

      {/* Table of Contents */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-prose mb-4">Table of Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'System Architecture', anchor: '#architecture', icon: Server },
            { title: 'Security Implementation', anchor: '#security', icon: Shield },
            { title: 'Encryption Methods', anchor: '#encryption', icon: Lock },
            { title: 'Technology Stack', anchor: '#tech-stack', icon: Code },
            { title: 'API Documentation', anchor: '#api', icon: Globe },
            { title: 'Database Schema', anchor: '#database', icon: Database },
          ].map((item, index) => (
            <a
              key={index}
              href={item.anchor}
              className="flex items-center p-3 bg-background hover:bg-brand/10 border border-border rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5 text-brand mr-3" />
              <span className="text-prose">{item.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* System Architecture */}
      <section id="architecture" className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-prose mb-6 flex items-center">
          <Server className="h-6 w-6 mr-2 text-brand" />
          System Architecture
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Zero-Knowledge Architecture</h3>
            <div className="bg-background border border-border rounded-lg p-4">
              <pre className="text-sm text-muted overflow-x-auto">
{`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Device   │    │   Application   │    │ Storage Layer   │
│                 │    │                 │    │                 │
│ Master Password │───▶│ Key Derivation  │    │ Encrypted Data  │
│                 │    │ (PBKDF2+SHA256) │    │                 │
│                 │    │                 │    │                 │
│ Plaintext Data  │───▶│ AES-256 Encrypt │───▶│ Ciphertext Only │
│                 │    │ (Client-Side)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              Zero Knowledge:                  │
         │           Server never sees:                  │
         │        • Master Password                      │
         │        • Derived Keys                         │
         └────────• Plaintext Data ─────────────────────┘`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Component Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand/10 border border-brand/20 rounded-lg p-4">
                <h4 className="font-medium text-brand mb-2">Frontend Components</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Crypto Service Layer</li>
                  <li>• Secure Storage Manager</li>
                  <li>• Password Generator</li>
                  <li>• Auto-fill Integration</li>
                </ul>
              </div>
              <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Security Layer</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• TweetNaCl (libsodium)</li>
                  <li>• @noble/hashes</li>
                  <li>• Web Crypto API</li>
                  <li>• PBKDF2 Key Derivation</li>
                  <li>• AES-256-GCM Encryption</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Implementation */}
      <section id="security" className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-prose mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-green-400" />
          Security Implementation
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Encryption Flow</h3>
            <div className="bg-background border border-border rounded-lg p-4">
              <pre className="text-sm text-muted overflow-x-auto">
{`1. Master Password Entry
   ↓
2. PBKDF2 Key Derivation
   • Salt: "credentials-manager-salt-v1"
   • Iterations: 100,000
   • Hash Function: SHA-256
   • Output Length: 32 bytes
   ↓
3. Data Encryption (per credential)
   • Algorithm: XSalsa20Poly1305 (NaCl)
   • Key: Derived master key
   • Nonce: Random 24 bytes
   • Authentication: Built-in MAC
   ↓
4. Secure Storage
   • Format: Base64(nonce + ciphertext)
   • Location: localStorage (demo) / Secure backend
   • No plaintext data stored`}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-prose mb-3">Attack Mitigation</h3>
              <div className="space-y-3">
                <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-3">
                  <h4 className="font-medium text-red-400">Brute Force Protection</h4>
                  <p className="text-sm text-muted mt-1">
                    PBKDF2 with 100,000 iterations makes password cracking computationally expensive
                  </p>
                </div>
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-lg p-3">
                  <h4 className="font-medium text-orange-400">Timing Attack Prevention</h4>
                  <p className="text-sm text-muted mt-1">
                    Constant-time comparisons and authenticated encryption prevent timing analysis
                  </p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-400">Data Integrity</h4>
                  <p className="text-sm text-muted mt-1">
                    Authenticated encryption ensures data hasn't been tampered with
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-prose mb-3">Security Checklist</h3>
              <div className="space-y-2">
                {[
                  'Client-side encryption only',
                  'Zero-knowledge architecture',
                  'Cryptographically secure RNG',
                  'Authenticated encryption',
                  'Secure key derivation (PBKDF2)',
                  'No plaintext storage',
                  'Memory-safe languages',
                  'Regular security audits',
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech-stack" className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-prose mb-6 flex items-center">
          <Code className="h-6 w-6 mr-2 text-brand" />
          Technology Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Frontend</h3>
            <div className="space-y-2">
              {[
                { name: 'React 18', version: '^18.3.1', purpose: 'UI Framework' },
                { name: 'TypeScript', version: '^5.5.3', purpose: 'Type Safety' },
                { name: 'Tailwind CSS', version: '^3.4.1', purpose: 'Styling' },
                { name: 'Vite', version: '^5.4.2', purpose: 'Build Tool' },
              ].map((tech, index) => (
                <div key={index} className="bg-background border border-border rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-prose font-medium">{tech.name}</span>
                    <span className="text-xs text-brand">{tech.version}</span>
                  </div>
                  <p className="text-xs text-muted">{tech.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Cryptography</h3>
            <div className="space-y-2">
              {[
                { name: 'TweetNaCl', version: '^1.0.3', purpose: 'NaCl Crypto Library' },
                { name: '@noble/hashes', version: '^1.3.3', purpose: 'Hash Functions' },
                { name: 'Web Crypto API', version: 'Native', purpose: 'Browser Crypto' },
              ].map((tech, index) => (
                <div key={index} className="bg-background border border-border rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-prose font-medium">{tech.name}</span>
                    <span className="text-xs text-green-400">{tech.version}</span>
                  </div>
                  <p className="text-xs text-muted">{tech.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Recommended Backend</h3>
            <div className="space-y-2">
              {[
                { name: 'Node.js', version: '18+', purpose: 'Runtime' },
                { name: 'Express/Fastify', version: 'Latest', purpose: 'Web Framework' },
                { name: 'PostgreSQL', version: '14+', purpose: 'Database' },
                { name: 'Redis', version: '6+', purpose: 'Session Store' },
              ].map((tech, index) => (
                <div key={index} className="bg-background border border-border rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-prose font-medium">{tech.name}</span>
                    <span className="text-xs text-orange-400">{tech.version}</span>
                  </div>
                  <p className="text-xs text-muted">{tech.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section id="api" className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibent text-prose mb-6 flex items-center">
          <Globe className="h-6 w-6 mr-2 text-brand" />
          API Documentation
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Core API Methods</h3>
            <div className="bg-background border border-border rounded-lg p-4">
              <pre className="text-sm text-muted overflow-x-auto">
{`// Crypto Service API
class CryptoService {
  // Key derivation from master password
  static async deriveMasterKey(masterPassword: string): Promise<string>
  
  // Encrypt data with master key
  static encrypt(data: string, masterKey: string): string
  
  // Decrypt data with master key
  static decrypt(encryptedData: string, masterKey: string): string
  
  // Generate secure passwords
  static generatePassword(options: PasswordOptions): string
  
  // Calculate password strength
  static calculatePasswordStrength(password: string): StrengthResult
}

// Auto-fill Integration
class AutoFillService {
  // Detect login forms
  static detectLoginForm(): LoginForm | null
  
  // Fill credentials securely
  static fillCredentials(form: LoginForm, credentials: Credential): void
  
  // Generate auto-fill suggestions
  static getAutoFillSuggestions(domain: string): Credential[]
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-prose mb-3">Browser Extension API</h3>
            <div className="bg-brand/10 border border-brand/20 rounded-lg p-4">
              <h4 className="font-medium text-brand mb-2">Content Script Communication</h4>
              <pre className="text-sm text-muted">
{`// Message passing for secure auto-fill
chrome.runtime.sendMessage({
  type: 'GET_CREDENTIALS',
  domain: window.location.hostname
}, (response) => {
  if (response.credentials) {
    fillLoginForm(response.credentials);
  }
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security Audit */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-prose mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-red-400" />
          Security Audit Guidelines
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-prose mb-3">Automated Testing</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Static code analysis (ESLint, SonarQube)</li>
                <li>• Dependency vulnerability scanning</li>
                <li>• SAST (Static Application Security Testing)</li>
                <li>• Unit tests for crypto functions</li>
                <li>• Integration tests for encryption flow</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-prose mb-3">Manual Penetration Testing</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Memory analysis for key exposure</li>
                <li>• Side-channel attack testing</li>
                <li>• Browser security model validation</li>
                <li>• Network traffic analysis</li>
                <li>• Social engineering simulation</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="font-medium text-red-400 mb-2">Critical Security Requirements</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>✓ No plaintext storage of sensitive data</li>
              <li>✓ Master password never transmitted</li>
              <li>✓ Encryption keys derived client-side only</li>
              <li>✓ Authenticated encryption prevents tampering</li>
              <li>✓ Secure random number generation</li>
              <li>✓ Protection against timing attacks</li>
              <li>✓ Memory clearance of sensitive data</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}