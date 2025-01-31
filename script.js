// Importar Firebase
import { database } from "./firebase_configuracion.js";
import { ref, push, remove, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Elementos del DOM
const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');
const audio = document.getElementById('background-audio');

// Referencias en Firebase
const depositosRef = ref(database, 'depositos');
const totalRef = ref(database, 'totalMonto');

// Función para obtener el monto total desde Firebase
function obtenerTotal() {
    get(totalRef).then((snapshot) => {
        const total = snapshot.exists() ? snapshot.val() : 0;
        totalAmountSpan.textContent = `$${total}`;
    }).catch(error => console.error("Error obteniendo total:", error));
}

// Función para actualizar el total en Firebase
function actualizarTotalFirebase(monto) {
    get(totalRef).then((snapshot) => {
        let total = snapshot.exists() ? snapshot.val() : 0;
        total += monto;
        set(totalRef, total);
    }).catch(error => console.error("Error actualizando total:", error));
}

// Función para agregar un depósito a Firebase
function agregarDeposito(nombre, cantidad) {
    push(depositosRef, {
        nombre: nombre,
        cantidad: cantidad,
        fecha: new Date().toLocaleString()
    }).then(() => {
        actualizarTotalFirebase(cantidad);
    }).catch(error => console.error("Error al agregar depósito:", error));
}

// Función para eliminar un depósito
function eliminarDeposito(id, cantidad) {
    remove(ref(database, `depositos/${id}`))
        .then(() => {
            actualizarTotalFirebase(-cantidad);
        })
        .catch(error => console.error("Error al eliminar depósito:", error));
}

// Función para mostrar depósitos en la interfaz
function cargarDepositos() {
    onValue(depositosRef, (snapshot) => {
        historyList.innerHTML = ""; // Limpiar lista antes de actualizar

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const deposito = childSnapshot.val();
                const depositoId = childSnapshot.key;

                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    ${deposito.nombre} depositó $${deposito.cantidad} el ${deposito.fecha}
                    <button class="delete-button" data-id="${depositoId}" data-amount="${deposito.cantidad}">Eliminar</button>
                `;

                listItem.querySelector(".delete-button").addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    const cantidad = parseInt(this.getAttribute("data-amount"));
                    eliminarDeposito(id, cantidad);
                });

                historyList.appendChild(listItem);
            });
        } else {
            historyList.innerHTML = "<li>No hay depósitos registrados aún.</li>";
        }
    });
}

// Escuchar cambios en el monto total en Firebase
onValue(totalRef, (snapshot) => {
    totalAmountSpan.textContent = `$${snapshot.exists() ? snapshot.val() : 0}`;
});

// Manejo del formulario para agregar depósitos
depositForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = nameInput.value.trim();
    const cantidad = parseInt(amountInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa un nombre y un monto válido.");
        return;
    }

    agregarDeposito(nombre, cantidad);
    audio.play().catch(error => console.log("Error al reproducir audio:", error));

    // Limpiar los campos del formulario
    nameInput.value = '';
    amountInput.value = '';
});

// Cargar depósitos y total al iniciar la página
cargarDepositos();
obtenerTotal();