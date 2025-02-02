// ... (configuración e importaciones, persistencia en inMemoryPersistence)
setPersistence(auth, inMemoryPersistence)
  .then(() => {
    console.log("Persistence set to inMemoryPersistence: se pedirá login cada vez.");
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("Usuario NO autenticado.");
        mostrarLogin();
        if (loginContainer) loginContainer.style.display = "block";
        if (appContent) appContent.style.display = "none";
      } else {
        console.log("Usuario autenticado:", user);
        if (loginContainer) loginContainer.style.display = "none";
        if (appContent) appContent.style.display = "block";
      }
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// En el listener del botón de login:
document.getElementById("loginButton").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  console.log("Intentando iniciar sesión con:", email);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Inicio de sesión exitoso:", userCredential);
      // Actualizamos la UI sin recargar
      if (loginContainer) loginContainer.style.display = "none";
      if (appContent) appContent.style.display = "block";
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    });
