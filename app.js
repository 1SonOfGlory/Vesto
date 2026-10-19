const CONTACTS = {
  whatsapp: "2332029689978",
  email: "jabessomane19@gmail.com",
  paystackPublicKey: "pk_test_replace_with_your_live_key"
};

const deliveryFees = { Accra: 40, Kumasi: 70, Takoradi: 85, Tamale: 110, "Cape Coast": 75, Other: 120 };
const bundles = [
  { title: "Wedding Squad Package", description: "Groom + 4 groomsmen styling package with priority delivery.", price: 6800 },
  { title: "Graduation Premium Package", description: "Suit rental + styling support + photoshoot-ready accessory guide.", price: 1400 },
  { title: "Executive Presence Package", description: "2 premium suits for 30-day rotation with polish and concierge support.", price: 3900 },
  { title: "Church Leadership Package", description: "Coordinated formal looks for pastors and ministers.", price: 3200 }
];

const products = [
  { id: 1, name: "Brown Double-Breasted", type: "3-Piece", price: 2100, rent: 320, img: "assets/images/brown-double.jpg", sizes: "M, L, XL", eta: "24-48h nationwide", styleTips: { occasions: "Executives, church leadership, formal dinners", pairing: "White shirt, tan tie, brown monk straps", colors: "Brown, cream, muted gold" } },
  { id: 2, name: "Burgundy Power Blazer", type: "2-Piece", price: 1600, rent: 250, img: "assets/images/burgundy.jpg", sizes: "S, M, L", eta: "24-72h nationwide", styleTips: { occasions: "Graduation shoots, date nights, networking events", pairing: "Cream pants, white shirt, loafers", colors: "Burgundy, beige, ivory" } },
  { id: 3, name: "Grey Executive Double", type: "2-Piece", price: 1750, rent: 260, img: "assets/images/grey-double.jpg", sizes: "M, L, XL", eta: "24-48h nationwide", styleTips: { occasions: "Board meetings, pitches, corporate portraits", pairing: "Navy tie, white pocket square, black derbies", colors: "Grey, navy, black" } },
  { id: 4, name: "Emerald Pinstripe Statement", type: "Tuxedo", price: 2400, rent: 390, img: "assets/images/green-stripe.jpg", sizes: "L, XL", eta: "48-72h nationwide", styleTips: { occasions: "Award nights, premium receptions", pairing: "Gold tie, black cap-toe shoes", colors: "Emerald, gold, black" } },
  { id: 5, name: "Ivory Signature Ceremony", type: "Wedding", price: 2300, rent: 360, img: "assets/images/cream-boutique.jpg", sizes: "M, L", eta: "24-72h nationwide", styleTips: { occasions: "Weddings, engagement ceremonies, groom portraits", pairing: "Chocolate trousers, textured tie, brown loafers", colors: "Ivory, tan, chocolate" } },
  { id: 6, name: "Studio Classic Portrait Suit", type: "Photoshoot", price: 1800, rent: 280, img: "assets/images/studio-brown.jpg", sizes: "S, M, L", eta: "24-48h nationwide", styleTips: { occasions: "Brand shoots, social campaigns", pairing: "Pinstripe shirt, statement watch, polished oxfords", colors: "Charcoal, brown, deep green" } }
];

const styleCards = [
  { title: "Graduation Season", text: "Premium graduation portraits and ceremony styling.", images: ["assets/images/grad-1.jpg", "assets/images/grad-2.jpg", "assets/images/grad-3.jpg", "assets/images/grad-4.jpg"] },
  { title: "Business Executives", text: "Investor meetings, summits, and boardroom presence.", images: ["assets/images/hero-african.jpg", "assets/images/brown-double.jpg", "assets/images/grey-double.jpg"] },
  { title: "Weddings & Groomsmen", text: "Coordinated looks for groomsmen and best men.", images: ["assets/images/groomsmen-1.jpg", "assets/images/groomsmen-2.jpg", "assets/images/groomsmen-3.jpg"] },
  { title: "Pastors & Ministers", text: "Refined looks for services and ministry events.", images: ["assets/images/brown-double.jpg", "assets/images/green-stripe.jpg", "assets/images/cream-boutique.jpg"] },
  { title: "Photoshoots", text: "Creative editorials and identity portraits.", images: ["assets/images/studio-brown.jpg", "assets/images/burgundy.jpg", "assets/images/hero-african.jpg"] },
  { title: "Special Events", text: "Award nights, galas, and speaking engagements.", images: ["assets/images/cream-boutique.jpg", "assets/images/green-stripe.jpg", "assets/images/burgundy.jpg"] }
];

