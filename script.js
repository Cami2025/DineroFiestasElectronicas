document.getElementById("form-deposito").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const monto = parseFloat(document.getElementById("monto").value);

    // Enviar datos al servidor
    const response = await fetch("guardar.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${nombre}&monto=${monto}`,
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("monto-total").innerText = `$${data.total.toFixed(2)}`;
        cargarHistorial();
    }
});

async function cargarHistorial() {
    const response = await fetch("obtener.php");
    const data = await response.json();

    const historial = document.getElementById("historial");
    historial.innerHTML = "";

    data.depositos.forEach((deposito) => {
        const item = document.createElement("li");
        item.textContent = `${deposito.nombre} depositó $${deposito.monto.toFixed(2)}`;
        historial.appendChild(item);
    });

    document.getElementById("monto-total").innerText = `$${data.total.toFixed(2)}`;
}

// Cargar historial al cargar la página
cargarHistorial();
