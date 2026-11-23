import React, { useEffect, useMemo, useState } from "react";

const translations = {
  ru: {
    navHome: "Главная", navCatalog: "Каталог", navAbout: "О нас", navDelivery: "Доставка", navContacts: "Контакты",
    search: "Поиск запчастей...", login: "Войти", cart: "Корзина", eyebrow: "ПРЕМИАЛЬНОЕ КАЧЕСТВО",
    title: "Автозапчасти<br><em>премиум-класса.</em>", subtitle: "Надёжность. Стиль. Долговечность.",
    shopNow: "Перейти в каталог", benefits: ["Премиум качество", "Долгий срок службы", "Лучшая поддержка", "Гарантия на товары", "Быстрая доставка"],
    topProducts: "Топ товары", seeAll: "Смотреть все", categories: ["Все запчасти", "Тормозная система", "Электрика", "Расходники", "Подвеска", "Двигатель"],
    sort: "Сортировать", popular: "Популярное", lowPrice: "Сначала дешевле", highPrice: "Сначала дороже", rating: "По рейтингу",
    reviews: "отзывов", inStock: "В наличии", outStock: "Нет в наличии", addCart: "В корзину", reserve: "Забронировать",
    productDetails: "О товаре", sku: "Артикул", category: "Категория", compatibility: "Совместимость", description: "Описание",
    writeReview: "Оставить отзыв", noReviews: "Отзывов пока нет — будьте первым!", reviewPlaceholder: "Поделитесь впечатлениями...",
    send: "Отправить", bookingTitle: "Бронирование детали", bookingText: "Закрепим товар за вами на 24 часа.",
    phone: "Номер телефона", reserve24: "Забронировать на 24 часа", cartTitle: "Ваша корзина", emptyCart: "Корзина пока пуста",
    total: "Итого", checkout: "Оформить заказ", remove: "Удалить", wishlist: "Избранное", emptyWishlist: "В избранном пока ничего нет",
    checkoutTitle: "Оформление заказа", name: "Ваше имя", address: "Адрес доставки", deliveryType: "Получение заказа",
    delivery: "Доставка", pickup: "Самовывоз", payment: "Способ оплаты", cash: "Наличными при получении",
    card: "Банковская карта", placeOrder: "Подтвердить заказ", authTitle: "Добро пожаловать",
    signIn: "Войти", register: "Регистрация", password: "Пароль", createAccount: "Создать аккаунт",
    demoNote: "Демо-режим: данные сохраняются только в этом браузере.", admin: "Админ-панель",
    adminTitle: "Управление магазином", products: "Товары", orders: "Заказы", bookings: "Брони",
    newProduct: "Новый товар", productName: "Название товара", imageUrl: "Ссылка на фото", price: "Цена (сом)",
    addProduct: "Добавить товар", noOrders: "Оформленных заказов пока нет", noBookings: "Активных броней пока нет",
    noResults: "Ничего не найдено", noResultsText: "Измените запрос или выберите другую категорию.",
    order: "Заказ", active: "Активна", successCart: "Добавлено в корзину", successBooking: "Товар забронирован на 24 часа",
    successOrder: "Заказ успешно оформлен!", successReview: "Спасибо за отзыв!", successProduct: "Товар добавлен в каталог",
    successDelete: "Товар удалён", loginError: "Проверьте номер и пароль.", registered: "Аккаунт создан",
    footer: "Автозапчасти для уверенных поездок.", expert: "Нужна помощь с выбором? Позвоните нам",
    close: "Закрыть", signedOut: "Вы вышли из аккаунта", navNote: "Оригинальные детали. Уверенный путь."
  },
  kg: {
    navHome: "Башкы бет", navCatalog: "Каталог", navAbout: "Биз жөнүндө", navDelivery: "Жеткирүү", navContacts: "Байланыш",
    search: "Тетик издөө...", login: "Кирүү", cart: "Себет", eyebrow: "ПРЕМИУМ САПАТ",
    title: "Премиум авто<br><em>тетиктер.</em>", subtitle: "Ишенимдүүлүк. Стиль. Узак мөөнөт.",
    shopNow: "Каталогго өтүү", benefits: ["Премиум сапат", "Узак кызмат мөөнөтү", "Мыкты колдоо", "Кепилдик", "Тез жеткирүү"],
    topProducts: "Мыкты товарлар", seeAll: "Баарын көрүү", categories: ["Бардык тетиктер", "Тормоз системасы", "Электрика", "Чыгымдалуучу", "Асма", "Кыймылдаткыч"],
    sort: "Иреттөө", popular: "Популярдуу", lowPrice: "Адегенде арзаны", highPrice: "Адегенде кымбаты", rating: "Рейтинги боюнча",
    reviews: "пикир", inStock: "Бар", outStock: "Жок", addCart: "Себетке", reserve: "Брондоо",
    productDetails: "Товар жөнүндө", sku: "Артикул", category: "Категория", compatibility: "Шайкештик", description: "Сүрөттөмө",
    writeReview: "Пикир калтыруу", noReviews: "Азырынча пикир жок. Биринчи болуп жазыңыз!", reviewPlaceholder: "Пикириңиз менен бөлүшүңүз...",
    send: "Жөнөтүү", bookingTitle: "Тетикти брондоо", bookingText: "Товарды сиз үчүн 24 саатка сактайбыз.",
    phone: "Телефон номери", reserve24: "24 саатка брондоо", cartTitle: "Себетиңиз", emptyCart: "Себетиңиз азырынча бош",
    total: "Жалпысы", checkout: "Заказ берүү", remove: "Өчүрүү", wishlist: "Тандалгандар", emptyWishlist: "Тандалгандар азырынча бош",
    checkoutTitle: "Заказды тариздөө", name: "Атыңыз", address: "Жеткирүү дареги", deliveryType: "Заказды алуу",
    delivery: "Жеткирүү", pickup: "Өзү алып кетүү", payment: "Төлөм ыкмасы", cash: "Алганда накталай",
    card: "Банк картасы", placeOrder: "Заказды ырастоо", authTitle: "Кош келиңиз",
    signIn: "Кирүү", register: "Катталуу", password: "Сырсөз", createAccount: "Аккаунт түзүү",
    demoNote: "Демо режим: маалыматтар ушул браузерде гана сакталат.", admin: "Админ-панель",
    adminTitle: "Дүкөндү башкаруу", products: "Товарлар", orders: "Заказдар", bookings: "Брондор",
    newProduct: "Жаңы товар", productName: "Товардын аты", imageUrl: "Сүрөт шилтемеси", price: "Баасы (сом)",
    addProduct: "Товар кошуу", noOrders: "Заказдар азырынча жок", noBookings: "Активдүү брондор жок",
    noResults: "Эч нерсе табылган жок", noResultsText: "Издөөнү өзгөртүңүз же башка категорияны тандаңыз.",
    order: "Заказ", active: "Активдүү", successCart: "Себетке кошулду", successBooking: "Товар 24 саатка брондолду",
    successOrder: "Заказ ийгиликтүү берилди!", successReview: "Пикириңиз үчүн рахмат!", successProduct: "Товар каталогго кошулду",
    successDelete: "Товар өчүрүлдү", loginError: "Телефонду жана сырсөздү текшериңиз.", registered: "Аккаунт түзүлдү",
    footer: "Ишенимдүү сапарлар үчүн авто тетиктер.", expert: "Тандоого жардам керекпи? Чалыңыз",
    close: "Жабуу", signedOut: "Аккаунттан чыктыңыз", navNote: "Оригинал тетиктер. Ишенимдүү сапар."
  },
  en: {
    navHome: "Home", navCatalog: "Catalog", navAbout: "About", navDelivery: "Delivery", navContacts: "Contact",
    search: "Search auto parts...", login: "Sign in", cart: "Cart", eyebrow: "PREMIUM QUALITY",
    title: "Premium auto<br><em>parts.</em>", subtitle: "Reliability. Style. Built to last.",
    shopNow: "Explore catalog", benefits: ["Premium quality", "Long-lasting parts", "Expert support", "Product warranty", "Fast delivery"],
    topProducts: "Top products", seeAll: "See all", categories: ["All parts", "Braking system", "Electrical", "Consumables", "Suspension", "Engine"],
    sort: "Sort by", popular: "Popular", lowPrice: "Price: low to high", highPrice: "Price: high to low", rating: "Top rated",
    reviews: "reviews", inStock: "In stock", outStock: "Out of stock", addCart: "Add to cart", reserve: "Reserve",
    productDetails: "Product details", sku: "Part number", category: "Category", compatibility: "Compatibility", description: "Description",
    writeReview: "Write a review", noReviews: "No reviews yet. Be the first!", reviewPlaceholder: "Share your thoughts...",
    send: "Submit", bookingTitle: "Reserve this part", bookingText: "We'll hold this item for you for 24 hours.",
    phone: "Phone number", reserve24: "Reserve for 24 hours", cartTitle: "Your cart", emptyCart: "Your cart is empty",
    total: "Total", checkout: "Checkout", remove: "Remove", wishlist: "Wishlist", emptyWishlist: "Your wishlist is empty",
    checkoutTitle: "Checkout", name: "Your name", address: "Delivery address", deliveryType: "Fulfillment",
    delivery: "Delivery", pickup: "Pickup", payment: "Payment method", cash: "Cash on delivery",
    card: "Bank card", placeOrder: "Place order", authTitle: "Welcome",
    signIn: "Sign in", register: "Register", password: "Password", createAccount: "Create account",
    demoNote: "Demo mode: data is stored in this browser only.", admin: "Admin panel",
    adminTitle: "Store management", products: "Products", orders: "Orders", bookings: "Reservations",
    newProduct: "New product", productName: "Product name", imageUrl: "Photo URL", price: "Price (som)",
    addProduct: "Add product", noOrders: "No orders placed yet", noBookings: "No active reservations",
    noResults: "No parts found", noResultsText: "Try a different search or select another category.",
    order: "Order", active: "Active", successCart: "Added to cart", successBooking: "Reserved for 24 hours",
    successOrder: "Order placed successfully!", successReview: "Thanks for your review!", successProduct: "Product added",
    successDelete: "Product deleted", loginError: "Please check your phone and password.", registered: "Account created",
    footer: "Auto parts for confident journeys.", expert: "Need help choosing? Give us a call",
    close: "Close", signedOut: "You have signed out", navNote: "Genuine parts. Confident journeys."
  }
};