const byId = (id) => document.getElementById(id);
const productsEl = byId("products");
const useGrid = byId("useGrid");
const bundleGrid = byId("bundleGrid");
const adminOrders = byId("adminOrders");
const closetPanel = byId("closetPanel");
const closetBtn = byId("closetBtn");
const closeCloset = byId("closeCloset");
const closetItems = byId("closetItems");
const closetCount = byId("closetCount");
const totalItems = byId("totalItems");
const estimatedValue = byId("estimatedValue");
const palettePicker = byId("palettePicker");
const downloadLogsBtn = byId("downloadLogsBtn");
const scrollBar = byId("scrollBar");
const prevSlide = byId("prevSlide");
const nextSlide = byId("nextSlide");
const styleDialog = byId("styleDialog");
const styleContent = byId("styleContent");
const closeStyleDialog = byId("closeStyleDialog");
const userPhoto = byId("userPhoto");
const suitPicker = byId("suitPicker");
const previewMode = byId("previewMode");
const userPreview = byId("userPreview");
const suitPreview = byId("suitPreview");
const tryonPanes = document.querySelectorAll(".tryon-pane");
const checkoutBtn = byId("checkoutBtn");
const checkoutDialog = byId("checkoutDialog");
const closeCheckoutDialog = byId("closeCheckoutDialog");
const payNowBtn = byId("payNowBtn");
const confirmOrderBtn = byId("confirmOrderBtn");
const checkoutSubtotal = byId("checkoutSubtotal");
const checkoutDelivery = byId("checkoutDelivery");
const checkoutTotal = byId("checkoutTotal");
const customerName = byId("customerName");
const customerPhone = byId("customerPhone");
const customerEmail = byId("customerEmail");
const deliveryCity = byId("deliveryCity");
const deliveryAddress = byId("deliveryAddress");
const deliveryDate = byId("deliveryDate");
const orderType = byId("orderType");
const paymentMethod = byId("paymentMethod");

let wardrobe = [];
let slideIndex = 0;
const LOG_KEY = "vesto_trace_logs";

function money(v) { return `${v.toLocaleString()} GHS`; }
function toKobo(v) { return Math.round(v * 100); }
function traceId() { return `trace-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`; }

function writeLog(level, event, details = {}) {
  const entry = { id: traceId(), at: new Date().toISOString(), level, event, path: window.location.href, details };
  const logs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  logs.push(entry);
  if (logs.length > 300) logs.shift();
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  console[level === "error" ? "error" : "log"]("[VESTO_TRACE]", entry);
}

function subtotal() { return wardrobe.reduce((a, b) => a + (b.mode === "buy" ? b.price : b.rent), 0); }
function deliveryCost() { return deliveryFees[deliveryCity.value] || deliveryFees.Other; }
function grandTotal() { return subtotal() + deliveryCost(); }

function refreshCheckoutTotals() {
  checkoutSubtotal.textContent = money(subtotal());
  checkoutDelivery.textContent = money(deliveryCost());
  checkoutTotal.textContent = money(grandTotal());
}

function renderStore() {
  productsEl.innerHTML = products.map((p, idx) => `
    <article class="product" style="transition-delay:${idx * 80}ms"><div class="product-media" style="background-image:url('${p.img}')"></div><div class="product-body"><p class="eyebrow">${p.type}</p><h3>${p.name}</h3><p class="price">Buy: ${money(p.price)} | Rent/day: ${money(p.rent)}</p><p>Sizes: ${p.sizes} | Delivery: ${p.eta}</p><div class="mode"><button class="active" data-mode="rent">Rent for 24h</button><button data-mode="buy">Own Forever</button></div><div class="actions"><button class="add-btn" data-id="${p.id}">Add To Wardrobe</button><button class="details-btn" data-detail="${p.id}">Style Guide</button></div></div></article>
  `).join("");
}

function renderBundles() {
  bundleGrid.innerHTML = bundles.map((bundle) => `<article class="step-card"><h3>${bundle.title}</h3><p>${bundle.description}</p><p class="price">From ${money(bundle.price)}</p></article>`).join("");
}

function renderStyleCards() {
  useGrid.innerHTML = styleCards.map((c, i) => `<article class="use-card" data-idx="${i}" style="background-image:linear-gradient(170deg,rgba(0,0,0,.1),rgba(0,0,0,.65)),url('${c.images[0]}')"><h3>${c.title}</h3><p>${c.text}</p></article>`).join("");
}

function rotateStyleImages() {
  document.querySelectorAll(".use-card").forEach((card) => {
    const idx = Number(card.dataset.idx);
    const imgs = styleCards[idx].images;
    let current = 0;
    setInterval(() => {
      current = (current + 1) % imgs.length;
      card.style.backgroundImage = `linear-gradient(170deg,rgba(0,0,0,.1),rgba(0,0,0,.65)),url('${imgs[current]}')`;
    }, 6800 + idx * 220);
  });
}

