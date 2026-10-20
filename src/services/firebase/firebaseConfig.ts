/**
 * Configuración de Firebase para CHEEMS (Valle de Ubaté)
 * Proporciona el cliente de Firebase Firestore y Auth con almacenamiento persistente local
 * para compatibilidad en navegador web y Expo / React Native.
 */

export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyCheemsUbateDemoKey2025',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'cheems-ubate.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'cheems-ubate-movilidad',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'cheems-ubate-movilidad.appspot.com',
  messagingSenderId: '105822320757',
  appId: '1:105822320757:web:cheemsubate2025',
};

export const FIRESTORE_COLLECTIONS = {
  USUARIOS: 'usuarios',
  TARIFAS: 'tarifas',
  UBICACIONES_CONDUCTORES: 'ubicaciones_conductores',
  PQRS: 'pqrs',
} as const;
