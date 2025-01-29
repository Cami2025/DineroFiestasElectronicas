// Importar Firebase y Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, where } from "firebase/firestore";

// Configuración de Firebase
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

const depositForm = document.getElementById("deposit-form");
const amountInput = document.getElementById("amount");
const nameInput = document.getElementById("name");
const totalAmountSpan = document.getElementById("total-amount");
const historyList = document.getElementById("history-list");

let totalAmount = 0; // Monto inicial

// **Función para actualizar el total en la interfaz**
function updateTotal(amount) {
    totalAmount += amount;
    totalAmountSpan.textContent = `$${totalAmount.toLocaleString()}`;
}

// **Función para añadir un depósito a Firestore**
async function saveDeposit(name, amount) {
    try {
        const docRef = await addDoc(collection(db, "depositos"), {
            nombre: name,
            monto: amount,
            fecha: new Date().toLocaleDateString()
        });
        console.log("Depósito guardado con ID:", docRef.id);
    } catch (error) {
        console.error("Error al guardar en Firebase:", error);
    }
}

// **Función para cargar depósitos desde Firebase**
async function loadDeposits() {
    try {
        const q = query(collection(db, "depositos"), orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        
        historyList.innerHTML = ""; // Limpiar lista antes de cargar los datos
        totalAmount = 0; // Reiniciar total

        querySnapshot.forEach((doc) => {
            const deposit = doc.data();
            addDepositToList(doc.id, deposit.nombre, deposit.monto, deposit.fecha);
            totalAmount += deposit.monto;
        });

        updateTotal(0); // Actualizar la vista del monto total
    } catch (error) {
        console.error("Error al cargar los depósitos:", error);
    }
}

// **Función para añadir un depósito al historial visual**
function addDepositToList(id, name, amount, date) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        ${name} depositó $${amount.toLocaleString()} el ${date}
        <button class="delete-button">Eliminar</button>
    `;

    const deleteButton = listItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
        await deleteDeposit(id);
        historyList.removeChild(listItem);
        updateTotal(-amount);
    });

    historyList.appendChild(listItem);
}

// **Función para eliminar un depósito en Firebase**
async function deleteDeposit(id) {
    try {
        await deleteDoc(doc(db, "depositos", id));
        console.log("Depósito eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar el depósito:", error);
    }
}

// **Manejo del formulario para agregar depósitos**
depositForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Por favor, ingresa un nombre y un monto válido.");
        return;
    }

    addDepositToList(null, name, amount, new Date().toLocaleDateString());
    updateTotal(amount);
    await saveDeposit(name, amount);

    // Limpiar campos
    nameInput.value = "";
    amountInput.value = "";
});

// **Cargar depósitos al iniciar la página**
loadDeposits();