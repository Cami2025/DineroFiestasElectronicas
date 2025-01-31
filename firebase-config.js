 // Importar Firebase y Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA4ZOaSkduTmMNmMQ-B1UtCDJtSK7JU9hA",
  authDomain: "fiestas-a5462.firebaseapp.com",
  databaseURL: "https://fiestas-a5462-default-rtdb.firebaseio.com",
  projectId: "fiestas-a5462",
  storageBucket: "fiestas-a5462.appspot.com",
  messagingSenderId: "772543336072",
  appId: "1:772543336072:web:b88c7f08a89f1dd3dcd93d",
  measurementId: "G-317ZHZ47NW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exportar la base de datos
export { database };