// Firebase setup for Expo (web & native)
import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Preencha estas credenciais manualmente (nunca versione secrets!)
export const firebaseConfig = {
  apiKey: "AIzaSyDZsyghYEmGWGx1YaJWKZ0Tpv2-Fo7sq10",
  authDomain: "workchecklist-web-108069-d9b14.firebaseapp.com",
  projectId: "workchecklist-web-108069-d9b14",
  storageBucket: "workchecklist-web-108069-d9b14.firebasestorage.app",
  messagingSenderId: "287726891460",
  appId: "1:287726891460:web:c4c32c53da5323617cb491",
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export ready-to-use clients
export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);

// Initialize analytics (web only, safe for native)
let analyticsInitialized = false;
async function initAnalytics() {
  if (analyticsInitialized) return;
  try {
    const supported = await isSupported();
    if (supported) {
      getAnalytics(app);
      analyticsInitialized = true;
      console.log("[firebase] Analytics initialized");
    }
  } catch (err) {
    console.warn("[firebase] Analytics not available", err);
  }
}

initAnalytics();
