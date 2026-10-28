# 🛍️ ShopEase – E-commerce Mobile App

ShopEase is a full-featured e-commerce mobile app built with **React Native (Expo)**. Users can browse products, search and filter by category, save favourites, manage a shopping cart with promo codes, check out, and track their orders. It also includes dark mode and a built-in admin screen for managing products.


## 📱 Screenshots

### Home, Product Details & Cart

| Home | Product Details | Cart |
|:---:|:---:|:---:|
| <img src="./screenshots/home.png" width="200" alt="ShopEase Home Screen" /> | <img src="./screenshots/product-details.png" width="200" alt="Product Details Screen" /> | <img src="./screenshots/cart.png" width="200" alt="Shopping Cart Screen" /> |

### Checkout, Orders & Profile

| Checkout | Orders | Profile (Dark Mode) |
|:---:|:---:|:---:|
| <img src="./screenshots/checkout.png" width="200" alt="Checkout Screen" /> | <img src="./screenshots/orders.png" width="200" alt="Orders Screen" /> | <img src="./screenshots/profile-dark.png" width="200" alt="Profile in Dark Mode" /> |


## 🎬 App Demo

Watch the ShopEase mobile app demo:

[![ShopEase App Demo]](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)


## ✨ Features

- **Authentication:** register, login, logout with form validation
- **Product browsing:** product grid, live search, category filter
- **Product details:** image, rating, description, quantity selector
- **Shopping cart:** add/remove items, change quantities, live totals, cart badge, persisted between app launches
- **Promo codes:** `SAVE10` (10% off) and `SAVE20` (20% off)
- **Checkout:** delivery address (saved for next time), Cash on Delivery or card form with validation
- **Orders:** order success screen, order history with status (Processing → On the way → Delivered)
- **Wishlist:** save and view favourite products
- **Dark mode:** toggle from the Profile screen
- **Local notifications:** order confirmation and shipping updates (in a real build)
- **Admin screen:** add, edit and delete your own products, which appear on the Home screen

## 🧰 Tech Stack

- React Native with Expo
- React Navigation (stack and bottom tabs)
- Redux Toolkit (global state)
- AsyncStorage (data persistence)
- expo-notifications (local notifications)
- [FakeStore API](https://fakestoreapi.com) (sample product data)

## 🗂️ Project Structure

```
src/
  api/          API calls
  components/   Reusable UI (ProductCard, CategoryChips, FormInput)
  hooks/        useTheme
  navigation/   AppNavigator
  screens/      All app screens
  store/        Redux slices (cart, wishlist, auth, orders, theme, products)
  utils/        notifications, order status
```

## 🚀 Getting Started

**Prerequisites:** Node.js and the Expo Go app on your phone.

```bash
git clone https://github.com/ChamodyaIshani99/ShopEase.git
cd ShopEase
npm install
npx expo start
```

Scan the QR code with Expo Go (phone and computer on the same Wi-Fi).

### Build an Android APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## ⚠️ Current Limitations

This version is a front-end project, so:

- User accounts, orders and admin products are stored **on the device** (AsyncStorage), not on a server.
- Passwords are stored locally in plain text, which is for demo purposes only.
- Card payment is a validated form only, with no real payment processing.
- Order status is simulated based on time.

## 🔮 Future Improvements

- Node.js + Express backend with a database (MySQL/MongoDB)
- JWT authentication with hashed passwords
- Real payments with Stripe
- Remote push notifications
- Product reviews and ratings
- Multiple saved addresses

## 👩‍💻 Author

**Ishani Chamodya**
- GitHub: [ChamodyaIshani99](https://github.com/ChamodyaIshani99)
- LinkedIn: [chamodya10](https://linkedin.com/in/chamodya10/)