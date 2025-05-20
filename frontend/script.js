document.addEventListener("DOMContentLoaded", () => {
  const books = [
    { title: "Смертоносні тварини", author: "Марі Тірні", price: "350 грн", image: "book1.png", description: "Мертві говорять лише з тими, хто готовий слухати", rating: 4.5 },
    { title: "Вцілілий", author: "Чак Поланік", price: "300 грн", image: "book2.png", description: "Тендер Бренсон - єдиний вцілілий член сектантської общини...", rating: 4.2 },
    { title: "Вівторки з Моррі", author: "Мітч Елбом", price: "220 грн", image: "book3.png", description: "«Вівторки з Моррі» - чарівна хроніка теплих стосунків...", rating: 4.8 },
    { title: "Кохання", author: "Ана Хван", price: "500 грн", image: "book4.png", description: "В нього крижане серце... Але заради неї він спалив би цілий світ", rating: 4.1 },
    { title: "Світло війни", author: "Майкл Ондатже", price: "320 грн", image: "book5.png", description: "Жахи Другої світової позаду. Лондон оговтується від кривавої війни.", rating: 4.3 },
    { title: "Фанат", author: "Нік Горнбі", price: "320 грн", image: "book6.png", description: "Весела і водночас філософська історія про дорослішання...", rating: 3.9 },
    { title: "Палімпсести", author: "Василь Стус", price: "380 грн", image: "book7.png", description: "До книги Василя Стуса увійшли вибрані вірші з різних періодів...", rating: 5.0 },
    { title: "Асистент", author: "Тесс Ґеррітсен", price: "300 грн", image: "book8.png", description: "Рік тому детективу Джейн Ріццолі вдалося вистежити злочинця...", rating: 4.0 },
    { title: "Убивство Роджера Екройда", author: "Аґата Крісті", price: "230 грн", image: "book9.png", description: "Еркюль Пуаро береться за чергове розслідування.", rating: 4.7 },
    { title: "Уроки хімії", author: "Бонні Ґармус", price: "350 грн", image: "book10.png", description: "Елізабет — геніальна вчена-хімік. На неї чекала блискуча кар’єра...", rating: 4.6 }
  ];

  // ========== FAQ toggle ==========
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      if (answer) answer.classList.toggle("show");
    });
  });

  // ========== На головній сторінці ==========
  const booksContainer = document.getElementById("books-container");
  if (booksContainer) {
    const shuffledBooks = books.sort(() => 0.5 - Math.random()).slice(0, 10);
    booksContainer.innerHTML = ""; // очищення

    shuffledBooks.forEach(book => {
      const card = document.createElement("div");
      card.classList.add("book-card");

      card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">${book.author}</p>
          <p class="book-price">${book.price}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        sessionStorage.setItem("selectedBook", JSON.stringify(book));
        window.location.href = "book.html";
      });

      booksContainer.appendChild(card);
    });
  }

  // ========== Сторінка книги ==========
  const selectedBookData = sessionStorage.getItem("selectedBook");
  if (selectedBookData && document.getElementById("book-title")) {
    const selectedBook = JSON.parse(selectedBookData);

    document.getElementById("book-image").src = selectedBook.image;
    document.getElementById("book-image").alt = selectedBook.title;
    document.getElementById("book-title").textContent = selectedBook.title;
    document.getElementById("book-author").textContent = `Автор: ${selectedBook.author}`;
    document.getElementById("book-price").textContent = `Ціна: ${selectedBook.price}`;
    document.getElementById("book-description").textContent = selectedBook.description;

    const addToCartButton = document.getElementById("add-to-cart");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.some(book => book.title === selectedBook.title)) {
      addToCartButton.disabled = true;
      addToCartButton.textContent = "Вже в кошику";
      addToCartButton.style.backgroundColor = "#888";
    }

    addToCartButton.addEventListener("click", () => {
      if (!cart.some(book => book.title === selectedBook.title)) {
        cart.push(selectedBook);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${selectedBook.title} додано в кошик`);

        addToCartButton.disabled = true;
        addToCartButton.textContent = "Вже в кошику";
        addToCartButton.style.backgroundColor = "#888";
      }
    });

    // Вподобання
    const favBtn = document.getElementById("add-to-favorites");
    favBtn.addEventListener("click", () => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (!favorites.some(fav => fav.title === selectedBook.title)) {
        favorites.push(selectedBook);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${selectedBook.title} додано до вподобаних`);
        favBtn.disabled = true;
        favBtn.textContent = "Вподобано";
      } else {
        alert(`${selectedBook.title} вже у вподобаних`);
      }
    });
  }

  // ========== Пошук книг ==========
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const bookList = document.getElementById("book-list");

  if (searchBtn && searchInput && bookList) {
    const renderBooks = (filteredBooks) => {
      bookList.innerHTML = "";
      filteredBooks.forEach((book) => {
        const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(book.rating) ? "★" : "☆").join("");

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
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
          sessionStorage.setItem("selectedBook", JSON.stringify(book));
          window.location.href = "book.html";
        });

        bookList.appendChild(bookCard);
      });
    };

    // Виводимо всі книги спочатку
    renderBooks(books);

    // Обробка пошуку
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
      renderBooks(filtered);
    });
  }
});
