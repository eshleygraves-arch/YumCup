/* ===================================================
   YumCup - JavaScript Funksiyalari
   Mahsulotlar bazasi, Savat (Cart), Qidiruv va Filtr,
   Tarkibni (Ingredients) ko'rish modali, Dark Mode
   =================================================== */

// 0. Tungi rejim (Dark Mode)
function initTheme() {
  const savedTheme = localStorage.getItem('yumcup_theme') || 'light';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('yumcup_theme', theme);

  const toggles = document.querySelectorAll('.theme-btn');
  toggles.forEach(btn => {
    const icon = btn.querySelector('i');
    const label = btn.querySelector('.nav-btn-label');
    if (theme === 'dark') {
      if (icon) icon.className = 'fa-solid fa-sun';
      if (label) label.textContent = 'Kunduzgi';
      btn.setAttribute('title', "Kunduzgi rejimga o'tish");
    } else {
      if (icon) icon.className = 'fa-solid fa-moon';
      if (label) label.textContent = 'Tungi';
      btn.setAttribute('title', "Tungi rejimga o'tish");
    }
  });
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(newTheme === 'dark' ? "Tungi rejim yoqildi 🌙" : "Kunduzgi rejim yoqildi ☀️");
}

// Boshlang'ich yuklashda darhol qo'llash
initTheme();

