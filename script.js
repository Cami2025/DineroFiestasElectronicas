// Importar Firebase y Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";

// Configuración de Firebase (Reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyD6cY2-28Qrygz6oJAekcusFyhI-D_BykE",
  authDomain: "fiestasamigas.firebaseapp.com",
  projectId: "fiestasamigas",
  storageBucket: "fiestasamigas.firebasestorage.app",
  messagingSenderId: "213890432584",
  appId: "1:213890432584:web:bd0e57b2a11edddd33227d",
  measurementId: "G-KDLW7FW04R"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

let totalAmount = 0;

// Función para actualizar el total en la pantalla
function updateTotal(amount) {
    totalAmount += amount;
    totalAmountSpan.textContent = `$${totalAmount.toLocaleString()}`;
}

// Función para añadir un depósito al historial en pantalla
function addDepositToList(id, name, amount, date) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${name} depositó $${amount.toLocaleString()} el ${date}
        <button class="delete-button" data-id="${id}">Eliminar</button>
    `;
    
    const deleteButton = listItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', async () => {
        historyList.removeChild(listItem);
        updateTotal(-amount);
        await deleteDeposit(id);
    });

    historyList.appendChild(listItem);
    scrollToBottom();
}

// Función para cargar los depósitos desde Firebase Firestore
async function loadDeposits() {
    try {
        const querySnapshot = await getDocs(collection(db, "depositos"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addDepositToList(doc.id, data.name, data.amount, data.date);
            totalAmount += data.amount;
        });
        updateTotal(0);
    } catch (error) {
        console.error("Error al cargar los depósitos:", error);
    }
}

// Función para guardar un depósito en Firebase Firestore
async function saveDeposit(name, amount) {
    try {
        const docRef = await addDoc(collection(db, "depositos"), {
            name: name,
            amount: amount,
            date: new Date().toLocaleDateString()
        });
        console.log("Depósito guardado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar el depósito:", error);
    }
}

// Función para eliminar un depósito en Firebase Firestore
async function deleteDeposit(id) {
    try {
        await deleteDoc(query(collection(db, "depositos"), where("__name__", "==", id)));
        console.log("Depósito eliminado con ID:", id);
    } catch (error) {
        console.error("Error al eliminar el depósito:", error);
    }
}

// Manejo del formulario de depósitos
depositForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert('Por favor, ingresa un nombre y un monto válido.');
        return;
    }

    // Añadir depósito a la pantalla y a Firebase
    const id = await saveDeposit(name, amount);
    addDepositToList(id, name, amount, new Date().toLocaleDateString());
    updateTotal(amount);

    // Limpiar formulario
    nameInput.value = '';
    amountInput.value = '';
});

// Función para desplazarse al final de la lista automáticamente
function scrollToBottom() {
    historyList.scrollTop = historyList.scrollHeight;
}

// Cargar depósitos al iniciar la página
loadDeposits();
