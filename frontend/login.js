document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCdUcZmtwjSpU50-phZThQ9fsEYFK8WWBg",
    authDomain: "lab4authapp.firebaseapp.com",
    projectId: "lab4authapp",
    storageBucket: "lab4authapp.appspot.com",
    messagingSenderId: "806387839937",
    appId: "1:806387839937:web:abcdef123456"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  const AuthForm = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [isRegistering, setIsRegistering] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();  // Зупинити стандартну поведінку форми
      if (isRegistering) {
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
          await db.collection("users").doc(user.uid).set({
            email, name, surname, password
          });
          window.location.href = "account.html";
        } catch (error) {
          alert("Помилка реєстрації: " + error.message);
        }
      } else {
        try {
          await auth.signInWithEmailAndPassword(email, password);
          window.location.href = "account.html";
        } catch (error) {
          alert("Помилка входу: " + error.message);
        }
      }
    };


    return (
      React.createElement('div', {
          style: {
            width: "300px", margin: "0 auto",
            display: "flex", flexDirection: "column", gap: "10px"
          }
        },
        React.createElement('h2', null, isRegistering ? "Реєстрація" : "Авторизація"),
        isRegistering && React.createElement(React.Fragment, null,
          React.createElement('input', {
            type: "text", placeholder: "Ім'я", value: name,
            onChange: (e) => setName(e.target.value)
          }),
          React.createElement('input', {
            type: "text", placeholder: "Прізвище", value: surname,
            onChange: (e) => setSurname(e.target.value)
          })
        ),
        React.createElement('input', {
          type: "email", placeholder: "Email", value: email,
          onChange: (e) => setEmail(e.target.value)
        }),
        React.createElement('input', {
          type: "password", placeholder: "Пароль", value: password,
          onChange: (e) => setPassword(e.target.value)
        }),
        React.createElement('button', { onClick: handleSubmit },
          isRegistering ? "Зареєструватися" : "Увійти"
        ),
        React.createElement('button', {
          onClick: () => setIsRegistering(!isRegistering)
        }, isRegistering ? "Вже є акаунт? Увійти" : "Немає акаунту? Реєстрація")
      )
    );
  };

  // Перевірка автентифікації перед відкриттям форми
  window.openAccountForm = function () {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // Якщо користувач авторизований, редиректити на акаунт
        window.location.href = "account.html";
      } else {
        // Якщо користувач не авторизований, відкриваємо форму авторизації
        document.getElementById("auth-modal").style.display = "flex";
        const rootElement = document.getElementById("react-auth-root");
        if (rootElement) {
          ReactDOM.createRoot(rootElement).render(React.createElement(AuthForm));
        }
      }
    });
  };

  window.closeAccountForm = function () {
    document.getElementById("auth-modal").style.display = "none";
  };
});
