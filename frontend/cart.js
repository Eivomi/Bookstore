document.addEventListener("DOMContentLoaded", () => {
  renderCart();
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
});

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Ваш кошик порожній.</p>";
    totalPriceElement.textContent = "Загальна вартість: 0 грн";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    let price = parseFloat(item.price.toString().replace(/[^\d.]/g, '')); // Видаляє все, крім чисел і крапки
    let quantity = parseInt(item.quantity) || 1; // Якщо quantity порожній, встановлює 1

    if (isNaN(price)) {
      console.error(`Помилка: некоректна ціна у товарі`, item);
      price = 0;
    }

    totalPrice += price * quantity;

    cartContainer.innerHTML += `
    <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <p>${item.title} - ${item.author} - ${price} грн</p>
        <input type="number" min="1" value="${quantity}" onchange="updateQuantity(${index}, this.value)">
                        <img src="cancel.svg" alt="Видалити" class="remove-icon" onclick="removeFromCart(${index})">
                    </div>
                `;
  });
  cartContainer.innerHTML += `
    <div style="margin-top: 20px; text-align: center;">
      <button id="checkout-btn" style="padding: 10px 20px;">Оформити замовлення</button>
    </div>
  `;

  totalPriceElement.textContent = `Загальна вартість: ${totalPrice.toFixed(2)} грн`;
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(cartItem => cartItem.title === item.title);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateQuantity(index, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity = parseInt(newQuantity);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

document.getElementById("clear-cart").addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
});


function showOrderForm(email) {
  const cartContainer = document.getElementById("cart-items");

  cartContainer.innerHTML = `
    <h3>Оформлення замовлення</h3>
    <p><strong>Email:</strong> ${email}</p>
    <label>Адреса доставки:</label>
    <input type="text" id="delivery-address" placeholder="Введіть адресу" required>

    <label>Спосіб оплати:</label>
    <select id="payment-method">
      <option value="card">Карта</option>
      <option value="cash">Готівка при отриманні</option>
    </select>

    <button id="confirm-order-btn" style="margin-top: 10px;">Підтвердити замовлення</button>
  `;
}
document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "checkout-btn") {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб оформити замовлення.");
      return;
    }
    showOrderForm(user.email);
  }

  if (e.target && e.target.id === "confirm-order-btn") {
    const address = document.getElementById("delivery-address").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;
    const user = firebase.auth().currentUser;

    if (!address) {
      alert("Будь ласка, введіть адресу доставки.");
      return;
    }

    if (!user) {
      alert("Сеанс автентифікації втрачено. Увійдіть знову.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Ваш кошик порожній.");
      return;
    }

    const orderData = {
      uid: user.uid,
      email: user.email,
      items: cart,
      address,
      paymentMethod,
      total: cart.reduce((sum, item) => {
        const price = parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
        const quantity = parseInt(item.quantity) || 1;
        return sum + price * quantity;
      }, 0),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await firebase.firestore().collection("orders").add(orderData);
      localStorage.removeItem("cart");
      alert("Дякуємо! Ваше замовлення оформлено.");
      renderCart();
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  }
});

const timeItems = document.querySelectorAll(".time-item");
timeItems.forEach(item => {
  item.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
