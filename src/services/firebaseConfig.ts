/**
 * Configuración centralizada de Firebase SDK para TransiMóvil.
 * Compatible con Firebase Web SDK v9+ y React Native / Expo.
 */

const metaEnv = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_FIREBASE_API_KEY : '') || 'AIzaSyMockTransiMovilKey2025Demo',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'transimovil-app.firebaseapp.com',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'transimovil-app',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'transimovil-app.appspot.com',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '105822320757',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:105822320757:web:892374823482348',
};

/**
 * Código fuente para inicialización nativa en Expo / React Native:
 * 
 * ```typescript
 * import { initializeApp, getApps, getApp } from 'firebase/app';
 * import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
 * import { getFirestore } from 'firebase/firestore';
 * import { getStorage } from 'firebase/storage';
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * 
 * const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
 * 
 * export const auth = initializeAuth(app, {
 *   persistence: getReactNativePersistence(AsyncStorage),
 * });
 * export const db = getFirestore(app);
 * export const storage = getStorage(app);
 * ```
 */

export const isFirebaseConfigured = () => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== 'AIzaSyMockTransiMovilKey2025Demo'
  );
};
