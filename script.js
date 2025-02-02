// script.js

console.log("🚀 script.js se ha cargado correctamente.");

import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  inMemoryPersistence 
} from "firebase/auth";
import { database, auth } from "./firebase-config.js";
import { ref, push, onValue, remove, set, get } from "firebase/database";

// Obtener los contenedores definidos en el HTML
const loginContainer = document.getElementById("login-container");
const appContent = document.getElementById("app-content");

// Configurar la persistencia para que no se guarde la sesión (se pedirá login cada vez)
setPersistence(auth, inMemoryPersistence)
  .then(() => {
    console.log("Persistence set to inMemoryPersistence: se pedirá login cada vez.");

    // Establecer el listener de autenticación después de configurar la persistencia
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        mostrarLogin();
        if (loginContainer) loginContainer.style.display = "block";
        if (appContent) appContent.style.display = "none";
      } else {
        if (loginContainer) loginContainer.style.display = "none";
        if (appContent) appContent.style.display = "block";
      }
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

function mostrarLogin() {
  if (!loginContainer) return;
  loginContainer.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <input type="email" id="loginEmail" placeholder="Correo electrónico" required />
    <input type="password" id="loginPassword" placeholder="Contraseña" required />
    <button id="loginButton">Iniciar Sesión</button>
  `;

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

// Elementos del DOM (dentro de #app-content)
const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

const depositosRef = ref(database, "depositos");
const totalRef = ref(database, "totalMonto");

// Escucha en tiempo real para actualizar el historial de depósitos
onValue(depositosRef, (snapshot) => {
  if (historyList) {
    historyList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const key = childSnapshot.key;
      addDepositToDOM(data.nombre, data.cantidad, data.fecha, key);
    });
  }
});

// Escucha en tiempo real para actualizar el monto total
onValue(totalRef, (snapshot) => {
  let total = snapshot.val();
  // Si no hay valor o es 0, asigna el valor inicial 320810
  if (!total) {
    total = 320810;
    set(totalRef, total);
  }
  if (totalAmountSpan) totalAmountSpan.textContent = `$${total}`;
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
  if (!historyList) return;
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

// Manejar el envío del formulario de depósito
if (depositForm) {
  depositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = nameInput.value.trim();
    const cantidad = parseInt(amountInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, ingresa un nombre y un monto válido.');
      return;
    }

    addDepositToFirebase(nombre, cantidad);

    // Reproducir audio al hacer un depósito
    const audio = document.getElementById('interaction-audio');
    if (audio) {
      audio.play();
    }

    nameInput.value = '';
    amountInput.value = '';
  });
}