function renderWardrobe() {
  closetCount.textContent = wardrobe.length;
  totalItems.textContent = wardrobe.length;
  estimatedValue.textContent = money(subtotal());
  closetItems.innerHTML = wardrobe.length ? wardrobe.map((item) => `<article class="wardrobe-item"><strong>${item.name}</strong><p>${item.mode === "buy" ? `Own - ${money(item.price)}` : `Rent - ${money(item.rent)}`}</p></article>`).join("") : `<p style="color:var(--muted)">Your wardrobe is empty. Add your first suit.</p>`;
  refreshCheckoutTotals();
}

function updateSlider() {
  const card = productsEl.querySelector(".product");
  if (!card) return;
  const style = getComputedStyle(productsEl);
  const gap = parseFloat(style.columnGap || style.gap || "16");
  const step = card.getBoundingClientRect().width + gap;
  slideIndex = Math.min(Math.max(slideIndex, 0), Math.max(0, products.length - 1));
  productsEl.style.transform = `translateX(${-slideIndex * step}px)`;
}

function showStyleGuide(productId) {
  const p = products.find((x) => x.id === productId);
  if (!p) return;
  styleContent.innerHTML = `<h2>${p.name}</h2><p><strong>Best Occasions:</strong> ${p.styleTips.occasions}</p><p><strong>Pair It With:</strong> ${p.styleTips.pairing}</p><p><strong>Color Pairing:</strong> ${p.styleTips.colors}</p>`;
  styleDialog.showModal();
}

function validateCheckout() {
  if (!wardrobe.length) throw new Error("Please add at least one item to wardrobe before checkout.");
  if (!customerName.value.trim() || !customerPhone.value.trim() || !customerEmail.value.trim()) throw new Error("Please fill customer details.");
  if (!deliveryAddress.value.trim() || !deliveryDate.value) throw new Error("Please fill delivery details.");
}

function buildPayload(paymentRef = "Pending", paymentStatus = "unpaid") {
  return {
    customerName: customerName.value.trim(),
    customerPhone: customerPhone.value.trim(),
    customerEmail: customerEmail.value.trim(),
    city: deliveryCity.value,
    address: deliveryAddress.value.trim(),
    deliveryDate: deliveryDate.value,
    orderType: orderType.value,
    paymentMethod: paymentMethod.value,
    paymentRef,
    paymentStatus,
    subtotal: subtotal(),
    deliveryFee: deliveryCost(),
    total: grandTotal(),
    items: wardrobe.map((w) => ({ id: w.id, name: w.name, mode: w.mode, price: w.mode === "buy" ? w.price : w.rent }))
  };
}

async function saveOrder(payload) {
  const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "Could not save order");
  return data.order;
}

function orderSummary(order) {
  const items = order.items.map((i) => `${i.name} (${i.mode})`).join(", ");
  return [
    `Invoice: ${order.invoiceId}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Email: ${order.customerEmail}`,
    `City: ${order.city}`,
    `Address: ${order.address}`,
    `Delivery Date: ${order.deliveryDate}`,
    `Items: ${items}`,
    `Subtotal: ${money(order.subtotal)}`,
    `Delivery: ${money(order.deliveryFee)}`,
    `Total: ${money(order.total)}`,
    `Payment Ref: ${order.paymentRef}`
  ].join("\n");
}

function notifyViaWhatsAppAndEmail(order) {
  const summary = orderSummary(order);
  const waUrl = `https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(`Hello Vesto Atelier,\n\n${summary}`)}`;
  const mailUrl = `mailto:${CONTACTS.email}?subject=${encodeURIComponent(`New Order ${order.invoiceId}`)}&body=${encodeURIComponent(summary)}`;
  window.open(waUrl, "_blank");
  window.location.href = mailUrl;
}

function renderAdminOrders(orders) {
  if (!adminOrders) return;
  adminOrders.innerHTML = orders.length ? orders.map((o) => `
    <article class="wardrobe-item">
      <strong>${o.invoiceId}</strong>
      <p>${o.customerName} - ${money(o.total)} - ${o.paymentStatus || "unpaid"}</p>
      <p>Status: <strong>${o.status}</strong></p>
      <div class="actions">
        <button class="details-btn admin-status" data-id="${o.id}" data-status="Pending">Pending</button>
        <button class="details-btn admin-status" data-id="${o.id}" data-status="Out for Delivery">Out for Delivery</button>
        <button class="details-btn admin-status" data-id="${o.id}" data-status="Delivered">Delivered</button>
      </div>
    </article>`).join("") : `<p style="color:var(--muted)">No orders yet.</p>`;
}

async function loadAdminOrders() {
  try {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (data.ok) renderAdminOrders(data.orders);
  } catch (err) {
    writeLog("error", "load_admin_orders_failed", { message: err.message });
  }
}

async function updateOrderStatus(id, status) {
  await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  loadAdminOrders();
}

