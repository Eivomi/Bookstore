const express = require("express");
const cors = require("cors");
const path = require("path");
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Вказуємо директорію для статичних файлів
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "img")));

// ініціалізація Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, 'config', 'serviceAccountKey.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Маршрут для збереження нового замовлення
app.post('/api/orders', async (req, res) => {
  const { userId, items, address, total, timestamp } = req.body; // Отримуємо дані замовлення з тіла запиту

  // Перевіряємо наявність товарів у кошику
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Не можна оформити замовлення без товарів у кошику.' });
  }

  // Створення нового замовлення у базі даних
  try {
    // Зберігаємо нове замовлення в колекцію "orders"
    const orderRef = await db.collection('orders').add({
      uid: userId,
      items: items,
      address: address,
      total: total,
      timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)), // Дата оформлення
    });

    // Повертаємо підтвердження з ID нового замовлення
    res.status(201).json({ message: 'Замовлення оформлено успішно', orderId: orderRef.id });
  } catch (error) {
    console.error("Помилка при збереженні замовлення:", error);
    res.status(500).json({ message: 'Сталася помилка на сервері при збереженні замовлення.' });
  }
});

app.get('/api/orders', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID не надано.' });
  }

  try {
    // Отримуємо замовлення користувача з колекції "orders"
    const ordersSnapshot = await db.collection('orders')
      .where('uid', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    if (ordersSnapshot.empty) {
      return res.status(404).json({ message: 'Замовлення не знайдено.' });
    }

    // Створюємо масив замовлень
    const orders = ordersSnapshot.docs.map(doc => {
      const order = doc.data();
      let formattedDate = null;


      if (order.timestamp && order.timestamp instanceof admin.firestore.Timestamp) {
        formattedDate = order.timestamp.toDate().toLocaleString();
      } else {
      }

      return {
        ...order,
        id: doc.id,
        timestamp: formattedDate,
      };
    });

    // Відправляємо замовлення на клієнт
    res.status(200).json(orders);
  } catch (error) {
    console.error("Помилка при отриманні замовлень:", error);
    res.status(500).json({ message: 'Сталася помилка на сервері.' });
  }
});



// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
