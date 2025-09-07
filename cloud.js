// Firebase Cloud Config - Configurato con miniature foto
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyApCCKrXfX2VHKkerDlkKcpoe8po-BLVPg",
  authDomain: "petpal-89e80.firebaseapp.com",
  projectId: "petpal-89e80",
  storageBucket: "petpal-89e80.appspot.com",
  messagingSenderId: "351621767690",
  appId: "1:351621767690:web:ff0c6f94423f29530835f3",
  vapidKey: "BGPmHa3aYUsP0P8oYfMtQGtTDnRs-8bLRzg4JCiDMkQbOdt8vTzFVYKYlDVm9yXeERQJRw_2-Khp_E-BBUX8DaA"
};

// Inizializza app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Funzione: Login con Google
export async function loginGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Ciao " + result.user.displayName + "! Login riuscito ✅");
  } catch (err) {
    alert("Errore login: " + err.message);
  }
}

// Funzione: Salva promemoria su Firestore
export async function salvaPromemoria() {
  try {
    await addDoc(collection(db, "promemoria"), {
      tipo: "Vaccino",
      data: new Date().toISOString()
    });
    alert("Promemoria vaccino salvato su Firestore ✅");
    await mostraPromemoria();
  } catch (err) {
    alert("Errore Firestore: " + err.message);
  }
}

// Funzione: Carica file demo su Storage
export async function caricaFoto() {
  try {
    const fileData = new Blob(["Foto di esempio"], { type: "text/plain" });
    const storageRef = ref(storage, "foto/demo.txt");
    await uploadBytes(storageRef, fileData);
    alert("Foto caricata su Firebase Storage ✅ (demo)");
  } catch (err) {
    alert("Errore Storage: " + err.message);
  }
}

// Funzione: Legge promemoria da Firestore
export async function mostraPromemoria() {
  try {
    const querySnapshot = await getDocs(collection(db, "promemoria"));
    const lista = document.getElementById("lista-promemoria");
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = data.tipo + " - " + data.data;
      lista.appendChild(li);
    });
  } catch (err) {
    alert("Errore nel leggere i promemoria: " + err.message);
  }
}

// Funzione: Carica una foto reale dal file input e salva link in Firestore
export async function caricaFotoReale(file) {
  if (!file) {
    alert("Seleziona un file prima!");
    return;
  }
  try {
    const storageRef = ref(storage, "foto/" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, "foto"), { nome: file.name, url: url, data: new Date().toISOString() });
    const link = document.getElementById("link-foto");
    link.innerHTML = `<a href="${url}" target="_blank">📸 Vedi foto caricata</a>`;
    alert("Foto caricata su Firebase Storage ✅");
  } catch (err) {
    alert("Errore upload foto: " + err.message);
  }
}

// Funzione: Mostra galleria foto con miniature
export async function mostraGalleriaFoto() {
  try {
    const querySnapshot = await getDocs(collection(db, "foto"));
    const lista = document.getElementById("lista-foto");
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const img = document.createElement("img");
      img.src = data.url;
      img.alt = data.nome;
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.objectFit = "cover";
      img.style.margin = "5px";
      img.style.borderRadius = "8px";
      img.style.cursor = "pointer";
      img.onclick = () => window.open(data.url, "_blank");
      lista.appendChild(img);
    });
  } catch (err) {
    alert("Errore nel leggere la galleria foto: " + err.message);
  }
}
