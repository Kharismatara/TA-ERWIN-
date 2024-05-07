
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import 'firebase/auth'
import { getStorage } from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
var firebaseConfig = {
  apiKey: "AIzaSyDCMAzIdC01eDXCbnNU-ze_5Jl0H9a2NRk",
  authDomain: "ta-alvin.firebaseapp.com",
  projectId: "ta-alvin",
  storageBucket: "ta-alvin.appspot.com",
  messagingSenderId: "628405821146",
  appId: "1:628405821146:web:eca4c54909ad9899500fe3"
};



const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const imageDB = getStorage(app)
export const db = getFirestore(app)
