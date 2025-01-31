// Importar la base de datos desde firebase_configuracion.js
import { database } from "./firebase_configuracion.js";
import { ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Función para agregar un nuevo depósito
function agregarDeposito(cantidad) {
    const depositosRef = ref(database, 'depositos'); // Referencia a la base de datos
    push(depositosRef, { 
        cantidad: cantidad, 
        fecha: new Date().toISOString() 
    }).then(() => {
        console.log("✅ Depósito agregado correctamente");
    }).catch((error) => {
        console.error("❌ Error al agregar depósito:", error);
    });
}

// Función para leer los depósitos y asegurarse de que se mantengan registrados
function leerDepositos() {
    const depositosRef = ref(database, 'depositos'); // Referencia a la base de datos
    onValue(depositosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log("📌 Datos de depósitos registrados:", data);
        } else {
            console.log("⚠️ No hay depósitos registrados aún.");
        }
    });
}

// Llamar a la función para probar
agregarDeposito(10000); // Prueba agregando un depósito
leerDepositos(); // Verifica si los datos se guardan y leen correctamente