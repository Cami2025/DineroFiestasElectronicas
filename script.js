// Importar Firebase y la base de datos
import { database } from "./firebase_configuracion.js";
import { ref, push, remove, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Referencias al DOM
const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');
const audio = document.getElementById('background-audio');

// Referencia en Firebase
const depositosRef = ref(database, 'depositos');
const totalRef = ref(database, 'totalMonto');

// Función para actualizar el total en Firebase
function updateTotalFirebase(amount) {
    get(totalRef).then((snapshot) => {
        let total = snapshot.exists() ? snapshot.val() : 0;
        total += amount;
        set(totalRef, total);
    });
}

// Función para añadir un depósito a Firebase
function agregarDeposito(name, amount) {
    push(depositosRef, {
        nombre: name,
        cantidad: amount,
        fecha: new Date().toLocaleString()
    }).then(() => {
        updateTotalFirebase(amount); // Actualizar total en Firebase
    }).catch(error => console.error("Error al agregar depósito:", error));
}

// Función para eliminar un depósito de Firebase
function eliminarDeposito(id, amount) {
    remove(ref(database, `depositos/${id}`))
        .then(() => {
            updateTotalFirebase(-amount); // Restar el monto eliminado
        })
        .catch(error => console.error("Error al eliminar depósito:", error));
}

// Escuchar cambios en los depósitos
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

            // Añadir evento para eliminar depósitos
            listItem.querySelector(".delete-button").addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const amount = parseInt(this.getAttribute("data-amount"));
                eliminarDeposito(id, amount);
            });

            historyList.appendChild(listItem);
        });
    } else {
        historyList.innerHTML = "<li>No hay depósitos registrados aún.</li>";
    }
});

// Escuchar cambios en el monto total
onValue(totalRef, (snapshot) => {
    totalAmountSpan.textContent = `$${snapshot.exists() ? snapshot.val() : 0}`;
});

// Manejo del formulario para agregar depósitos
depositForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Por favor, ingresa un nombre y un monto válido.");
        return;
    }

    agregarDeposito(name, amount);
    audio.play().catch(error => console.log("Error al reproducir audio:", error));

    // Limpiar campos
    nameInput.value = '';
    amountInput.value = '';
});