// 1. Mahsulotlar ro'yxati (Pishiriqlar va Ichimliklar)
const productsData = [
  // --- PISHIRIQLAR & SHIRINLIKLAR ---
  {
    id: 1,
    name: "Pushti Velvet Tort",
    category: "pishiriq",
    subCat: "tort",
    price: 38000,
    unit: "bo'lak (220g)",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
    badge: "Xit",
    rating: 4.9,
    reviewsCount: 142,
    weight: "220 gr",
    calories: "385 kkal",
    shortDesc: "Yumshoq qizil-pushti biskvit va nozik qaymoqli Mascarpone kremi.",
    tarkibi: "Oliy navli bug'doy uni, tabiiy yangi qaymoq (33%), Mascarpone italyan pishlog'i, Belgiya oq shokoladi, tozalangan shakar, tuxum, Madagaskar tabiiy vanil ekstrakti, organik qulupnay pyuresi, sifatli sariyog' (82.5%).",
    allergenlar: "Sut mahsulotlari, kleykovina (gluten), tuxum."
  },
  {
    id: 2,
    name: "Qulupnayli Kapkeyk (Pushti)",
    category: "pishiriq",
    subCat: "kapkeyk",
    price: 24000,
    unit: "1 dona",
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=700&q=80",
    badge: "Tavsiya",
    rating: 5.0,
    reviewsCount: 98,
    weight: "120 gr",
    calories: "290 kkal",
    shortDesc: "Yangi qulupnay mevalari va pishloqli pushti krem bilan bezatilgan kapkeyk.",
    tarkibi: "Vanilli shirin biskvit asosi, yangi qulupnay bo'laklari, krem-chiz (cream cheese), sariyog', shakar upasi, tabiiy lavlagi va qulupnay sharbatidan pushti rang, bezak mevalar.",
    allergenlar: "Sut, tuxum, kleykovina."
  },
  {
    id: 3,
    name: "Fransuzcha Bodomli Kruassan",
    category: "pishiriq",
    subCat: "kruassan",
    price: 26000,
    unit: "1 dona (160g)",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    badge: "Yangi",
    rating: 4.8,
    reviewsCount: 76,
    weight: "160 gr",
    calories: "410 kkal",
    shortDesc: "Qat-qat qarsildoq xamir, ichida xushbo'y bodom kremi va qovurilgan bodom yaproqlari.",
    tarkibi: "Fransuz an'anaviy qatlama xamiri, toza sariyog' (82.5%), tuyilgan bodom uni (frangipane kremi), tuxum, shakar, bodom yong'og'i yaproqlari, vanil.",
    allergenlar: "Bodom (yong'oq), kleykovina, sut, tuxum."
  },
  {
    id: 4,
    name: "Malinali Makaron to'plami (6 dona)",
    category: "pishiriq",
    subCat: "desert",
    price: 58000,
    unit: "quti (6 dona)",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=700&q=80",
    badge: "Xit",
    rating: 4.9,
    reviewsCount: 115,
    weight: "180 gr",
    calories: "340 kkal",
    shortDesc: "Haqiqiy bodom unidan tayyorlangan nozik pushti makaronlar va malina ganashi.",
    tarkibi: "100% elangan bodom uni, shakar kukuni, yangi tovuq tuxumi oqi, yangi malina konfisi, Belgiya oq shokoladi ganashi, limon sharbati.",
    allergenlar: "Bodom, tuxum oqi, sut (oq shokolad)."
  },
  {
    id: 5,
    name: "Shokoladli Fondan (Lava Cake)",
    category: "pishiriq",
    subCat: "tort",
    price: 32000,
    unit: "1 porsiya (180g)",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    badge: "",
    rating: 4.8,
    reviewsCount: 88,
    weight: "180 gr",
    calories: "440 kkal",
    shortDesc: "Ichidan iliq quyuq Belgiya shokoladi oqib chiquvchi issiq shokoladli pishiriq.",
    tarkibi: "70% lik achchiq qora Belgiya shokoladi, sifatli sariyog', tuxum, oz miqdorda oliy navli bug'doy uni, jigar rang qamish shakari, kakao kukuni.",
    allergenlar: "Kleykovina, sut, tuxum."
  },
  {
    id: 6,
    name: "Nyu-York Qulupnayli Chizkeyki",
    category: "pishiriq",
    subCat: "tort",
    price: 36000,
    unit: "bo'lak (200g)",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
    badge: "Tavsiya",
    rating: 4.9,
    reviewsCount: 160,
    weight: "200 gr",
    calories: "370 kkal",
    shortDesc: "Philadelphia pishlog'idan tayyorlangan kremsimon chizkeyk va qulupnayli mevali sous.",
    tarkibi: "Philadelphia kremli pishlog'i, qumoq pechenye (Graham cracker) asosi, sariyog', qaymoq, limon qobig'i, yangi pishgan qulupnay sousi, shakar.",
    allergenlar: "Sut mahsulotlari, gluten."
  },
  {
    id: 7,
    name: "Belgiya Vafli (Mevali & Karamelli)",
    category: "pishiriq",
    subCat: "desert",
    price: 29000,
    unit: "1 porsiya (230g)",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=700&q=80",
    badge: "Yangi",
    rating: 4.7,
    reviewsCount: 54,
    weight: "230 gr",
    calories: "395 kkal",
    shortDesc: "Qarsildoq issiq vafli, shirin karamel, yangi banan va qulupnay bo'laklari bilan.",
    tarkibi: "Bug'doy uni, iliq sut, tuxum, xamirturush, sariyog', vanilli shakar, dengiz tuzi bilan tayyorlangan yumshoq karamel, yangi qulupnay va banan.",
    allergenlar: "Bug'doy, sut, tuxum."
  },
  {
    id: 8,
    name: "Pushti Qaymoqli Ekler (3 dona)",
    category: "pishiriq",
    subCat: "desert",
    price: 34000,
    unit: "to'plam (3 dona)",
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=700&q=80",
    badge: "",
    rating: 4.8,
    reviewsCount: 63,
    weight: "170 gr",
    calories: "320 kkal",
    shortDesc: "Yengil pishirilgan choux xamiri va nozik vanilli qaymoq, pushti glazur.",
    tarkibi: "Pishirilgan choux xamiri (tuxum, suv, un, sariyog'), diplomat vanilli kremi (qaynatma krem + ko'pirtirilgan qaymoq), oq shokoladli malinali pushti glazur.",
    allergenlar: "Tuxum, sut, bug'doy kleykovinasi."
  },

  // --- ICHIMLIKLAR (DRINKS) ---
  {
    id: 9,
    name: "Pushti Qulupnayli Milkshake",
    category: "ichimlik",
    subCat: "sovuq-ichimlik",
    price: 28000,
    unit: "450 ml",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    badge: "Xit",
    rating: 5.0,
    reviewsCount: 210,
    weight: "450 ml",
    calories: "310 kkal",
    shortDesc: "Yangi qulupnay, qaymoqli plombir muzqaymog'i va ko'pirtirilgan pushti qaymoq.",
    tarkibi: "Tabiiy yangi qulupnay, qaymoqli vanil plombir muzqaymog'i, 3.2% li toza pasterizatsiyalangan sut, qulupnayli tabiiy sirop, ko'pirtirilgan nozik qaymoq, pushti qandolat sepmasi.",
    allergenlar: "Sut mahsulotlari (laktoza)."
  },
  {
    id: 10,
    name: "Muzdek Karamelli Makiyato",
    category: "ichimlik",
    subCat: "sovuq-ichimlik",
    price: 27000,
    unit: "400 ml",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
    badge: "Tavsiya",
    rating: 4.9,
    reviewsCount: 178,
    weight: "400 ml",
    calories: "220 kkal",
    shortDesc: "100% Arabica espresso, sovuq sut, muz kubiklari va qalin karamel sousi.",
    tarkibi: "Yangi tortilgan 100% Arabica qahva donalari (espresso do'zasi), muzdek toza sigir suti, tabiiy vanil ekstrakti siropi, tozalangan muz kubiklari, qaymoqli karamel sousi.",
    allergenlar: "Sut (o'simlik suti bilan almashtirish mumkin: bodom, soya, suli)."
  },
  {
    id: 11,
    name: "Malina va Yalpizli Yangi Limonad",
    category: "ichimlik",
    subCat: "sovuq-ichimlik",
    price: 25000,
    unit: "500 ml",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    badge: "Yangi",
    rating: 4.9,
    reviewsCount: 95,
    weight: "500 ml",
    calories: "120 kkal",
    shortDesc: "Muzdek tetiklashtiruvchi malina sharbati, yangi yalpiz va laym bo'laklari.",
    tarkibi: "Tabiiy malina pyuresi, yangi uzilgan xushbo'y yalpiz barglari, yangi siqilgan laym va limon sharbati, tabiiy qamish shakari siropi, gazlangan toza buloq suvi, muz.",
    allergenlar: "Allergen mavjud emas (100% vegan va tabiiy)."
  },
  {
    id: 12,
    name: "Pushti Ko'pikli Matcha Latte",
    category: "ichimlik",
    subCat: "issiq-ichimlik",
    price: 31000,
    unit: "350 ml",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&q=80",
    badge: "Tavsiya",
    rating: 4.8,
    reviewsCount: 82,
    weight: "350 ml",
    calories: "180 kkal",
    shortDesc: "Yaponiyaning Uji matcha yashil choyi, ko'pirtirilgan sut va pushti gul ko'pigi.",
    tarkibi: "Yaponiyaning eng oliy toifali 'Ceremonial Grade' Uji matcha kukuni, iliq suli (oat) yoki tabiiy sut, lavanda va atirgul tabiiy ekstrakti, nozik pushti sut ko'pigi.",
    allergenlar: "Sut mahsuloti (oat sutida laktozasiz)."
  },
  {
    id: 13,
    name: "Marshmou bilan Issiq Belgiya Shokoladi",
    category: "ichimlik",
    subCat: "issiq-ichimlik",
    price: 29000,
    unit: "320 ml",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=700&q=80",
    badge: "Xit",
    rating: 4.9,
    reviewsCount: 135,
    weight: "320 ml",
    calories: "340 kkal",
    shortDesc: "Quyuq qaynoq Belgiya sutli shokoladi, vanil va eruvchan pushti zefirchalar.",
    tarkibi: "Haqiqiy Belgiya sutli shokoladi (Callebaut), yog'li qaynatilgan yangi sut, kakao moyi, vanil, mayin pushti va oq mini-marshmou (zefir) bo'laklari.",
    allergenlar: "Sut, jelatin (marshmallow tarkibida)."
  },
  {
    id: 14,
    name: "Yovvoyi Rezavorli Xushbo'y Choy (Choynak)",
    category: "ichimlik",
    subCat: "issiq-ichimlik",
    price: 22000,
    unit: "700 ml (choynak)",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80",
    badge: "",
    rating: 4.8,
    reviewsCount: 67,
    weight: "700 ml",
    calories: "45 kkal",
    shortDesc: "Karkade, qora smorodina, malina, tog' yalpizi va tabiiy asal bilan damlangan choy.",
    tarkibi: "Misr karkade (gibiskus) gullari, quritilgan o'rmon mevalari (qora smorodina, malina, maymunjon), tog' yalpizi, apelsin qobig'i, alohida taqdim etiladigan tabiiy tog' asal.",
    allergenlar: "Asal (agar asalga allergiyangiz bo'lsa, xabardor qiling)."
  }
];

