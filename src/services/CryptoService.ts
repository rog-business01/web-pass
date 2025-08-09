import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import * as nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

export class CryptoService {
  private static readonly SALT = 'credentials-manager-salt-v1';
  private static readonly ITERATIONS = 100000;

  /**
   * Derives a master key from the user's master password using PBKDF2
   * This implements zero-knowledge architecture - the server never sees this key
   */
  static deriveMasterKeyRaw(masterPassword: string): Uint8Array {
    const salt = encodeUTF8(this.SALT);
    const password = encodeUTF8(masterPassword);
    
    return pbkdf2(sha256, password, salt, {
      c: this.ITERATIONS,
      dkLen: 32
    });
  }

  static createVerificationHash(key: Uint8Array): string {
    const hash = sha256(key);
    return encodeBase64(hash);
  }

  /**
   * Encrypts data using AES-256-GCM equivalent (XSalsa20Poly1305)
   * Uses NaCl (libsodium) for authenticated encryption
   */
  static encrypt(data: string, masterKey: string): string {
    const key = decodeBase64(masterKey);
    const message = encodeUTF8(data);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    
    const encrypted = nacl.secretbox(message, nonce, key);
    
    // Combine nonce and encrypted data
    const combined = new Uint8Array(nonce.length + encrypted.length);
    combined.set(nonce);
    combined.set(encrypted, nonce.length);
    
    return encodeBase64(combined);
  }

  /**
   * Decrypts data using authenticated decryption
   */
  static decrypt(encryptedData: string, masterKey: string): string {
    const key = decodeBase64(masterKey);
    const combined = decodeBase64(encryptedData);
    
    const nonce = combined.slice(0, nacl.secretbox.nonceLength);
    const encrypted = combined.slice(nacl.secretbox.nonceLength);
    
    const decrypted = nacl.secretbox.open(encrypted, nonce, key);
    if (!decrypted) {
      throw new Error('Decryption failed - data may be corrupted');
    }
    
    return decodeUTF8(decrypted);
  }

  /**
   * Generates cryptographically secure passwords
   */
  static generatePassword(options: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean;
  }): string {
    const {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar
    } = options;

    let charset = '';
    
    if (includeUppercase) {
      charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeLowercase) {
      charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    }
    if (includeNumbers) {
      charset += excludeSimilar ? '23456789' : '0123456789';
    }
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (charset === '') {
      throw new Error('At least one character type must be selected');
    }

    const randomBytes = nacl.randomBytes(length);
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }

    return password;
  }

  /**
   * Calculates password strength score (0-100)
   */
  static calculatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
    crackTime: string;
  } {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else feedback.push('Use at least 12 characters');
    
    // Character variety
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else feedback.push('Add symbols');
    
    // Pattern detection
    if (!/(.)\1{2,}/.test(password)) score += 10;
    else feedback.push('Avoid repeated characters');
    
    // Crack time estimation
    const charset = this.estimateCharset(password);
    const combinations = Math.pow(charset, password.length);
    const crackTime = this.estimateCrackTime(combinations);
    
    return { score: Math.min(score, 100), feedback, crackTime };
  }

  private static estimateCharset(password: string): number {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;
    return charset;
  }

  private static estimateCrackTime(combinations: number): string {
    // Assume 1 billion guesses per second
    const seconds = combinations / 2 / 1000000000;
    
    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  }
}