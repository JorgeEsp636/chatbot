# 🚍 TransiMóvil - Aplicación Móvil de Transporte Público

Plataforma integral de transporte público desarrollada con **React Native, Expo, TypeScript, Firebase y Google Maps**. Diseñada con arquitectura modular basada en características (*features*), tiempo real con Firestore `onSnapshot`, rastreo GPS cada 5 segundos para conductores, cálculo de rutas con Google Directions API, gestión de tarifas y atención ciudadana (PQRS) con soporte de adjuntos en Firebase Storage.

---

## 📋 Tabla de Contenidos
1. [Arquitectura del Proyecto](#1-arquitectura-del-proyecto)
2. [Estructura de Carpetas](#2-estructura-de-carpetas)
3. [Requisitos Previos e Instalación](#3-requisitos-previos-e-instalación)
4. [Configuración de Firebase](#4-configuración-de-firebase)
5. [Configuración de Google Maps y Directions API](#5-configuración-de-google-maps-y-directions-api)
6. [Variables de Entorno (.env)](#6-variables-de-entorno-env)
7. [Sistema de Notificaciones (Push & In-App)](#7-sistema-de-notificaciones-push--in-app)
8. [Despliegue de Firebase Cloud Functions](#8-despliegue-de-firebase-cloud-functions)
9. [Reglas de Seguridad (Firestore & Storage)](#9-reglas-de-seguridad-firestore--storage)
10. [Instrucciones para Ejecutar y Probar](#10-instrucciones-para-ejecutar-y-probar)

---

## 1. Arquitectura del Proyecto

El proyecto sigue una arquitectura **Feature-Driven** (orientada por funcionalidades), garantizando que cada dominio del negocio sea modular, testeable e independiente:

- **Autenticación (`features/auth`)**: Registro con verificación de correo obligatoria (`sendEmailVerification`), login seguro y protección de rutas.
- **Dashboard (`features/dashboard`)**: Resumen de usuario, accesos rápidos, métricas de operación y saldo en tarjeta.
- **Tarifario (`features/tarifas`)**: CRUD reactivo mediante Firestore `onSnapshot` con validaciones y control de activación.
- **Mapa y GPS (`features/mapa`)**:
  - *Modo Conductor*: Envío de telemetría GPS (latitud, longitud, rumbo, velocidad) cada **5 segundos**.
  - *Modo Pasajero*: Recepción reactiva de la posición del conductor vía `onSnapshot` y trazado de polyline con Google Directions API.
- **PQRS (`features/pqrs`)**: Peticiones, Quejas, Reclamos y Sugerencias con subida de adjuntos (PDF/imágenes) a Firebase Storage y seguimiento de estados (`PENDIENTE`, `EN_REVISION`, `RESPONDIDA`, `CERRADA`).
- **Perfil (`features/perfil`)**: Consulta de datos, roles (`pasajero`, `conductor`, `administrador`) y cierre de sesión.

---

## 2. Estructura de Carpetas

```text
transimovil-app/
├── app.json                       # Configuración de Expo (permisos, plugins, mapas)
├── package.json                   # Dependencias y scripts de ejecución
├── tsconfig.json                  # Configuración estricta de TypeScript
├── firestore.rules                # Reglas de seguridad restrictivas de Firestore
├── storage.rules                  # Reglas de seguridad para Firebase Storage
├── .env.example                   # Plantilla de variables de entorno
├── functions/                     # Firebase Cloud Functions (TypeScript)
│   ├── package.json
│   └── src/
│       └── index.ts               # Email de bienvenida, notificaciones PQRS y roles
├── src/
│   ├── components/                # Componentes comunes (Botones, Inputs, Cards, Layouts)
│   ├── features/
│   │   ├── auth/                  # Lógica y vistas de Autenticación
│   │   ├── dashboard/             # Panel principal
│   │   ├── mapa/                  # GPS en tiempo real, Google Maps y Directions
│   │   ├── pqrs/                  # Gestión de PQRS y adjuntos
│   │   ├── tarifas/               # CRUD de Tarifas
│   │   └── perfil/                # Perfil y roles
│   ├── services/
│   │   ├── firebaseConfig.ts      # Cliente centralizado Firebase
│   │   ├── directionsService.ts   # Integración con Google Directions API
│   │   └── notificationService.ts # Gestor de notificaciones
│   ├── theme/                     # Paleta de colores y espaciado consistente
│   └── types.ts                   # Definición central de interfaces TypeScript
```

---

## 3. Requisitos Previos e Instalación

1. **Node.js**: Versión 18 o superior.
2. **Expo CLI**: Viene incluido mediante `npx expo`.
3. **Dispositivo o Emulador**:
   - Dispositivo físico con la app **Expo Go** (Android/iOS) o
   - Emulador Android Studio / Simulador Xcode (Development Build requerido para `react-native-maps` nativo en iOS).

### Pasos de Instalación:

```bash
# 1. Clonar el repositorio o descargar el código
cd transimovil-app

# 2. Instalar dependencias
npm install
```

---

## 4. Configuración de Firebase

1. Ingresa a la [Consola de Firebase](https://console.firebase.google.com/) y crea un proyecto nuevo llamado `transimovil-app`.
2. **Authentication**:
   - Habilita el proveedor **Correo electrónico / Contraseña**.
   - En la pestaña *Plantillas*, personaliza el correo de verificación de email.
3. **Cloud Firestore**:
   - Crea una base de datos en modo producción.
   - Aplica las reglas contenidas en `firestore.rules`.
4. **Firebase Storage**:
   - Inicializa el bucket de almacenamiento.
   - Aplica las reglas contenidas en `storage.rules`.
5. **Registrar Aplicación Web / Móvil**:
   - Añade una aplicación web o Android en la configuración del proyecto y copia las credenciales para el archivo `.env`.

---

## 5. Configuración de Google Maps y Directions API

1. Accede a [Google Cloud Console](https://console.cloud.google.com/).
2. Selecciona el proyecto vinculado a tu aplicación.
3. En la biblioteca de APIs, habilita:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Directions API**
4. Genera una API Key en **Credenciales** y configúrala en:
   - Variable `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` dentro de `.env`.
   - Bloque `android.config.googleMaps.apiKey` en `app.json`.

---

## 6. Variables de Entorno (.env)

Copia el archivo `.env.example` creando un nuevo archivo `.env`:

```bash
cp .env.example .env
```

Completa los valores con tus credenciales:

```env
# Firebase Client SDK (públicas para cliente móvil/web)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=transimovil-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=transimovil-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=transimovil-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=105822320757
EXPO_PUBLIC_FIREBASE_APP_ID=1:105822320757:web:xxxxxxxxxxxxxxxxx

# Google Maps Platform
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Nota de Seguridad**: Las variables con prefijo `EXPO_PUBLIC_*` se compilan en el binario de la app y nunca deben contener secretos de servidor. Credenciales privadas (tokens SMTP, service account keys) deben residir exclusivamente en Firebase Cloud Functions.

---

## 7. Sistema de Notificaciones (Push & In-App)

- La aplicación registra tokens de dispositivo mediante `expo-notifications` y los sincroniza en la colección `/usuarios/{uid}`.
- Cuando una PQRS se crea o cambia de estado, la Cloud Function dispara una notificación Push mediante Firebase Cloud Messaging (FCM).
- También se almacena un registro histórico en la colección `/notificaciones` accesible en vivo dentro de la aplicación.

---

## 8. Despliegue de Firebase Cloud Functions

Las funciones en la carpeta `functions/` manejan:
- Envío automático de **correo de bienvenida** personalizado con Nodemailer.
- Asignación segura de **Custom Claims** para roles (`administrador`, `conductor`, `pasajero`).
- Despacho de notificaciones ante cambios en PQRS.

### Pasos de Despliegue:

```bash
# Iniciar sesión en Firebase CLI
firebase login

# Inicializar y desplegar
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 9. Reglas de Seguridad (Firestore & Storage)

Despliega las reglas con:

```bash
firebase deploy --only firestore:rules,storage
```

- **Usuarios**: Cada usuario solo puede editar su información. Nadie puede auto-asignarse rol de administrador.
- **Tarifas**: Lectura permitida a usuarios autenticados; creación, edición y borrado restringidos a `administrador`.
- **Ubicaciones**: Solo el conductor propietario puede transmitir su latitud/longitud.
- **PQRS**: Los pasajeros solo visualizan sus radicados; los administradores pueden cambiar estados y responder.
- **Storage**: Solo se admiten archivos de tipo imagen o PDF hasta 10 MB.

---

## 10. Instrucciones para Ejecutar y Probar

### En Desarrollo con Expo:

```bash
# Iniciar el servidor Expo
npx expo start
```

- **Android**: Presiona `a` o escanea el código QR con la app **Expo Go**.
- **iOS**: Presiona `i` (requiere macOS con simulador Xcode) o abre en Expo Go.
- **Web**: Presiona `w` para probar la interfaz responsiva en el navegador.

### Lista de Comprobación de Validación:

- [x] **Autenticación**: Registro, Login, Logout y manejo de errores amigables.
- [x] **Verificación de Email**: Bloqueo del Dashboard hasta validar correo, botón de reenvío.
- [x] **Correo de Bienvenida**: Cloud Function con plantilla HTML personalizada.
- [x] **Dashboard Principal**: Tarjetas informativas, saldo de transporte, estado de la red y accesos directos.
- [x] **CRUD de Tarifas**: Creación, edición, eliminación con confirmación y activación reactiva con `onSnapshot`.
- [x] **GPS Conductor**: Transmisión automática cada 5 segundos al activar "Compartir ubicación".
- [x] **Seguimiento Pasajero**: Marcadores diferenciados, tiempo estimado (ETA) y distancia en vivo.
- [x] **Google Directions API**: Cálculo de la ruta óptima y visualización sobre el mapa.
- [x] **PQRS**: Formulario con tipos, estados, validaciones y adjuntos (PDF/imágenes).
- [x] **Notificaciones**: Avisos en tiempo real por cada etapa de la solicitud.
- [x] **Seguridad**: Reglas estrictas de Firestore y Storage, roles y TypeScript estricto.


## 11. Chatbot CHEEMS con Gemini (integración para despliegue)

El chatbot consulta los datos operativos de CHEEMS y los envía al backend junto con el historial reciente. En desarrollo, Vite puede usar `/api/chat`; en producción, la interfaz debe apuntar a la Cloud Function `chatbotCHEEMS`. La clave de Gemini debe existir únicamente en el entorno del servidor.

1. En Google AI Studio crea una clave nueva de Gemini. Si una clave se compartió en un ZIP, repositorio o chat, revócala y genera otra.
2. Crea `src/functions/.env` con `GEMINI_API_KEY=TU_CLAVE_NUEVA` y `APP_URL=https://TU-DOMINIO-FIREBASE.web.app` (usa el origen real de tu hosting, sin ruta final). Este archivo está excluido de Git. No uses variables `VITE_` para secretos.
3. En la raíz del proyecto, ejecuta `npm install` y `npm run build` para generar `dist`.
4. Desde la raíz, ejecuta `npm --prefix src/functions install` y luego `firebase deploy --only functions,hosting`. Firebase Hosting reescribe `/api/chat` hacia la función `chatbotCHEEMS`, así que no necesitas poner la clave en el frontend.
5. Verifica en el navegador que las preguntas responden tanto en español como en inglés y que una tarifa no registrada se declara como no disponible, sin inventar valores. Si alojas el frontend en otro proveedor, configura `VITE_CHATBOT_API_URL` con la URL real de la función y permite ese origen en `APP_URL`.

### Base de conocimiento y límites

El contexto se construye con los registros que la aplicación entrega de rutas, tarifas, buses, conductores, módulos y conteos agregados de PQRS. El prompt limita al asistente al dominio CHEEMS, establece la fuente prioritaria de tarifas y le exige distinguir datos registrados de ubicación en tiempo real. Esta integración es contexto estructurado enviado en cada consulta; no es un sistema vectorial RAG con embeddings.

### Reflexión sobre la Persona Transhumana / Transhuman Person Declaration

**Español.** CHEEMS Bot busca ampliar la capacidad de las personas para acceder y comprender información de movilidad, sin sustituir su criterio ni la responsabilidad humana. La integración debe ser transparente: el asistente informa cuando un dato no está registrado y distingue información de referencia de la ubicación real. El uso ético requiere proteger datos personales, no exponer credenciales y mantener supervisión humana sobre tarifas, rutas y decisiones operativas. La tecnología debe facilitar el acceso a la información y apoyar el aprendizaje, no presentar las respuestas del modelo como infalibles.

**English.** CHEEMS Bot aims to enhance people's ability to access and understand mobility information without replacing human judgment or responsibility. Its use should be transparent: the assistant states when information is unavailable and distinguishes stored records from real-time location. Ethical implementation requires protecting personal data, keeping credentials private, and maintaining human oversight of fares, routes, and operational decisions. The technology should improve access to information and support learning, rather than presenting model outputs as infallible.