// 2. Savat (Cart) Holati - localStorage bilan integratsiya
let cart = JSON.parse(localStorage.getItem('yumcup_cart')) || [];

// 2.1 Sevimlilar (Favorites) Holati - localStorage bilan integratsiya
let favorites = JSON.parse(localStorage.getItem('yumcup_favorites')) || [];

function saveFavorites() {
  localStorage.setItem('yumcup_favorites', JSON.stringify(favorites));
  updateFavoritesUI();
}

function updateFavoritesUI() {
  // Barcha sahifalardagi yurakcha hisoblagichlarini yangilash
  const favCounters = document.querySelectorAll('.fav-count');
  favCounters.forEach(el => el.textContent = favorites.length);

  // Ekranda ko'rinib turgan mahsulot kartalaridagi yurakchalarni yangilash
  document.querySelectorAll('.product-fav-btn').forEach(btn => {
    const pId = parseInt(btn.getAttribute('data-fav-id'), 10);
    if (pId) {
      const isFav = favorites.includes(pId);
      btn.classList.toggle('active', isFav);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      btn.setAttribute('title', isFav ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish");
    }
  });

  // Sevimlilar Drawer oynasini to'ldirish
  const favItemsContainer = document.getElementById('favItems');
  if (favItemsContainer) {
    if (favorites.length === 0) {
      favItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fa-regular fa-heart" style="color: var(--primary-pink); font-size: 3.5rem; margin-bottom: 15px; display: block;"></i>
          <p style="font-weight: 600; margin-bottom: 6px;">Sevimlilar ro'yxatingiz bo'sh</p>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Yoqqan pishiriq yoki ichimlikdagi yurakchani bosib, shu yerga to'plashingiz mumkin!
          </span>
        </div>
      `;
    } else {
      const favProducts = productsData.filter(p => favorites.includes(p.id));
      favItemsContainer.innerHTML = favProducts.map(p => `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${formatPrice(p.price)} so'm</div>
            <button class="btn btn-sm btn-primary" style="margin-top: 6px; padding: 4px 12px; font-size: 0.78rem;" onclick="addToCart(${p.id})">
              <i class="fa-solid fa-cart-plus"></i> Savatga qo'shish
            </button>
          </div>
          <button class="cart-item-remove" onclick="toggleFavorite(${p.id})" title="Sevimlilardan o'chirish">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');
    }
  }
}

function toggleFavorite(productId) {
  const pId = parseInt(productId, 10);
  const product = productsData.find(p => p.id === pId);
  const index = favorites.indexOf(pId);

  if (index !== -1) {
    favorites.splice(index, 1);
    showToast(product ? `"${product.name}" sevimlilardan olib tashlandi` : "Sevimlilardan olib tashlandi");
  } else {
    favorites.push(pId);
    showToast(product ? `"${product.name}" sevimlilarga qo'shildi! ❤️` : "Sevimlilarga qo'shildi! ❤️");
  }

  saveFavorites();

  // Agar hozirda "Sevimlilar" filtri bo'yicha ko'rayotgan bo'lsa, qayta render qilamiz
  if (typeof filterAndDisplayProducts === 'function' && typeof currentCategory !== 'undefined' && currentCategory === 'favorites') {
    filterAndDisplayProducts();
  }
  if (typeof handleFilterChange === 'function') {
    const mainCatChecked = document.querySelector('input[name="mainCat"]:checked');
    if (mainCatChecked && mainCatChecked.value === 'favorites') {
      handleFilterChange();
    }
  }
}

function toggleFavDrawer() {
  const drawer = document.getElementById('favDrawer');
  const overlay = document.getElementById('favOverlay');
  if (!drawer || !overlay) return;

  drawer.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : 'auto';
}

function addAllFavoritesToCart() {
  if (favorites.length === 0) {
    showToast("Sevimlilar ro'yxatingiz bo'sh!");
    return;
  }
  favorites.forEach(id => {
    const product = productsData.find(p => p.id === id);
    if (product) {
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
    }
  });
  saveCart();
  toggleFavDrawer();
  showToast("Barcha sevimli mahsulotlar savatga qo'shildi! 🛍️");
}

function clearFavorites() {
  if (favorites.length === 0) return;
  favorites = [];
  saveFavorites();
  showToast("Sevimlilar ro'yxati tozalandi");
  if (typeof filterAndDisplayProducts === 'function' && typeof currentCategory !== 'undefined' && currentCategory === 'favorites') {
    filterAndDisplayProducts();
  }
  if (typeof handleFilterChange === 'function') {
    const mainCatChecked = document.querySelector('input[name="mainCat"]:checked');
    if (mainCatChecked && mainCatChecked.value === 'favorites') {
      handleFilterChange();
    }
  }
}

function saveCart() {
  localStorage.setItem('yumcup_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartCounters = document.querySelectorAll('.cart-count');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalPriceEl = document.getElementById('cartTotalPrice');

  // Umumiy donalar soni
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounters.forEach(el => el.textContent = totalItemsCount);

  // Umumiy summa
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartTotalPriceEl) {
    cartTotalPriceEl.textContent = formatPrice(totalPrice) + " so'm";
  }

  // Agar cart containeri mavjud bo'lsa
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-basket-shopping"></i>
        <p style="font-weight: 600; margin-bottom: 6px;">Savatingiz hozircha bo'sh</p>
        <span style="font-size: 0.85rem; color: var(--text-muted);">Yoqimli pishiriq yoki tetiklashtiruvchi ichimlik tanlang!</span>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} so'm</div>
        <div class="cart-qty-control">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span class="qty-count">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="O'chirish">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`"${product.name}" savatga qo'shildi! 🛍️`);
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast("Mahsulot savatdan olib tashlandi");
}

