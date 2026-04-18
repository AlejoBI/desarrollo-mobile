import { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '../firebase/config';

export interface FirebaseAuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const FIREBASE_CONFIG_ERROR = 'Firebase no esta configurado. Define las variables VITE_FIREBASE_*.';

export const useFirebaseAuth = (): FirebaseAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      return Promise.reject(new Error(FIREBASE_CONFIG_ERROR));
    }

    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const register = useCallback((email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      return Promise.reject(new Error(FIREBASE_CONFIG_ERROR));
    }

    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const logout = useCallback(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      return Promise.resolve();
    }

    return signOut(firebaseAuth);
  }, []);

  return { user, loading, login, register, logout };
};
