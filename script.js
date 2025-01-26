const BACKEND_URL = "https://dinero-fiestas-electronicas.vercel.app/api";

const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

let totalAmount = 0; // Monto inicial, se cargará dinámicamente del backend

// Función para actualizar el total dinámicamente
function updateTotal(amount) {
    totalAmount += amount;
    totalAmountSpan.textContent = `$${totalAmount.toLocaleString()}`;
}

// Función para añadir un depósito al historial
function addDepositToList(name, amount, date) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${name} depositó $${amount.toLocaleString()} el ${date}
        <button class="delete-button">Eliminar</button>
    `;
    const deleteButton = listItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', async () => {
        historyList.removeChild(listItem);
        updateTotal(-amount); // Resta el monto eliminado
        await deleteDeposit(name, amount, date); // Llamada al backend para eliminar el depósito
    });
    historyList.appendChild(listItem);

    // Desplazarse hacia abajo después de añadir el depósito
    scrollToBottom();
}

// Función para cargar los depósitos del backend
async function loadDeposits() {
    try {
        const response = await fetch(`${BACKEND_URL}/get-deposits`);
        const deposits = await response.json();

        // Actualizar total y mostrar depósitos en el historial
        deposits.forEach(deposit => {
            addDepositToList(deposit.name, deposit.amount, deposit.date);
            totalAmount += deposit.amount;
        });
        updateTotal(0); // Actualizar la vista del monto total
    } catch (error) {
        console.error("Error al cargar los depósitos:", error);
    }
}

// Función para guardar un depósito en el backend
async function saveDeposit(name, amount) {
    try {
        const response = await fetch(`${BACKEND_URL}/add-deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, amount, date: new Date().toLocaleDateString() }),
        });
        const data = await response.json();
        console.log("Depósito guardado:", data.message);
    } catch (error) {
        console.error("Error al guardar el depósito:", error);
    }
}

// Función para eliminar un depósito en el backend
async function deleteDeposit(name, amount, date) {
    try {
        const response = await fetch(`${BACKEND_URL}/delete-deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, amount, date }),
        });
        const data = await response.json();
        console.log("Depósito eliminado:", data.message);
    } catch (error) {
        console.error("Error al eliminar el depósito:", error);
    }
}

// Manejo del formulario
depositForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert('Por favor, ingresa un nombre y un monto válido.');
        return;
    }

    // Añadir depósito localmente y enviarlo al backend
    addDepositToList(name, amount, new Date().toLocaleDateString());
    updateTotal(amount);
    await saveDeposit(name, amount);

    // Limpiar campos
    nameInput.value = '';
    amountInput.value = '';
});

// Función para desplazarse automáticamente hacia abajo
function scrollToBottom() {
    historyList.scrollTop = historyList.scrollHeight;
}

// Cargar depósitos al iniciar la página
loadDeposits();