function clearCart() {
  cart = [];
  saveCart();
}

// 3. Narxni chiroyli formatlash (masalan, 38 000)
function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// 4. Mahsulot kartasini render qilish
function renderProductCard(p) {
  let badgeHtml = '';
  if (p.badge === 'Xit') {
    badgeHtml = `<span class="badge badge-hot">Xit</span>`;
  } else if (p.badge === 'Yangi') {
    badgeHtml = `<span class="badge badge-new">Yangi</span>`;
  } else if (p.badge === 'Tavsiya') {
    badgeHtml = `<span class="badge badge-pink">Tavsiya</span>`;
  }

  const categoryLabel = p.category === 'pishiriq' ? '🍰 Shirinlik' : '🥤 Ichimlik';
  const isFav = favorites.includes(p.id);

  return `
    <div class="product-card" data-category="${p.category}" data-id="${p.id}">
      <div class="product-img-box">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
        <div class="product-badges">
          ${badgeHtml}
        </div>
        <button class="product-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${p.id}" onclick="toggleFavorite(${p.id})" title="${isFav ? 'Sevimlilardan o\'chirish' : 'Sevimlilarga qo\'shish'}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>

      <div class="product-content">
        <div class="product-meta">
          <span class="product-cat">${categoryLabel}</span>
          <span class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating} (${p.reviewsCount})</span>
        </div>

        <h3 class="product-title">${p.name}</h3>

        <!-- TARKIBI (Nimadan qilingani) qisqartma bloki -->
        <div class="product-ingredients-preview">
          <div class="ingredients-title">
            <i class="fa-solid fa-cookie-bite"></i> Tarkibi (Nimadan qilingan):
          </div>
          <div class="ingredients-text" title="${p.tarkibi}">
            ${p.tarkibi}
          </div>
          <span class="ingredient-more-link" onclick="openDetailsModal(${p.id})">
            Batafsil tarkibi va allergenlar &rarr;
          </span>
        </div>

        <div class="product-extra-info">
          <span><i class="fa-solid fa-scale-balanced"></i> ${p.weight}</span>
          <span><i class="fa-solid fa-fire-flame-curved"></i> ${p.calories}</span>
        </div>

        <div class="product-footer">
          <div class="product-price">
            ${formatPrice(p.price)} <small>so'm</small>
          </div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-cart-plus"></i> Savatga
          </button>
        </div>
      </div>
    </div>
  `;
}

