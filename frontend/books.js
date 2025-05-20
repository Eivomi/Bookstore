import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Налаштування Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdUcZmtwjSpU50-phZThQ9fsEYFK8WWBg",
  authDomain: "lab4authapp.firebaseapp.com",
  projectId: "lab4authapp",
  storageBucket: "lab4authapp.appspot.com",
  messagingSenderId: "806387839937",
  appId: "1:806387839937:web:abcdef123456"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Отримання id книги з параметрів URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Завантаження детальної інформації про книгу з Firestore
const bookRef = doc(db, "books", bookId);
console.log("ID книги:", bookId);

getDoc(bookRef).then((docSnapshot) => {
  if (docSnapshot.exists()) {
    const book = docSnapshot.data();
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = `Автор: ${book.author}`;
    document.getElementById('book-price').textContent = `Ціна: ${book.price}`;
    document.getElementById('book-rating').textContent = `Рейтинг: ${book.rating} ★`;
    document.getElementById('book-genre').textContent = `Жанр: ${book.genre}`;
    document.getElementById('book-description').textContent = `Опис: ${book.description}`;
    document.getElementById('book-image').src = book.image;
    console.log("Дані книги:", book);
  } else {
    console.log("Книга не знайдена!");
  }
}).catch((error) => {
  console.error("Помилка при отриманні книги: ", error);
});
