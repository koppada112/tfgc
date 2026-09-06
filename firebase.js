import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB7mUq4NCd2eyfneoCrD3EceH5Jc86RYQg",
  authDomain: "tf--gold-covering.firebaseapp.com",
  projectId: "tf--gold-covering",
  storageBucket: "tf--gold-covering.firebasestorage.app",
  messagingSenderId: "563116095236",
  appId: "1:563116095236:web:adffed981e772e40814251"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export { auth, db };