// 5. Tarkibi haqida modal oynasi (Ingredients Modal)
function openDetailsModal(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;

  const modalEl = document.getElementById('detailsModal');
  if (!modalEl) return;

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeDetailsModal()">&times;</button>
    <img src="${p.image}" alt="${p.name}" class="modal-header-img">
    <div class="modal-body">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h2 class="modal-title font-display">${p.name}</h2>
        <div class="modal-price-tag">${formatPrice(p.price)} so'm</div>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 20px;">${p.shortDesc}</p>

      <div class="modal-section">
        <h4 class="modal-section-title">
          <i class="fa-solid fa-bowl-rice text-pink"></i> To'liq tarkibi va masalliqlari:
        </h4>
        <div class="modal-ingredients-list">
          ${p.tarkibi}
        </div>
      </div>

      <div class="modal-chips">
        <div class="modal-chip"><i class="fa-solid fa-scale-balanced text-pink"></i> Hajmi/Vazni: <strong>${p.weight}</strong></div>
        <div class="modal-chip"><i class="fa-solid fa-fire text-pink"></i> Energetik quvvat: <strong>${p.calories}</strong></div>
        <div class="modal-chip"><i class="fa-solid fa-star text-pink"></i> Baho: <strong>${p.rating} / 5.0</strong></div>
      </div>

      <div class="allergen-warning">
        <strong><i class="fa-solid fa-triangle-exclamation"></i> Allergenlar haqida ogohlantirish:</strong><br>
        ${p.allergenlar}
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" style="flex: 1;" onclick="addToCart(${p.id}); closeDetailsModal();">
          <i class="fa-solid fa-cart-shopping"></i> Savatga qo'shish (${formatPrice(p.price)} so'm)
        </button>
        <button class="btn btn-outline" onclick="closeDetailsModal();">Yopish</button>
      </div>
    </div>
  `;

  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  const modalEl = document.getElementById('detailsModal');
  if (modalEl) {
    modalEl.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// 6. Toast Bildirishnoma (Xabarnoma)
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-pink"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// 8. Savat Offcanvas Drawer boshqaruvi
function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;

  drawer.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : 'auto';
}

// 9. Buyurtma berish Modal oynasi (Checkout)
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Savatingiz bo'sh! Avval mahsulot tanlang.");
    return;
  }
  toggleCartDrawer(); // savatni yopish

  const checkoutModal = document.getElementById('checkoutModal');
  if (!checkoutModal) return;

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const checkoutTotalEl = document.getElementById('checkoutTotalSum');
  if (checkoutTotalEl) {
    checkoutTotalEl.textContent = formatPrice(totalSum) + " so'm";
  }

  checkoutModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function submitOrder(e) {
  e.preventDefault();
  const nameInput = document.getElementById('orderName');
  const phoneInput = document.getElementById('orderPhone');
  const addressInput = document.getElementById('orderAddress');
  const paymentSelect = document.getElementById('orderPayment');

  if (!nameInput.value || !phoneInput.value || !addressInput.value) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  // Buyurtma muvaffaqiyatli qabul qilindi
  const orderSummary = `Rahmat, ${nameInput.value}! Buyurtmangiz qabul qilindi. Tez orada kuryerimiz siz bilan bog'lanadi.`;
  alert(orderSummary);

  clearCart();
  closeCheckoutModal();
  showToast("Buyurtma rasmiylashtirildi! Yoqimli ishtaha! 🎂");
}

// 10. Mobil Menyuni boshqarish
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// Sahifa yuklanganda ishga tushadigan umumiy sozlamalar
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCartUI();
  updateFavoritesUI();

  // Overlaylarni bosganda modalni yopish
  const detailsModal = document.getElementById('detailsModal');
  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) closeDetailsModal();
    });
  }

  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }

  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', toggleCartDrawer);
  }

  const favOverlay = document.getElementById('favOverlay');
  if (favOverlay) {
    favOverlay.addEventListener('click', toggleFavDrawer);
  }
});
