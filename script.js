const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

let totalAmount = 282810; // Monto inicial
totalAmountSpan.textContent = `$${totalAmount.toLocaleString()}`; // Formato con separadores

// Función para actualizar el total dinámicamente
function updateTotal(amount) {
    totalAmount += amount;
    totalAmountSpan.textContent = `$${totalAmount.toLocaleString()}`;
}

// Función para añadir un depósito al historial
function addDeposit(name, amount) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${name} depositó $${amount.toLocaleString()} el ${new Date().toLocaleDateString()}
        <button class="delete-button">Eliminar</button>
    `;
    const deleteButton = listItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        historyList.removeChild(listItem);
        updateTotal(-amount); // Resta el monto eliminado
    });
    historyList.appendChild(listItem);
}

// Manejo del formulario
depositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert('Por favor, ingresa un nombre y un monto válido.');
        return;
    }

    addDeposit(name, amount);
    updateTotal(amount);

    // Limpiar campos
    nameInput.value = '';
    amountInput.value = '';
});
