import { database } from "./firebase-config.js";
import { ref, push, onValue, remove, set, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Elementos del DOM
const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

// Referencias en Firebase
const depositosRef = ref(database, "depositos");
const totalRef = ref(database, "totalMonto");

// Cargar depósitos al iniciar la página
onValue(depositosRef, (snapshot) => {
    historyList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const key = childSnapshot.key;
        addDepositToDOM(data.nombre, data.cantidad, data.fecha, key);
    });
});

// Obtener y mostrar el monto total
onValue(totalRef, (snapshot) => {
    const total = snapshot.val() || 0;
    totalAmountSpan.textContent = `$${total}`;
});

// Función para añadir un depósito en Firebase
function addDepositToFirebase(nombre, cantidad) {
    const fecha = new Date().toLocaleDateString();
    push(depositosRef, { nombre, cantidad, fecha });
    actualizarTotal(cantidad);
}

// Función para actualizar el total en Firebase
function actualizarTotal(cantidad) {
    get(totalRef).then((snapshot) => {
        const total = (snapshot.val() || 0) + cantidad;
        set(totalRef, total);
    });
}

// Función para eliminar un depósito
function eliminarDeposito(id, cantidad) {
    remove(ref(database, `depositos/${id}`));
    actualizarTotal(-cantidad);
}

// Añadir el depósito en la interfaz
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

// Manejo del formulario
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