async function completeOrder(paymentRef, paymentStatus) {
  validateCheckout();
  const order = await saveOrder(buildPayload(paymentRef, paymentStatus));
  notifyViaWhatsAppAndEmail(order);
  wardrobe = [];
  renderWardrobe();
  checkoutDialog.close();
  alert(`Order placed. Invoice: ${order.invoiceId}`);
  loadAdminOrders();
}

function payWithPaystack() {
  if (!window.PaystackPop) throw new Error("Paystack script not loaded.");
  if (CONTACTS.paystackPublicKey.includes("replace")) throw new Error("Update CONTACTS.paystackPublicKey in app.js first.");
  const handler = window.PaystackPop.setup({
    key: CONTACTS.paystackPublicKey,
    email: customerEmail.value,
    amount: toKobo(grandTotal()),
    currency: "GHS",
    ref: `VESTO-${Date.now()}`,
    callback: async (response) => { await completeOrder(response.reference, "paid"); },
    onClose: () => writeLog("info", "paystack_closed")
  });
  handler.openIframe();
}

productsEl.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest(".mode button");
  if (toggleBtn) {
    const wrap = toggleBtn.closest(".mode");
    wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    toggleBtn.classList.add("active");
  }
  const detailsBtn = e.target.closest(".details-btn");
  if (detailsBtn && detailsBtn.dataset.detail) return showStyleGuide(Number(detailsBtn.dataset.detail));
  const addBtn = e.target.closest(".add-btn");
  if (!addBtn) return;
  const card = addBtn.closest(".product");
  const item = products.find((p) => p.id === Number(addBtn.dataset.id));
  wardrobe.push({ ...item, mode: card.querySelector(".mode .active").dataset.mode });
  renderWardrobe();
  closetPanel.classList.add("open");
});

if (adminOrders) {
  adminOrders.addEventListener("click", async (e) => {
    const btn = e.target.closest(".admin-status");
    if (!btn) return;
    await updateOrderStatus(btn.dataset.id, btn.dataset.status);
  });
}

closetBtn.addEventListener("click", () => closetPanel.classList.toggle("open"));
closeCloset.addEventListener("click", () => closetPanel.classList.remove("open"));
palettePicker.addEventListener("change", (e) => document.documentElement.setAttribute("data-theme", e.target.value));
if (prevSlide && nextSlide) {
  prevSlide.addEventListener("click", () => { slideIndex -= 1; updateSlider(); });
  nextSlide.addEventListener("click", () => { slideIndex += 1; updateSlider(); });
}
closeStyleDialog.addEventListener("click", () => styleDialog.close());
checkoutBtn.addEventListener("click", () => { refreshCheckoutTotals(); checkoutDialog.showModal(); });
closeCheckoutDialog.addEventListener("click", () => checkoutDialog.close());
deliveryCity.addEventListener("change", refreshCheckoutTotals);
payNowBtn.addEventListener("click", async () => { try { validateCheckout(); payWithPaystack(); } catch (error) { alert(error.message); } });
confirmOrderBtn.addEventListener("click", async () => { try { await completeOrder("Manual confirmation", "pending"); } catch (error) { alert(error.message); } });

userPhoto.addEventListener("change", () => { const file = userPhoto.files?.[0]; if (file) userPreview.src = URL.createObjectURL(file); });
suitPicker.addEventListener("change", () => {
  const suit = products.find((p) => String(p.id) === suitPicker.value);
  if (suit) { suitPreview.style.opacity = "0"; setTimeout(() => { suitPreview.src = suit.img; suitPreview.style.opacity = "1"; }, 180); }
});
previewMode.addEventListener("change", () => {
  const suitOnly = previewMode.value === "suit";
  tryonPanes[0].style.display = suitOnly ? "none" : "block";
  tryonPanes[1].style.display = "block";
});

if (downloadLogsBtn) {
  downloadLogsBtn.addEventListener("click", () => {
    const logs = localStorage.getItem(LOG_KEY) || "[]";
    const blob = new Blob([logs], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vesto-trace-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
  });
}

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("show"); }), { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
const inObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in"); }), { threshold: 0.15 });
window.addEventListener("scroll", () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = `${h > 0 ? (s / h) * 100 : 0}%`;
});
window.addEventListener("resize", updateSlider);

function init() {
  renderStore();
  renderBundles();
  renderStyleCards();
  rotateStyleImages();
  renderWardrobe();
  updateSlider();
  suitPicker.innerHTML = products.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  suitPicker.value = String(products[0].id);
  suitPreview.src = products[0].img;
  document.querySelectorAll(".product, .use-card").forEach((el) => inObserver.observe(el));
  setTimeout(() => document.querySelector(".hero-copy")?.classList.add("show"), 260);
  loadAdminOrders();
}

init();
