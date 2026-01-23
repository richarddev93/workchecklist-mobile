// Firebase initialization (Expo SDK 53+ / firebase@12)
// Fill with your real project credentials (web app config) before use.
import { getApps, initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: 'REPLACE_ME',
//   authDomain: 'REPLACE_ME.firebaseapp.com',
//   databaseURL: 'https://REPLACE_ME.firebaseio.com',
//   projectId: 'REPLACE_ME',
//   storageBucket: 'REPLACE_ME.appspot.com',
//   messagingSenderId: 'REPLACE_ME',
//   appId: 'REPLACE_ME',
//   measurementId: 'REPLACE_ME',
// };

export const firebaseConfig = {
  apiKey: "AIzaSyDZsyghYEmGWGx1YaJWKZ0Tpv2-Fo7sq10",
  authDomain: "workchecklist-web-108069-d9b14.firebaseapp.com",
  projectId: "workchecklist-web-108069-d9b14",
  storageBucket: "workchecklist-web-108069-d9b14.firebasestorage.app",
  messagingSenderId: "287726891460",
  appId: "1:287726891460:web:c4c32c53da5323617cb491",
};

// Prevent re-initialization in Fast Refresh / multi-import scenarios
export const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

// Example: import services as needed
// import { getAuth } from 'firebase/auth';
// export const firebaseAuth = getAuth(firebaseApp);
// import { getFirestore } from 'firebase/firestore';
// export const firebaseDb = getFirestore(firebaseApp);
// import { getStorage } from 'firebase/storage';
// export const firebaseStorage = getStorage(firebaseApp);
