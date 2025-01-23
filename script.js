// Monto inicial
let totalAmount = 200000;

// Referencias a elementos del DOM
const historyList = document.getElementById("history-list");
const totalAmountSpan = document.getElementById("total-amount");
const depositForm = document.getElementById("deposit-form");

// Evento para manejar el formulario
depositForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value); // Monto ingresado
    const name = document.getElementById("name").value; // Nombre de quien deposita

    if (amount > 0 && name.trim() !== "") {
        // Actualizar el monto total
        totalAmount += amount;
        totalAmountSpan.textContent = totalAmount.toFixed(2);

        // Obtener la fecha actual
        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        // Crear el elemento del historial
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${name} depositó $${amount.toFixed(2)} el ${formattedDate}</span>
            <button class="delete">Eliminar</button>
        `;

        // Botón para eliminar el depósito
        const deleteButton = listItem.querySelector(".delete");
        deleteButton.addEventListener("click", () => {
            // Restar el monto eliminado del total
            totalAmount -= amount;
            totalAmountSpan.textContent = totalAmount.toFixed(2);
            // Eliminar el elemento del historial
            listItem.remove();
        });

        // Agregar el elemento al historial
        historyList.appendChild(listItem);

        // Limpiar los campos del formulario
        document.getElementById("amount").value = "";
        document.getElementById("name").value = "";
    } else {
        alert("Por favor, ingresa un monto válido y tu nombre.");
    }
});