// Importar Firebase desde el archivo de configuración
import { database } from "./firebase-config.js";
import { ref, push, remove, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Verificación de conexión a Firebase
console.log("🔥 Firebase cargado correctamente:", database);

// Elementos del DOM
const depositForm = document.getElementById("deposit-form");
const amountInput = document.getElementById("amount");
const nameInput = document.getElementById("name");
const totalAmountSpan = document.getElementById("total-amount");
const historyList = document.getElementById("history-list");
const audio = document.getElementById("background-audio");

// Referencias en Firebase
const depositosRef = ref(database, "depositos");
const totalRef = ref(database, "totalMonto");

// 🔹 Función para obtener el monto total en tiempo real
function obtenerTotal() {
    onValue(totalRef, (snapshot) => {
        const total = snapshot.exists() ? snapshot.val() : 0;
        totalAmountSpan.textContent = `$${total}`;
    });
}

// 🔹 Función para actualizar el total en Firebase
async function actualizarTotalFirebase() {
    try {
        const snapshot = await get(depositosRef);
        let total = 0;

        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const deposito = childSnapshot.val();
                total += deposito.cantidad;
            });
        }

        await set(totalRef, total);
        console.log(`✅ Total actualizado: $${total}`);
    } catch (error) {
        console.error("❌ Error actualizando total:", error);
    }
}

// 🔹 Función para agregar un depósito a Firebase
function agregarDeposito(nombre, cantidad) {
    push(depositosRef, {
        nombre: nombre,
        cantidad: cantidad,
        fecha: new Date().toLocaleString(),
    })
    .then(() => {
        actualizarTotalFirebase();
        console.log(`✅ Depósito agregado: ${nombre} - $${cantidad}`);
    })
    .catch((error) => console.error("❌ Error al agregar depósito:", error));
}

// 🔹 Función para eliminar un depósito
function eliminarDeposito(id) {
    remove(ref(database, `depositos/${id}`))
    .then(() => {
        actualizarTotalFirebase();
        console.log(`🗑️ Depósito eliminado: ID ${id}`);
    })
    .catch((error) => console.error("❌ Error al eliminar depósito:", error));
}

// 🔹 Función para mostrar depósitos en la interfaz
function cargarDepositos() {
    onValue(depositosRef, (snapshot) => {
        historyList.innerHTML = ""; // Limpiar la lista antes de actualizar

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const deposito = childSnapshot.val();
                const depositoId = childSnapshot.key;

                const listItem = document.createElement("li");
                listItem.style.cssText = "background: lightgray; padding: 10px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;";

                listItem.innerHTML = `
                    <span>${deposito.nombre} depositó <strong>$${deposito.cantidad}</strong> el ${deposito.fecha}</span>
                    <button class="delete-button" data-id="${depositoId}">❌ Eliminar</button>
                `;

                listItem.querySelector(".delete-button").addEventListener("click", function () {
                    const id = this.getAttribute("data-id");
                    eliminarDeposito(id);
                });

                historyList.appendChild(listItem);
            });
        } else {
            historyList.innerHTML = "<li>No hay depósitos registrados aún.</li>";
        }
    });
}

// 🔹 Manejo del formulario para agregar depósitos
depositForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = nameInput.value.trim();
    const cantidad = parseInt(amountInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
        alert("⚠️ Por favor, ingresa un nombre y un monto válido.");
        return;
    }

    agregarDeposito(nombre, cantidad);
    audio.play().catch((error) => console.log("🎵 Error al reproducir audio:", error));

    // Limpiar los campos del formulario
    nameInput.value = "";
    amountInput.value = "";
});

// 🔹 Cargar depósitos y total al iniciar la página
cargarDepositos();
obtenerTotal();