const categories = ["all", "brakes", "electrical", "consumables", "suspension", "engine"];
const categoryKey = { all: 0, brakes: 1, electrical: 2, consumables: 3, suspension: 4, engine: 5 };
const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const initialProducts = [
  { id: "p8", name: { ru: "Тормозной диск Brembo", kg: "Brembo тормоздук диски", en: "Brembo Brake Disc" }, sku: "BR-2246", category: "brakes", price: 5340, rating: 4.9, baseReviews: 124, image: photo("photo-1619642751034-765dfdf7c58e"), description: { ru: "Равномерное рассеивание тепла и стабильная эффективность торможения для уверенного контроля.", kg: "Жылуулукту бирдей бөлүштүрүп, туруктуу тормоздоону камсыздайт.", en: "Even heat distribution and consistent braking performance for confident control." }, compatibility: "Toyota Corolla, Camry", inStock: true },
  { id: "p4", name: { ru: "Свечи зажигания NGK Laser", kg: "NGK Laser от алдыруу шамдары", en: "NGK Laser Iridium Spark Plugs" }, sku: "EL-7710", category: "electrical", price: 2150, rating: 5, baseReviews: 98, image: photo("photo-1600661653561-629509216228"), description: { ru: "Иридиевые свечи обеспечивают стабильное зажигание, экономию топлива и лёгкий запуск двигателя.", kg: "Иридий шамдары туруктуу от алдырууну жана күйүүчү майды үнөмдөөнү камсыздайт.", en: "Iridium plugs deliver consistent ignition, improved fuel economy, and easy starts." }, compatibility: "Hyundai Solaris, Kia Rio", inStock: true },
  { id: "p1", name: { ru: "Масляный фильтр Bosch Premium", kg: "Bosch Premium май чыпкасы", en: "Bosch Premium Oil Filter" }, sku: "OF-2048", category: "consumables", price: 890, rating: 4.8, baseReviews: 76, image: photo("photo-1486262715619-67b85e0b08d3"), description: { ru: "Фильтр премиум-класса очищает моторное масло от загрязнений и помогает продлить ресурс двигателя.", kg: "Премиум чыпка мотор майын тазалап, кыймылдаткычтын кызмат мөөнөтүн узартат.", en: "Premium-grade filtration keeps engine oil clean and helps extend engine life." }, compatibility: "Toyota Camry, Corolla, RAV4", inStock: true },
  { id: "p3", name: { ru: "Амортизатор передний KYB", kg: "KYB алдыңкы амортизатору", en: "KYB Front Shock Absorber" }, sku: "SU-3041", category: "suspension", price: 6890, rating: 4.9, baseReviews: 112, image: photo("photo-1618843479313-40f8afb4b4d8"), description: { ru: "Газомасляный амортизатор обеспечивает устойчивость и комфорт даже на неровной дороге.", kg: "Газ-май амортизатору тегиз эмес жолдо туруктуулукту жана ыңгайлуулукту камсыздайт.", en: "Gas-oil shock absorber provides stability and comfort, even on rough roads." }, compatibility: "Toyota Camry 2012–2017", inStock: true },
  { id: "p2", name: { ru: "Тормозные колодки Akebono", kg: "Akebono тормоздук колодкалары", en: "Akebono Brake Pads" }, sku: "BR-1182", category: "brakes", price: 4250, rating: 4.8, baseReviews: 67, image: photo("photo-1486262715619-67b85e0b08d3"), description: { ru: "Тихое и уверенное торможение в любых погодных условиях. Износостойкий состав для долгого срока службы.", kg: "Ар кандай аба ырайында ишенимдүү тормоздоо. Узак кызмат үчүн эскирүүгө туруктуу курам.", en: "Quiet, confident braking in all weather conditions with a durable, long-lasting compound." }, compatibility: "Honda Accord, CR-V, Civic", inStock: true },
  { id: "p9", name: { ru: "Аккумулятор Varta Blue", kg: "Varta Blue аккумулятору", en: "Varta Blue Battery" }, sku: "EL-8821", category: "electrical", price: 9200, rating: 4.9, baseReviews: 143, image: photo("photo-1619642751034-765dfdf7c58e"), description: { ru: "Надёжный запуск двигателя и стабильное питание бортовой электроники в любую погоду.", kg: "Ар кандай аба ырайында ишенимдүү от алдыруу жана туруктуу электр энергиясы.", en: "Reliable starts and steady power for your vehicle's electrical system, in every season." }, compatibility: "Большинство легковых автомобилей", inStock: true },
  { id: "p5", name: { ru: "Воздушный фильтр Mann-Filter", kg: "Mann-Filter аба чыпкасы", en: "Mann-Filter Air Filter" }, sku: "OF-3529", category: "consumables", price: 1350, rating: 4.7, baseReviews: 54, image: photo("photo-1600661653561-629509216228"), description: { ru: "Высокая степень фильтрации защищает двигатель от пыли и помогает поддерживать оптимальный расход топлива.", kg: "Жогорку тазалоо деңгээли кыймылдаткычты чаңдан коргойт.", en: "High-efficiency filtration protects your engine from dust and helps maintain optimal fuel consumption." }, compatibility: "Volkswagen Polo, Golf", inStock: true },
  { id: "p6", name: { ru: "Комплект ремня ГРМ Gates", kg: "Gates ГРМ курунун топтому", en: "Gates Timing Belt Kit" }, sku: "EN-4107", category: "engine", price: 7980, rating: 4.9, baseReviews: 83, image: photo("photo-1486262715619-67b85e0b08d3"), description: { ru: "Комплект для точной синхронизации двигателя: ремень, ролики и крепёж.", kg: "Кыймылдаткычты так синхрондоштуруучу кур, роликтер жана бекиткичтер топтому.", en: "A dependable kit for precise engine timing, including belt, rollers, and hardware." }, compatibility: "Hyundai Tucson, Elantra", inStock: true }
];

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(`autoneed-${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(`autoneed-${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key}`, error);
  }
}

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    heart: <path d="M20.2 8.7c0 4.1-8.2 10-8.2 10s-8.2-5.9-8.2-10a4.2 4.2 0 0 1 7.7-2.3.6.6 0 0 0 1 0 4.2 4.2 0 0 1 7.7 2.3Z" />,
    user: <><circle cx="12" cy="8" r="3.3" /><path d="M5.5 20c.5-3.5 2.8-5.3 6.5-5.3s6 1.8 6.5 5.3" /></>,
    moon: <path d="M20.5 14.2A8.3 8.3 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    truck: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="17.5" cy="19" r="1.5" /></>,
    gem: <><path d="m3 9 4-6h10l4 6-9 12L3 9Z" /><path d="M3 9h18M7 3l5 18 5-18M7 3l-4 6m14-6 4 6" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    headset: <><path d="M3 12a9 9 0 0 1 18 0" /><path d="M3 12v5a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2Zm18 0v5a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" /></>,
    cycle: <><path d="M3 12a9 9 0 0 1 15-6l2 2" /><path d="M20 3v5h-5M21 12a9 9 0 0 1-15 6l-2-2" /><path d="M4 21v-5h5" /></>,
    close: <path d="m18 6-12 12M6 6l12 12" />
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ProductCard({ product, lang, t, money, wished, onWish, onAdd, onReserve, onOpen, index }) {
  const name = product.name?.[lang] || product.name?.ru || product.name;
  const reviews = product.reviews || [];
  const score = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : Number(product.rating || 0);
  const count = (product.baseReviews || 0) + reviews.length;
  return (
    <article className="product-card" onClick={() => onOpen(product.id)}>
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={name} loading="lazy" onError={(event) => { event.currentTarget.src = photo("photo-1486262715619-67b85e0b08d3"); }} />
        {index < 3 && <span className={`product-tag ${index === 0 ? "sale" : ""}`}>{index === 0 ? "−15%" : index === 1 ? "−20%" : "TOP"}</span>}
        <button className={`product-heart ${wished ? "active" : ""}`} aria-label={t("wishlist")} onClick={(event) => { event.stopPropagation(); onWish(product.id); }}><Icon name="heart" size={18} /></button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <div className="product-rating"><span className="stars">★</span><strong>{score.toFixed(1)}</strong><span className="rating-count">({count})</span></div>
        <div className="product-meta"><span className="product-price">{money(product.price)}</span><span className={`stock ${product.inStock === false ? "out" : ""}`}>{product.inStock === false ? t("outStock") : t("inStock")}</span></div>
        <div className="product-actions">
          <button className="add-cart" disabled={product.inStock === false} onClick={(event) => { event.stopPropagation(); onAdd(product.id); }}><Icon name="cart" size={16} /><span>{t("addCart")}</span></button>
          <button className="reserve-btn" onClick={(event) => { event.stopPropagation(); onReserve(product.id); }}>{t("reserve")}</button>
        </div>
      </div>
    </article>
  );
}

function Stars({ value, onChange }) {
  return <div className="review-stars" aria-label="Rating">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= value ? "selected" : ""} onClick={() => onChange(star)}>★</button>)}</div>;
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("autoneed-lang") || "ru");
  const [theme, setTheme] = useState(() => localStorage.getItem("autoneed-theme") || "light");
  const [products, setProducts] = useState(() => read("products", initialProducts));
  const [cart, setCart] = useState(() => read("cart", []));
  const [wishlist, setWishlist] = useState(() => read("wishlist", []));
  const [users, setUsers] = useState(() => read("users", []));
  const [user, setUser] = useState(() => read("user", null));
  const [orders, setOrders] = useState(() => read("orders", []));
  const [bookings, setBookings] = useState(() => read("bookings", []).filter((booking) => booking.until > Date.now()));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [panel, setPanel] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);
  const [adminTab, setAdminTab] = useState("products");
  const [authMode, setAuthMode] = useState("signIn");
  const [reviewRating, setReviewRating] = useState(5);
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const t = (key) => translations[lang]?.[key] ?? translations.ru[key] ?? key;
  const money = (amount) => `${new Intl.NumberFormat(lang === "en" ? "en-US" : lang === "kg" ? "ky-KG" : "ru-RU").format(amount)} сом`;
  const categoryName = (id) => translations[lang].categories[categoryKey[id]] ?? id;
  const localized = (value) => typeof value === "object" ? value?.[lang] || value?.ru || "" : value || "";
  const filtered = useMemo(() => {
    const result = products.filter((product) => (category === "all" || product.category === category)
      && `${localized(product.name)} ${product.sku}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    return result;
  }, [products, category, query, sort, lang]);

  useEffect(() => { document.documentElement.lang = lang === "kg" ? "ky" : lang; }, [lang]);
  useEffect(() => { document.body.dataset.theme = theme; localStorage.setItem("autoneed-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("autoneed-lang", lang); }, [lang]);
  useEffect(() => { save("products", products); }, [products]);
  useEffect(() => { save("cart", cart); }, [cart]);
  useEffect(() => { save("wishlist", wishlist); }, [wishlist]);
  useEffect(() => { save("users", users); }, [users]);
  useEffect(() => { save("user", user); }, [user]);
  useEffect(() => { save("orders", orders); }, [orders]);
  useEffect(() => { save("bookings", bookings); }, [bookings]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(""), 2700); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setPanel("");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector(".search-box input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const productById = (id) => products.find((product) => product.id === id);
  const changeCart = (id, delta) => setCart((items) => {
    const found = items.find((item) => item.id === id);
    if (!found) return delta > 0 ? [...items, { id, qty: 1 }] : items;
    return items.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0);
  });
  const addToCart = (id) => { changeCart(id, 1); setToast(t("successCart")); };
  const toggleWish = (id) => setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const cartTotal = cart.reduce((total, item) => total + (productById(item.id)?.price || 0) * item.qty, 0);
  const closePanel = () => setPanel("");
  const openProduct = (id) => { setActiveProduct(id); setPanel("product"); };
  const reserveProduct = (id) => { setActiveProduct(id); setPanel("booking"); };
  const switchLanguage = () => setLang((current) => current === "ru" ? "kg" : current === "kg" ? "en" : "ru");

  const submitReview = (event) => {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("review")?.trim();
    if (!text || !activeProduct) return;
    if (!user) {
      setPanel("auth");
      setAuthMode("signIn");
      setToast(lang === "kg" ? "Пикир калтыруу үчүн кириңиз." : lang === "en" ? "Sign in to leave a review." : "Войдите, чтобы оставить отзыв.");
      return;
    }
    setProducts((items) => items.map((product) => product.id === activeProduct
      ? { ...product, reviews: [...(product.reviews || []), { name: user?.name || t("login"), rating: reviewRating, text }] }
      : product));
    setReviewRating(5);
    setToast(t("successReview"));
  };

  const submitBooking = (event) => {
    event.preventDefault();
    const phone = new FormData(event.currentTarget).get("phone").trim();
    const product = productById(activeProduct);
    setBookings((items) => [...items, { id: product.id, name: localized(product.name), phone, until: Date.now() + 86400000 }]);
    closePanel();
    setToast(t("successBooking"));
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (authMode === "register") {
      if (users.some((item) => item.phone === data.phone)) { setToast(t("loginError")); return; }
      const newUser = { name: data.name.trim(), phone: data.phone.trim(), password: data.password };
      setUsers((items) => [...items, newUser]);
      setUser({ name: newUser.name, phone: newUser.phone });
      setToast(t("registered"));
    } else {
      const found = users.find((item) => item.phone === data.phone && item.password === data.password);
      if (!found) { setToast(t("loginError")); return; }
      setUser({ name: found.name, phone: found.phone });
    }
    closePanel();
  };

  const submitOrder = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const items = cart.map((item) => ({ ...item, name: localized(productById(item.id)?.name), price: productById(item.id)?.price || 0 }));
    setOrders((current) => [...current, {
      number: `AN-${Date.now().toString().slice(-7)}`, name: data.name, phone: data.phone,
      address: data.delivery === "pickup" ? t("pickup") : data.address, payment: data.payment, total: cartTotal, items, created: Date.now()
    }]);
    setCart([]);
    closePanel();
    setToast(t("successOrder"));
  };

  const submitProduct = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const id = `p-${Date.now()}`;
    setProducts((items) => [{
      id, name: { ru: data.name, kg: data.name, en: data.name }, sku: `AN-${Date.now().toString().slice(-5)}`,
      category: data.category, price: Number(data.price), rating: 0, reviews: [], image: data.image,
      description: { ru: data.description, kg: data.description, en: data.description }, compatibility: data.compatibility || "—", inStock: true
    }, ...items]);
    setToast(t("successProduct"));
    event.currentTarget.reset();
  };

  const deleteProduct = (id) => {
    setProducts((items) => items.filter((product) => product.id !== id));
    setCart((items) => items.filter((item) => item.id !== id));
    setWishlist((items) => items.filter((item) => item !== id));
    setToast(t("successDelete"));
  };

  const features = [
    { icon: "gem", text: t("benefits")[0] },
    { icon: "cycle", text: t("benefits")[1] },
    { icon: "headset", text: t("benefits")[2] },
    { icon: "shield", text: t("benefits")[3] },
    { icon: "truck", text: t("benefits")[4] }
  ];

  return (
    <div className={`app-shell ${theme}`}>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Auto Need">
          <span className="brand-mark">A<span>N</span></span>
          <span className="brand-copy"><strong>Auto<span>Need</span></strong><small>PARTS THAT MOVE YOU</small></span>
        </a>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle navigation">☰</button>
        <nav className={`main-nav ${mobileMenu ? "open" : ""}`}>
          <a href="#top" onClick={() => setMobileMenu(false)}>{t("navHome")}</a>
          <a href="#catalog" onClick={() => setMobileMenu(false)}>{t("navCatalog")}</a>
          <a href="#benefits" onClick={() => setMobileMenu(false)}>{t("navAbout")}</a>
          <a href="#footer" onClick={() => setMobileMenu(false)}>{t("navContacts")}</a>
          <button className="mobile-admin" onClick={() => { setPanel("admin"); setMobileMenu(false); }}>{t("admin")}</button>
        </nav>
        <label className="search-box"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} /><kbd>⌘ K</kbd></label>
        <div className="header-actions">
          <button className="round-button language-button" onClick={switchLanguage} aria-label="Change language">{lang.toUpperCase()}</button>
          <button className="round-button theme-button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label="Toggle theme"><Icon name={theme === "light" ? "moon" : "sun"} size={19} /></button>
          <button className="round-button account-button" onClick={() => user ? (setUser(null), setToast(t("signedOut"))) : (setAuthMode("signIn"), setPanel("auth"))} aria-label={user?.name || t("login")}><Icon name="user" size={20} /><span>{user?.name || ""}</span></button>
          <button className="round-button wishlist-button" onClick={() => setPanel("wishlist")} aria-label={t("wishlist")}><Icon name="heart" size={21} />{wishlist.length > 0 && <b className="count-badge">{wishlist.length}</b>}</button>
          <button className="cart-button" onClick={() => setPanel("cart")}><Icon name="cart" size={19} /><span>{t("cart")}</span><b className="count-badge">{cart.reduce((sum, item) => sum + item.qty, 0)}</b></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="eyebrow-dot" />{t("eyebrow")}</div>
            <h1 dangerouslySetInnerHTML={{ __html: t("title") }} />
            <p>{t("subtitle")}</p>
            <a className="gold-button hero-button" href="#catalog">{t("shopNow")} <span>→</span></a>
          </div>
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-pagination"><i className="active" /><i /><i /></div>
        </section>

        <section className="feature-strip" id="benefits" aria-label={t("navAbout")}>
          {features.map((feature) => <div className="feature-item" key={feature.icon}><span className="feature-icon"><Icon name={feature.icon} size={31} /></span><strong>{feature.text}</strong></div>)}
        </section>

        <section className="catalog-section" id="catalog">
          <div className="catalog-heading"><h2>{t("topProducts")}</h2><a href="#catalog">{t("seeAll")} <span>→</span></a></div>
          <div className="catalog-controls">
            <label className="mobile-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} /></label>
            <div className="category-list">{categories.map((id) => <button key={id} onClick={() => setCategory(id)} className={category === id ? "active" : ""}>{categoryName(id)}</button>)}</div>
            <label className="sort-control"><span>{t("sort")}:</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">{t("popular")}</option><option value="low">{t("lowPrice")}</option><option value="high">{t("highPrice")}</option><option value="rating">{t("rating")}</option></select></label>
          </div>
          {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} lang={lang} t={t} money={money} wished={wishlist.includes(product.id)} onWish={toggleWish} onAdd={addToCart} onReserve={reserveProduct} onOpen={openProduct} index={index} />)}</div>
            : <div className="empty-results"><span>⌕</span><h3>{t("noResults")}</h3><p>{t("noResultsText")}</p></div>}
        </section>

        <section className="help-banner"><div><span className="section-kicker">{t("navNote")}</span><h2>{t("expert")}</h2></div><a className="gold-button" href="tel:+996700555123">+996 700 555 123 <span>↗</span></a></section>
      </main>

      <footer id="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">A<span>N</span></span><span className="brand-copy"><strong>Auto<span>Need</span></strong><small>PARTS THAT MOVE YOU</small></span></a><p>{t("footer")}</p><button className="footer-admin" onClick={() => { setAdminTab("products"); setPanel("admin"); }}>{t("admin")}</button><span>© 2026 Auto Need</span></footer>

      {toast && <div className="toast-message" role="status">{toast}</div>}
      {panel && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        {["cart", "wishlist", "admin"].includes(panel) ? (
          <aside className="drawer" role="dialog" aria-modal="true">
            <div className="panel-heading"><div><small>AUTO NEED</small><h2>{panel === "cart" ? t("cartTitle") : panel === "wishlist" ? t("wishlist") : t("adminTitle")}</h2></div><button className="close-button" onClick={closePanel} aria-label={t("close")}><Icon name="close" /></button></div>
            {panel === "cart" && <div className="drawer-content">
              {cart.length ? <>{cart.map((item) => { const product = productById(item.id); if (!product) return null; return <div className="cart-row" key={item.id}><img src={product.image} alt="" /><div className="cart-product"><strong>{localized(product.name)}</strong><small>{money(product.price)}</small><div className="quantity"><button onClick={() => changeCart(item.id, -1)}>−</button><span>{item.qty}</span><button onClick={() => changeCart(item.id, 1)}>+</button></div></div><div className="cart-row-end"><strong>{money(product.price * item.qty)}</strong><button className="remove-button" onClick={() => setCart((items) => items.filter((cartItem) => cartItem.id !== item.id))}>{t("remove")}</button></div></div>; })}
                <div className="total-line"><span>{t("total")}</span><strong>{money(cartTotal)}</strong></div><button className="gold-button full-button" onClick={() => setPanel("checkout")}>{t("checkout")}</button></>
                : <div className="empty-panel">{t("emptyCart")}</div>}
            </div>}
            {panel === "wishlist" && <div className="drawer-content">{wishlist.length ? wishlist.map((id) => { const product = productById(id); if (!product) return null; return <div className="wish-row" key={id}><img src={product.image} alt="" /><div><strong>{localized(product.name)}</strong><small>{money(product.price)}</small></div><button onClick={() => toggleWish(id)} aria-label={t("remove")}>×</button></div>; }) : <div className="empty-panel">{t("emptyWishlist")}</div>}</div>}
            {panel === "admin" && <div className="drawer-content admin-content">
              <p className="demo-note">{t("demoNote")}</p>
              <div className="admin-tabs">{["products", "orders", "bookings"].map((tab) => <button key={tab} className={adminTab === tab ? "active" : ""} onClick={() => setAdminTab(tab)}>{t(tab)}</button>)}</div>
              {adminTab === "products" && <><h3>{t("newProduct")}</h3><form className="form-stack" onSubmit={submitProduct}>
                <label>{t("productName")}<input name="name" required /></label><label>{t("category")}<select name="category">{categories.filter((id) => id !== "all").map((id) => <option key={id} value={id}>{categoryName(id)}</option>)}</select></label>
                <label>{t("price")}<input name="price" type="number" min="1" required /></label><label>{t("imageUrl")}<input name="image" type="url" required /></label>
                <label>{t("compatibility")}<input name="compatibility" /></label><label>{t("description")}<textarea name="description" required /></label><button className="gold-button full-button">{t("addProduct")}</button>
              </form><div className="admin-list">{products.map((product) => <div className="admin-row" key={product.id}><span>{localized(product.name)}<small>{money(product.price)} · {product.sku}</small></span><button onClick={() => deleteProduct(product.id)}>{t("remove")}</button></div>)}</div></>}
              {adminTab === "orders" && (orders.length ? [...orders].reverse().map((order) => <div className="admin-row" key={order.number}><span>{t("order")} #{order.number} · {order.name}<small>{order.phone} · {order.address}</small><small>{order.items?.map((item) => `${item.name || localized(productById(item.id)?.name)} × ${item.qty}`).join(", ")}</small></span><strong>{money(order.total)}</strong></div>) : <div className="empty-panel">{t("noOrders")}</div>)}
              {adminTab === "bookings" && (bookings.filter((item) => item.until > Date.now()).length ? bookings.filter((item) => item.until > Date.now()).map((booking, index) => <div className="admin-row" key={`${booking.id}-${booking.until}-${index}`}><span>{booking.name}<small>{t("phone")}: {booking.phone}</small><small>{new Date(booking.until).toLocaleString(lang)}</small></span><strong className="active-status">{t("active")}</strong></div>) : <div className="empty-panel">{t("noBookings")}</div>)}
            </div>}
          </aside>
        ) : (
          <section className="modal-card" role="dialog" aria-modal="true">
            <div className="panel-heading"><div><small>{panel === "product" ? activeProduct : "AUTO NEED"}</small><h2>{panel === "product" ? t("productDetails") : panel === "booking" ? t("bookingTitle") : panel === "checkout" ? t("checkoutTitle") : t("authTitle")}</h2></div><button className="close-button" onClick={closePanel} aria-label={t("close")}><Icon name="close" /></button></div>
            {panel === "product" && activeProduct && (() => {
              const product = productById(activeProduct);
              if (!product) return null;
              const reviews = product.reviews || [];
              const score = reviews.length ? reviews.reduce((sum, item) => sum + Number(item.rating), 0) / reviews.length : Number(product.rating || 0);
              return <div className="product-detail">
                <img className="detail-image" src={product.image} alt={localized(product.name)} />
                <div className="detail-copy"><span className="detail-category">{categoryName(product.category)} · {product.sku}</span><h2>{localized(product.name)}</h2><div className="detail-rating"><span className="stars">★★★★★</span> {score.toFixed(1)} ({(product.baseReviews || 0) + reviews.length} {t("reviews")})</div>
                  <strong className="detail-price">{money(product.price)}</strong><p>{localized(product.description)}</p><dl><div><dt>{t("compatibility")}</dt><dd>{product.compatibility || "—"}</dd></div><div><dt>{t("category")}</dt><dd>{categoryName(product.category)}</dd></div></dl>
                  <div className="detail-actions"><button className="gold-button" onClick={() => addToCart(product.id)}>{t("addCart")}</button><button className="outline-button" onClick={() => reserveProduct(product.id)}>{t("reserve")}</button></div>
                </div>
                <section className="reviews-section"><h3>{t("writeReview")}</h3>{reviews.length ? reviews.map((review, index) => <div className="review-row" key={`${review.name}-${index}`}><strong>{review.name}</strong><span className="stars">{"★".repeat(review.rating)}</span><p>{review.text}</p></div>) : <p className="muted">{t("noReviews")}</p>}
                  <form onSubmit={submitReview}><Stars value={reviewRating} onChange={setReviewRating} /><div className="review-input-row"><input name="review" placeholder={t("reviewPlaceholder")} required maxLength="300" /><button className="gold-button">{t("send")}</button></div></form>
                </section>
              </div>;
            })()}
            {panel === "booking" && <form className="form-stack modal-form" onSubmit={submitBooking}><p className="muted">{t("bookingText")}<br /><strong>{localized(productById(activeProduct)?.name)}</strong></p><label>{t("phone")}<input name="phone" type="tel" placeholder="+996 700 000 000" required /></label><button className="gold-button full-button">{t("reserve24")}</button></form>}
            {panel === "auth" && <div className="modal-form"><div className="auth-tabs"><button className={authMode === "signIn" ? "active" : ""} onClick={() => setAuthMode("signIn")}>{t("signIn")}</button><button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>{t("register")}</button></div><form className="form-stack" onSubmit={submitAuth}>
              {authMode === "register" && <label>{t("name")}<input name="name" minLength="2" required /></label>}<label>{t("phone")}<input name="phone" type="tel" required /></label><label>{t("password")}<input name="password" type="password" minLength="4" required /></label><button className="gold-button full-button">{authMode === "register" ? t("createAccount") : t("signIn")}</button>
            </form><p className="demo-note">{t("demoNote")}</p></div>}
            {panel === "checkout" && <form className="form-stack modal-form" onSubmit={submitOrder}>
              <label>{t("name")}<input name="name" defaultValue={user?.name || ""} required /></label><label>{t("phone")}<input name="phone" type="tel" defaultValue={user?.phone || ""} required /></label>
              <label>{t("deliveryType")}<select name="delivery"><option value="delivery">{t("delivery")}</option><option value="pickup">{t("pickup")}</option></select></label>
              <label>{t("address")}<input name="address" /></label><label>{t("payment")}<select name="payment"><option>{t("cash")}</option><option>{t("card")}</option></select></label>
              <div className="total-line"><span>{t("total")}</span><strong>{money(cartTotal)}</strong></div><button className="gold-button full-button">{t("placeOrder")}</button>
            </form>}
          </section>
        )}
      </div>}
    </div>
  );
}
