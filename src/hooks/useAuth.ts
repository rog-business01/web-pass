import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../services/firebase';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CryptoService } from '../services/CryptoService';
import { encodeBase64 } from 'tweetnacl-util';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [masterPasswordUnlocked, setMasterPasswordUnlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await checkMasterPasswordExists(user.uid);
      } else {
        setHasMasterPassword(false);
        setMasterPasswordUnlocked(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkMasterPasswordExists = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setHasMasterPassword(!!userData.masterPasswordHash);
      } else {
        setHasMasterPassword(false);
      }
    } catch (error) {
      console.error('Error checking master password:', error);
      setHasMasterPassword(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
        masterPasswordHash: null
      });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const createMasterPassword = async (masterPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Derive the raw encryption key from the master password.
      const masterKeyRaw = CryptoService.deriveMasterKeyRaw(masterPassword);
      
      // Create a separate hash for verification.
      const verificationHash = CryptoService.createVerificationHash(masterKeyRaw);

      // Store the verification hash in Firestore.
      await setDoc(doc(db, 'users', user.uid), {
        masterPasswordHash: verificationHash,
        updatedAt: new Date()
      }, { merge: true });

      // Encode the raw key to Base64 and store it in session storage for encryption.
      const masterKeyB64 = encodeBase64(masterKeyRaw);
      sessionStorage.setItem('masterKey', masterKeyB64);
      setHasMasterPassword(true);
      setMasterPasswordUnlocked(true);
      return true;
    } catch (error) {
      console.error('Failed to create master password:', error);
      return false;
    }
  };

  const unlockMasterPassword = async (masterPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Derive the raw encryption key from the entered password.
      const masterKeyRaw = CryptoService.deriveMasterKeyRaw(masterPassword);

      // Create a verification hash from the derived key.
      const verificationHash = CryptoService.createVerificationHash(masterKeyRaw);
      
      // Get the stored verification hash from Firestore.
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return false;
      
      const userData = userDoc.data();
      const storedHash = userData.masterPasswordHash;
      
      // Verify the password by comparing the generated hash with the stored hash.
      if (verificationHash === storedHash) {
        // If verification is successful, store the Base64-encoded raw key in session.
        const masterKeyB64 = encodeBase64(masterKeyRaw);
        sessionStorage.setItem('masterKey', masterKeyB64);
        setMasterPasswordUnlocked(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Master password unlock failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      setMasterPasswordUnlocked(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const lockVault = () => {
    sessionStorage.removeItem('masterKey');
    setMasterPasswordUnlocked(false);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasMasterPassword,
    masterPasswordUnlocked,
    login,
    register,
    logout,
    createMasterPassword,
    unlockMasterPassword,
    lockVault
  };
}