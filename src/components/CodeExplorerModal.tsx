import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Shield, FileText } from 'lucide-react';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFile {
  name: string;
  category: 'config' | 'rules' | 'functions' | 'docs';
  description: string;
  icon: React.ReactNode;
  content: string;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const files: CodeFile[] = [
    {
      name: 'app.json',
      category: 'config',
      description: 'Configuración de Expo, permisos de GPS en segundo plano y Google Maps',
      icon: <Terminal className="w-4 h-4 text-blue-400" />,
      content: `{
  "expo": {
    "name": "TransiMóvil",
    "slug": "transimovil-transporte-publico",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "android": {
      "package": "com.transimovil.app",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "POST_NOTIFICATIONS"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "\${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}"
        }
      }
    }
  }
}`,
    },
    {
      name: 'firestore.rules',
      category: 'rules',
      description: 'Reglas restrictivas de Firestore (roles: admin, conductor, pasajero)',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(uid) { return isAuthenticated() && request.auth.uid == uid; }
    function isAdmin() { return request.auth.token.role == 'administrador'; }

    match /usuarios/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
    }

    match /tarifas/{tarifaId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    match /ubicaciones_conductores/{conductorId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(conductorId);
    }

    match /pqrs/{pqrsId} {
      allow read: if isAuthenticated() && (resource.data.usuarioId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.usuarioId == request.auth.uid;
      allow update: if isAdmin();
    }
  }
}`,
    },
    {
      name: 'storage.rules',
      category: 'rules',
      description: 'Reglas de Firebase Storage para adjuntos PDF/JPG < 10MB',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      content: `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pqrs/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId &&
        request.resource.size < 10 * 1024 * 1024 &&
        (request.resource.contentType.matches('image/.*') || request.resource.contentType == 'application/pdf');
    }
  }
}`,
    },
    {
      name: 'functions/src/index.ts',
      category: 'functions',
      description: 'Cloud Functions: Correo de bienvenida y notificaciones PQRS',
      icon: <FileCode className="w-4 h-4 text-amber-400" />,
      content: `import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const enviarCorreoBienvenida = functions.auth.user().onCreate(async (user) => {
  console.log('Enviando correo de bienvenida a:', user.email);
});

export const notificarCambioEstadoPQRS = functions.firestore
  .document('pqrs/{pqrsId}')
  .onUpdate(async (change, context) => {
    const despues = change.after.data();
    console.log('Notificando cambio de estado PQRS:', despues.estado);
  });`,
    },
    {
      name: '.env.example',
      category: 'config',
      description: 'Variables de entorno cliente para Firebase y Google Maps',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      content: `EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=transimovil.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=transimovil-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=transimovil-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=105822320757
EXPO_PUBLIC_FIREBASE_APP_ID=1:105822320757:web:...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...`,
    },
  ];

  const [activeFile, setActiveFile] = useState<CodeFile>(files[0]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = selectedCategory === 'todos'
    ? files
    : files.filter((f) => f.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Archivos Nativos de Arquitectura</h3>
              <p className="text-xs text-slate-400">Archivos listos para exportar a Expo CLI, Firebase y Google Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950/40 p-3 overflow-y-auto">
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-xs">
              {['todos', 'config', 'rules', 'functions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {filtered.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition ${
                    activeFile.name === file.name
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {file.icon}
                  <div className="truncate">
                    <p className="font-mono text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{file.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900/90">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-medium text-slate-200">{activeFile.name}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '¡Copiado!' : 'Copiar archivo'}
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed">
              <pre>
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
