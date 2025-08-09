import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../services/firebase';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CryptoService } from '../services/CryptoService';

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
      // Hash the master password for storage verification
      const masterPasswordHash = await CryptoService.deriveMasterKey(masterPassword);
      
      // Store the hash in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        masterPasswordHash: masterPasswordHash,
        updatedAt: new Date()
      }, { merge: true });

      // Store the derived key in session for immediate use
      sessionStorage.setItem('masterKey', masterPasswordHash);
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
      // Derive the key from the entered password
      const derivedKey = await CryptoService.deriveMasterKey(masterPassword);
      
      // Get the stored hash from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return false;
      
      const userData = userDoc.data();
      const storedHash = userData.masterPasswordHash;
      
      // Verify the password by comparing hashes
      if (derivedKey === storedHash) {
        sessionStorage.setItem('masterKey', derivedKey);
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