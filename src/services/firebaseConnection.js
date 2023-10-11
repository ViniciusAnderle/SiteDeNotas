
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJbQve3sexJIdirHL8Zo0ojk0-go39Vak",
  authDomain: "ticket-chamados-ti.firebaseapp.com",
  projectId: "ticket-chamados-ti",
  storageBucket: "ticket-chamados-ti.appspot.com",
  messagingSenderId: "1075555363518",
  appId: "1:1075555363518:web:655cc2d4c4bdd0e3208cef"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };