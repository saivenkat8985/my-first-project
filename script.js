(() => {
  const OWNER_PHONE = "916302609140";
  const USERS_KEY = "onion_users";
  const ORDERS_KEY = "onion_orders";

  const loginScreen = document.getElementById("loginScreen");
  const appScreen = document.getElementById("appScreen");
  const installBtn = document.querySelector(".install-btn");

  let deferredPrompt = null;

  // Hide install button initially
  if (installBtn) installBtn.style.display = "none";

  // PWA install handling
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = "block";
  });

  window.installApp = async () => {
    if (!deferredPrompt) {
      alert("Use browser menu → Install App");
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt = null;
  };

  // Auto login
  if (localStorage.getItem("loggedInUser")) {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    renderOrders();
  }

  window.login = () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const existing = users.find(u => u.email === email);

    if (!existing) {
      users.push({ name, email, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } else if (existing.password !== password) {
      alert("Wrong password");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    renderOrders();
  };

  window.orderOnion = () => {
    const qty = document.getElementById("qty").value;
    const line = document.getElementById("line").value;

    if (!qty || qty <= 0 || !line) {
      alert("Enter quantity and select line");
      return;
    }

    const address = prompt("Enter house address:");
    if (!address) return;

    let orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    orders.push({ qty, line, address, time: new Date().toLocaleString() });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    renderOrders();

    const msg =
`🧅 New Onion Order
Qty: ${qty} Kg
Line: ${line}
Address: ${address}`;

    window.open(
      `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  function renderOrders() {
    const list = document.getElementById("customerList");
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    list.innerHTML = orders.length === 0
      ? "<li>No orders yet</li>"
      : orders.map((o, i) =>
          `<li>${i + 1}. ${o.qty} Kg | ${o.line}</li>`
        ).join("");
  }
})();
s