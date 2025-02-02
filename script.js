// firebase-config.js

// Importar Firebase, Realtime Database y Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"; // NUEVA LÍNEA

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8UPGQu94dzTyr3edIIbwrm8hlAOebJpo",
  authDomain: "fiestas-5f0e5.firebaseapp.com",
  databaseURL: "https://fiestas-5f0e5-default-rtdb.firebaseio.com",
  projectId: "fiestas-5f0e5",
  storageBucket: "fiestas-5f0e5.firebasestorage.app",
  messagingSenderId: "528292695738",
  appId: "1:528292695738:web:1fd6193891a6840fb27c83"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);  // Inicializar Auth

// Verificar conexión en la consola
console.log("🔥 Firebase conectado correctamente:", database);

export { database, auth };


// script.js

console.log("🚀 script.js se ha cargado correctamente.");

import { database, auth } from "./firebase-config.js";
import { ref, push, onValue, remove, set, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Control de autenticación
onAuthStateChanged(auth, (user) => {
    if (!user) {
        mostrarLogin();
        document.body.style.display = "none";  // Oculta la app hasta iniciar sesión
    } else {
        document.body.style.display = "block"; // Muestra la app si está autenticado
    }
});

function mostrarLogin() {
    const loginForm = document.createElement("div");
    loginForm.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="email" id="loginEmail" placeholder="Correo electrónico" required />
        <input type="password" id="loginPassword" placeholder="Contraseña" required />
        <button id="loginButton">Iniciar Sesión</button>
    `;
    document.body.prepend(loginForm);

    document.getElementById("loginButton").addEventListener("click", () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => location.reload())
            .catch((error) => alert("Error al iniciar sesión: " + error.message));
    });
}

// Función para cerrar sesión
function logout() {
    signOut(auth)
        .then(() => {
            alert("Sesión cerrada.");
            location.reload();
        })
        .catch((error) => console.error("Error al cerrar sesión:", error.message));
}

// Lógica de Depósitos
const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

const depositosRef = ref(database, "depositos");
const totalRef = ref(database, "totalMonto");

onValue(depositosRef, (snapshot) => {
    historyList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const key = childSnapshot.key;
        addDepositToDOM(data.nombre, data.cantidad, data.fecha, key);
    });
});

onValue(totalRef, (snapshot) => {
    const total = snapshot.val() || 0;
    totalAmountSpan.textContent = `$${total}`;
});

function addDepositToFirebase(nombre, cantidad) {
    const fecha = new Date().toLocaleDateString();
    push(depositosRef, { nombre, cantidad, fecha });
    actualizarTotal(cantidad);
}

function actualizarTotal(cantidad) {
    get(totalRef).then((snapshot) => {
        const total = (snapshot.val() || 0) + cantidad;
        set(totalRef, total);
    });
}

function eliminarDeposito(id, cantidad) {
    remove(ref(database, `depositos/${id}`));
    actualizarTotal(-cantidad);
}

function addDepositToDOM(nombre, cantidad, fecha, id) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${nombre} depositó $${cantidad} el ${fecha}
        <button class="delete-button">Eliminar</button>
    `;
    listItem.querySelector('.delete-button').addEventListener('click', () => {
        eliminarDeposito(id, cantidad);
        listItem.remove();
    });
    historyList.appendChild(listItem);
}

depositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = nameInput.value.trim();
    const cantidad = parseInt(amountInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa un nombre y un monto válido.');
        return;
    }

    addDepositToFirebase(nombre, cantidad);
    nameInput.value = '';
    amountInput.value = '';
});
