
const books = [
  {
    title: "Залізне полум’я. Емпіреї. Книга 2",
    author: "Ребекка Ярроск",
    price: "720 грн",
    image: "book13.png",
    rating: 4.8,
    genre: "Фантастика",
    uid: "nUZUx9YFvaKKrYImcYkn"
  },
  {
    title: "До останнього подиху",
    author: "Дженніфер Арментраут",
    price: "400 грн",
    image: "book14.png",
    rating: 4.5,
    genre: "Повість",
    uid: "y1kbUbPximnyDuQprVpt"
  },
  {
    title: "Емоційний інтелект",
    author: "Д. Ґоулман",
    price: "420 грн",
    image: "book15.png",
    rating: 5.0,
    genre: "Мотиваційна література",
    uid: "1uRQ8OXT96xK394e2t7i"
  },
  {
    title: "Смертоносні тварини",
    author: "Марі Тірні",
    price: "350 грн",
    image: "book1.png",
    rating: 4.5,
    genre: "Фантастика",
    uid:"xhV42THWIhq3fHsYXWa8"
  },
  {
    title: "Вцілілий",
    author: "Чак Поланік",
    price: "300 грн",
    image: "book2.png",
    rating: 4.0,
    genre: "Детектив",
    uid:"H77FIXShUDKYkxSNkYjH"
  },
  {
    title: "Вівторки з Моррі",
    author: "Мітч Елбом",
    price: "220 грн",
    image: "book3.png",
    rating: 5.0,
    genre: "Романтика",
    uid:"G9OxOS21T4VwQcjCxO5L"
  },
  {
    title: "Таємне життя бджіл",
    author: "Сью Монк Кідд",
    price: "350 грн",
    image: "book12.png",
    rating: 3.9,
    genre: "Драма",
    uid: "36ownn3l0OfXZOMFs0md"
  },
  {
    title: "Кохання",
    author: "Ана Хван",
    price: "500 грн",
    image: "book4.png",
    rating: 4.2,
    genre: "Романтика",
    uid:"sjKgHoNXHq69PI3Wq6AS"
  },
  {
    title: "Світло війни",
    author: "Майкл Ондатже",
    price: "320 грн",
    image: "book5.png",
    rating: 4.7,
    genre: "Драма",
    uid:"OALyqAEzgWyrfQxSSG5T"
  },
  {
    title: "Уроки хімії",
    author: "Бонні Ґармус",
    price: "350 грн",
    image: "book10.png",
    rating: 4.5,
    genre: "Драма",
    uid:"R1NecAtbrM8OClYI5V9p",
  },
  {
    title: "Фанат",
    author: "Нік Горнбі",
    price: "320 грн",
    image: "book6.png",
    rating: 4.3,
    genre: "Романтика",
    uid:"UP0rRg7cDGwfhI11nKiG"
  },
  {
    title: "Палімпсести",
    author: "Василь Стус",
    price: "380 грн",
    image: "book7.png",
    rating: 4.6,
    genre: "Поезія",
    uid: "tUXynMK534OCJyFwaNFN"
  },
  {
    title: "Асистент",
    author: "Тесс Ґеррітсен",
    price: "300 грн",
    image: "book8.png",
    rating: 4.4,
    genre: "Трилер",
    uid:"fTTAxyUZlr2I03G042tR"
  },
  {
    title: "Убивство Роджера Екройда",
    author: "Аґата Крісті",
    price: "230 грн",
    image: "book9.png",
    rating: 4.8,
    genre: "Детектив",
    uid: "qgLUdF9j1Tga3WvB1XUK"
  },
  {
    title: "Наречена вітру",
    author: "Юрій Винничук",
    price: "400 грн",
    image: "book11.png",
    rating: 4.9,
    genre: "Повість",
    uid: "OO9wwOZQpjepB0hUEXP8"
  }
];

const bookList = document.getElementById("book-list");

function renderBooks(filteredBooks) {
  bookList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(book.rating) ? "★" : "☆").join("");

    bookCard.innerHTML = `
      <img src="${book.image}" alt="${book.title}" class="book-image">
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <p class="book-price">${book.price}</p>
        <p class="book-rating">${ratingStars} (${book.rating})</p>
      </div>
    `;

    bookCard.addEventListener("click", () => {
      window.location.href = `books.html?id=${book.uid || index}`;
    });

    bookList.appendChild(bookCard);
  });
}



// Функція для фільтрації
function filterBooks(filterType, filterValue) {
  if (filterValue === "all") {
    renderBooks(books); // Показати всі книги
  } else {
    const filteredBooks = books.filter((book) => book[filterType] === filterValue);
    renderBooks(filteredBooks);
  }
}
const timeItems = document.querySelectorAll(".time-item");
timeItems.forEach(item => {
  item.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
// Початкове відображення всіх книг
renderBooks(books);
