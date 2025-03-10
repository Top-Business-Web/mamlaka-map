import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   // apiKey: "AIzaSyAfH2mtkJG6ZuIUZ9N2Sv6h3caquowJnOM",
//   // authDomain: "nusuk-3922a.firebaseapp.com",
//   // databaseURL: "https://nusuk-3922a-default-rtdb.firebaseio.com",
//   // projectId: "nusuk-3922a",
//   // storageBucket: "nusuk-3922a.appspot.com",
//   // messagingSenderId: "176437892159",
//   // appId: "1:176437892159:web:85de7d58a47552d878148a",
//   // measurementId: "G-3N3E9GG66H"
//   apiKey: "AIzaSyBiIZU1os5EBNiv4VO5N44q0xJ8XSfgW3I",
//   authDomain: "nusk-424112.firebaseapp.com",
//   databaseURL: "https://nusk-424112-default-rtdb.firebaseio.com",
//   // databaseURL: "https://nusk-424112-default-rtdb.firebaseio.com",
//   projectId: "nusk-424112",
//   storageBucket: "nusk-424112.appspot.com",
//   messagingSenderId: "1095019281643",
//   appId: "1:1095019281643:web:f97f9412f0bc896a2f12ae"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCZK--BS46mGae50fbRWsxmL6N9x8RqMDE",
  authDomain: "malakia-cd959.firebaseapp.com",
  databaseURL: "https://malakia-cd959-default-rtdb.firebaseio.com",
  projectId: "malakia-cd959",
  storageBucket: "malakia-cd959.firebasestorage.app",
  messagingSenderId: "111578269732",
  appId: "1:111578269732:web:f9aac12af7d78438e170b1",
  measurementId: "G-6LEGY36DNX"
};

const app = initializeApp(firebaseConfig);

export const firestoreDB = getFirestore(app);
export const db = getDatabase(app);

// setLogLevel('debug');
