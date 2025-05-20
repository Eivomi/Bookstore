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

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("Поточний UID:", user.uid);
      localStorage.setItem("isLoggedIn", "true");

      // Отримуємо дані користувача з Firestore
      const userRef = db.collection("users").doc(user.uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        document.getElementById("user-name").innerText = `Ім'я: ${userData.name}`;
        document.getElementById("user-surname").innerText = `Прізвище: ${userData.surname}`;
        document.getElementById("user-email").innerText = `Email: ${userData.email}`;
        // document.getElementById("user-password").innerText = `Пароль: ${userData.password}`; // Не зберігаємо пароль в UI

        document.getElementById("logout-button").style.display = 'block';
      } else {
        console.log("Користувача не знайдено в Firestore.");
      }

      // Отримуємо замовлення
      const ordersSnapshot = await fetch(`/api/orders?userId=${user.uid}`)
        .then(response => response.json())
        .catch(error => {
          console.error("Помилка при отриманні замовлень:", error);
          return [];
        });

      const purchaseStatus = document.getElementById("purchase-status");

      if (ordersSnapshot.length === 0) { // Перевіряємо довжину масиву
        purchaseStatus.textContent = "У вас ще немає покупок";
      } else {
        purchaseStatus.textContent = "";
        ordersSnapshot.forEach((order) => {
          const orderEl = document.createElement("div");
          orderEl.classList.add("order-item");

          // Оновлюємо форматування дати
          const orderDate = new Date(order.timestamp.seconds * 1000).toLocaleString(); // Преобразуємо timestamp в Date

          orderEl.innerHTML = `
            <p><strong>Дата:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
            <p><strong>Адреса:</strong> ${order.address}</p>
            <p><strong>Сума:</strong> ${order.total} ₴</p>
            <p><strong>Товари:</strong></p>
            <ul>
              ${order.items.map(item => `<li><strong>${item.title}</strong> (${item.author}) — ${item.price}</li>`).join("")}
            </ul>
            <hr>
          `;
          purchaseStatus.appendChild(orderEl);
        });
      }

    } else {
      localStorage.setItem("isLoggedIn", "false");
      if (window.location.pathname === '/account.html') {
        window.location.href = "login.html";
      }
    }
  });

  document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut().then(() => {
      localStorage.setItem("isLoggedIn", "false");
      window.location.href = "index.html";
    });
  });

  window.updateUserData = async function (newName, newSurname) {
    const user = auth.currentUser;
    if (user) {
      try {
        const userEmail = user.email;
        if (usersData[userEmail]) {
          usersData[userEmail].name = newName;
          usersData[userEmail].surname = newSurname;
        }
        alert("Дані оновлено");
        document.getElementById("user-name").innerText = `${newName}`;
        document.getElementById("user-surname").innerText = `${newSurname}`;
      } catch (error) {
        alert("Помилка оновлення даних");
        console.error(error);
      }
    }
  };

  const timeItems = document.querySelectorAll(".time-item");
  timeItems.forEach(item => {
    item.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });

  window.openAccountForm = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      window.location.href = "account.html";
    } else {
      openLoginModal();
    }
  };

  function openLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) {
      modal.style.display = "block";
    } else {
      window.location.href = "login.html";
    }
  }

});
